FROM python:3.11-slim

# Install system dependencies required by OpenCV & PyTorch
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV PORT=7860 \
    PYTHONUNBUFFERED=1

# Copy and install AI dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy detector app and trained model weights
COPY main.py .
COPY best.pt .

# Hugging Face Spaces listens on port 7860
EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]

