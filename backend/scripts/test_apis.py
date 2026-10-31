import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Test DGIdb
try:
    url = "https://dgidb.org/api/graphql"
    query = {"query": "{ genes(names: [\"TP53\"]) { nodes { name } } }"}
    req = urllib.request.Request(
        url,
        data=json.dumps(query).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "GeneRx/1.0"}
    )
    with urllib.request.urlopen(req, timeout=8, context=ctx) as res:
        print("DGIdb GraphQL response:", res.status, res.read().decode("utf-8")[:200])
except Exception as e:
    print("DGIdb GraphQL error:", e)

# Test DGIdb v2
try:
    url = "https://dgidb.org/api/v2/interactions.json?genes=TP53"
    req = urllib.request.Request(url, headers={"User-Agent": "GeneRx/1.0"})
    with urllib.request.urlopen(req, timeout=8, context=ctx) as res:
        print("DGIdb v2 response:", res.status, res.read().decode("utf-8")[:200])
except Exception as e:
    print("DGIdb v2 error:", e)

# Test PharmGKB
try:
    url = "https://api.pharmgkb.org/v1/data/clinicalAnnotation"
    req = urllib.request.Request(url, headers={"User-Agent": "GeneRx/1.0"})
    with urllib.request.urlopen(req, timeout=8, context=ctx) as res:
        print("PharmGKB response:", res.status)
except Exception as e:
    print("PharmGKB error:", e)
