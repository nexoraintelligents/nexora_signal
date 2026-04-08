FROM python:3.14-rc-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r crawler/requirements.txt

EXPOSE 8080

WORKDIR /app/crawler

CMD ["python3", "start.py"]
