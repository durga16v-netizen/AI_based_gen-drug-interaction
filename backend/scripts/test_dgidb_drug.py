import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

query = {
    "query": """
    query {
      drugs(names: ["ASPIRIN", "IMATINIB"]) {
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
}

try:
    req = urllib.request.Request(
        "https://dgidb.org/api/graphql",
        data=json.dumps(query).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "GeneRx/1.0"}
    )
    with urllib.request.urlopen(req, timeout=12, context=ctx) as res:
        data = json.loads(res.read().decode("utf-8"))
        print("DGIdb drug query check:")
        drugs = data.get("data", {}).get("drugs", {}).get("nodes", [])
        for d in drugs:
            print(f"Drug {d.get('name')}: {len(d.get('interactions', []))} interactions")
            if d.get("interactions"):
                print("Sample interaction:", d["interactions"][0])
except Exception as e:
    print("Error:", e)
