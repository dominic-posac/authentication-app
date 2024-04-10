## How to run authentication-app
1. build image:
```
docker build -t authentication-app .
```
2. create/run container:
```
docker run --name authentication-app -dp 127.0.0.1:8080:8080 authentication-app
```
3. App will be running at:
```
http://localhost:8080/
```