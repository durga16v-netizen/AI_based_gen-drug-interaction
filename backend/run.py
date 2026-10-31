"""
GeneRx - Backend Server Runner
"""

import os
import sys

# Ensure project root is in sys.path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

import uvicorn

if __name__ == "__main__":
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8000"))
    app_target = "backend.app.main:app" if os.path.exists("backend") else "app.main:app"
    uvicorn.run(app_target, host=host, port=port, reload=False)
