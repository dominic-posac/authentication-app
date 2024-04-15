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
docker build -t authentication-app .
```
2. Run Container:
```
docker run -dp 127.0.0.1:8080:8080 -v "$(pwd):/app" --name authentication-app authentication-app
```
3. App will be running at:
```
http://localhost:8080/
```

## ENVs needed
```
PORT=
REGISTRATION_EMAIL_ADDRESS=
REGISTRATION_EMAIL_PASSWORD=
ACTIVE_DB=

DB_HOST=
DB_NAME=
DB_USER=
DB_PASSWORD=
```