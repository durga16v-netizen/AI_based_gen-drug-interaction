"""
GeneRx - DGIdb API Service
Integrates DGIdb v5 GraphQL endpoint with intelligent fallbacks and curated benchmark data.
"""

import os
import json
import httpx
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

# Load curated interactions from disk
CURATED_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "curated_dgi.json")
_curated_data = None

def get_curated_data() -> Dict[str, Any]:
    global _curated_data
    if _curated_data is None and os.path.exists(CURATED_PATH):
        try:
            with open(CURATED_PATH, "r", encoding="utf-8") as f:
                _curated_data = json.load(f)
        except Exception as e:
            logger.error(f"Failed to load curated DGI data: {e}")
            _curated_data = {"interactions": [], "drug_properties": {}, "gene_properties": {}}
    return _curated_data or {"interactions": [], "drug_properties": {}, "gene_properties": {}}

async def query_dgidb_gene(gene_symbol: str) -> List[Dict[str, Any]]:
    """Query DGIdb v5 GraphQL for all drugs interacting with gene."""
    cleaned = gene_symbol.strip().upper()
    graphql_url = "https://dgidb.org/api/graphql"
    query_str = """
    query GetGeneInteractions($names: [String!]!) {
      genes(names: $names) {
        nodes {
          name
          interactions {
            drug {
              name
              conceptId
            }
            interactionScore
            interactionTypes {
              type
              directionality
            }
            publications {
              pmid
            }
            sources {
              sourceDbName
            }
          }
        }
      }
    }
    """
    results = []
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(
                graphql_url,
                json={"query": query_str, "variables": {"names": [cleaned]}},
                headers={"Content-Type": "application/json", "User-Agent": "GeneRx/1.0"}
            )
            if resp.status_code == 200:
                data = resp.json()
                genes_nodes = data.get("data", {}).get("genes", {}).get("nodes", [])
                if genes_nodes:
                    interactions = genes_nodes[0].get("interactions", [])
                    for item in interactions:
                        drug_obj = item.get("drug") or {}
                        drug_name = drug_obj.get("name", "").capitalize()
                        if not drug_name:
                            continue

                        # Interaction types
                        types = [t.get("type") for t in item.get("interactionTypes", []) if t.get("type")]
                        itype = ", ".join(types) if types else "Target Modulator"
                        
                        # Sources
                        sources = [s.get("sourceDbName") for s in item.get("sources", []) if s.get("sourceDbName")]
                        if not sources:
                            sources = ["DGIdb v5"]

                        # Publications
                        pmids = [str(p.get("pmid")) for p in item.get("publications", []) if p.get("pmid")]

                        results.append({
                            "gene": cleaned,
                            "drug": drug_name,
                            "type": itype,
                            "category": types[0] if types else "inhibitor",
                            "sources": sources,
                            "pmids": pmids,
                            "clinical_level": "Investigational / Database Curated",
                            "mechanism": f"{drug_name} interacts with human {cleaned} as annotated in {', '.join(sources[:3])}."
                        })
    except Exception as e:
        logger.warning(f"DGIdb GraphQL gene query failed for {gene_symbol}: {e}")

    # Merge with curated high-confidence interactions
    curated = get_curated_data().get("interactions", [])
    curated_matches = [rec for rec in curated if rec["gene"].upper() == cleaned]

    # Combine ensuring no duplicates
    seen_drugs = set()
    combined = []
    # Curated records take precedence
    for c in curated_matches:
        d_name = c["drug"].capitalize()
        seen_drugs.add(d_name.lower())
        combined.append(c)

    for r in results:
        d_name = r["drug"].lower()
        if d_name not in seen_drugs:
            seen_drugs.add(d_name)
            combined.append(r)

    return combined

async def query_dgidb_drug(drug_name: str) -> List[Dict[str, Any]]:
    """Query DGIdb v5 GraphQL for all genes targeted or metabolized by drug."""
    cleaned = drug_name.strip().upper()
    graphql_url = "https://dgidb.org/api/graphql"
    query_str = """
    query GetDrugInteractions($names: [String!]!) {
      drugs(names: $names) {
        nodes {
          name
          interactions {
            gene {
              name
              conceptId
            }
            interactionScore
            interactionTypes {
              type
            }
            publications {
              pmid
            }
            sources {
              sourceDbName
            }
          }
        }
      }
    }
    """
    results = []
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(
                graphql_url,
                json={"query": query_str, "variables": {"names": [cleaned]}},
                headers={"Content-Type": "application/json", "User-Agent": "GeneRx/1.0"}
            )
            if resp.status_code == 200:
                data = resp.json()
                drugs_nodes = data.get("data", {}).get("drugs", {}).get("nodes", [])
                if drugs_nodes:
                    for d_node in drugs_nodes:
                        interactions = d_node.get("interactions", [])
                        for item in interactions:
                            gene_obj = item.get("gene") or {}
                            gene_symbol = gene_obj.get("name", "").upper()
                            if not gene_symbol:
                                continue

                            types = [t.get("type") for t in item.get("interactionTypes", []) if t.get("type")]
                            itype = ", ".join(types) if types else "Pharmacological Target"
                            
                            sources = [s.get("sourceDbName") for s in item.get("sources", []) if s.get("sourceDbName")]
                            if not sources:
                                sources = ["DGIdb v5"]

                            pmids = [str(p.get("pmid")) for p in item.get("publications", []) if p.get("pmid")]

                            results.append({
                                "gene": gene_symbol,
                                "drug": drug_name.capitalize(),
                                "type": itype,
                                "category": types[0] if types else "inhibitor",
                                "sources": sources,
                                "pmids": pmids,
                                "clinical_level": "Investigational / Database Curated",
                                "mechanism": f"{drug_name.capitalize()} exhibits targeted activity on human {gene_symbol}."
                            })
    except Exception as e:
        logger.warning(f"DGIdb GraphQL drug query failed for {drug_name}: {e}")

    # Merge with curated records
    curated = get_curated_data().get("interactions", [])
    drug_lower = drug_name.strip().lower()
    curated_matches = [rec for rec in curated if rec["drug"].lower() == drug_lower or drug_lower in rec["drug"].lower()]

    seen_genes = set()
    combined = []
    for c in curated_matches:
        g = c["gene"].upper()
        seen_genes.add(g)
        combined.append(c)

    for r in results:
        g = r["gene"].upper()
        if g not in seen_genes:
            seen_genes.add(g)
            combined.append(r)

    return combined
