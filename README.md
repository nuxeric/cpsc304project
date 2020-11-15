# CPSC 304 Project

## Running the server

This will start the database and the backend server.

```bash
# To start
docker-compose up -d

# To close
docker-compose down
```

Anytime you make changes to the code, you will need to rebuild the backend's Docker image:

```bash
docker-compose build
docker-compose up -d
```

## Manually running the server

Docker Compose will do this for you. No need to run this manually.

```bash
cd backend
npm install
npm run build
npm start
```
