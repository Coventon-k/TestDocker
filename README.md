# MyStore Docker — Simulation locale

## Prérequis
- Docker Desktop installé (https://www.docker.com/products/docker-desktop/)
- C'est tout.

## Lancer le projet

```bash
# 1. Se placer dans le dossier
cd mystore-docker

# 2. Construire et lancer tous les containers
docker compose up -d --build

# 3. Tester l'API via Nginx (port 8080)
curl http://localhost:8080/api/health
curl http://localhost:8080/api/products
curl http://localhost:8080/api/products?category=boisson
curl http://localhost:8080/api/products/2

# Créer un produit (POST)
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Eau Evian 1L","price":0.80,"stock":50,"category":"boisson"}'
```

## Commandes utiles

```bash
# Voir les containers qui tournent
docker compose ps

# Logs en temps réel (tous les services)
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f api
docker compose logs -f nginx

# Ouvrir un shell dans le container Express
docker compose exec api sh

# Arrêter proprement
docker compose down
```

## Architecture

```
localhost:8080
      │
      ▼
┌──────────────┐
│    Nginx     │  (mystore-nginx)
│   :80        │
└──────┬───────┘
       │ proxy_pass http://api:3000/api/
       ▼
┌──────────────┐
│  Express API │  (mystore-api)
│   :3000      │  ← non exposé à l'extérieur !
└──────────────┘
```

## Routes disponibles

| Méthode | URL                              | Description              |
|---------|----------------------------------|--------------------------|
| GET     | /api/health                      | Statut de l'API          |
| GET     | /api/products                    | Tous les produits        |
| GET     | /api/products?category=boisson   | Filtrer par catégorie    |
| GET     | /api/products/:id                | Un produit               |
| POST    | /api/products                    | Créer un produit         |
# TestDocker
