FROM python:3.11-alpine

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5001

# Starting the backend server
CMD ["python", "./src/Main/server.py"]