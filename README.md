## How to run authentication-app with docker-compose.yml
1. Build image:
```
docker compose up -d
```
2. App will be running at:
```
http://localhost:8080/
```

## How to run authentication-app with Dockerfile
1. Build image:
```
docker compose up -d
```
2. Run Container:
```
docker build -t authentication-app .
```
3. App will be running at:
```
docker run -dp 127.0.0.1:8080:8080 -v "$(pwd):/app" --name authentication-app authentication-app
```