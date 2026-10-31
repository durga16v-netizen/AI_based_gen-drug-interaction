# ==============================================================================
# GeneRx - Fullstack Single-Container Dockerfile (FastAPI + React SPA)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build the React Frontend
# ------------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /build

COPY frontend/package*.json ./
RUN npm ci || npm install

COPY frontend/ ./
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Python Backend serving API and Frontend Static Files
# ------------------------------------------------------------------------------
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HOST=0.0.0.0 \
    PORT=8000 \
    PYTHONPATH=/app

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install backend dependencies
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend code
COPY backend/ /app/backend/

# Copy built frontend SPA assets from Stage 1
COPY --from=frontend-builder /build/dist /app/frontend/dist

# Configure frontend dist directory for FastAPI static file serving
ENV FRONTEND_DIST_PATH=/app/frontend/dist

# Expose unified port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Start server
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]

