import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Test query for gene interactions
query = {
    "query": """
    query {
      genes(names: ["TP53"]) {
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
}

try:
    req = urllib.request.Request(
        "https://dgidb.org/api/graphql",
        data=json.dumps(query).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "GeneRx/1.0"}
    )
    with urllib.request.urlopen(req, timeout=12, context=ctx) as res:
        data = json.loads(res.read().decode("utf-8"))
        print("DGIdb GraphQL schema check result:")
        nodes = data.get("data", {}).get("genes", {}).get("nodes", [])
        if nodes:
            interactions = nodes[0].get("interactions", [])
            print(f"Found {len(interactions)} interactions for TP53!")
            if interactions:
                print("First interaction:", interactions[0])
        else:
            print("Response:", data)
except Exception as e:
    print("Error:", e)
