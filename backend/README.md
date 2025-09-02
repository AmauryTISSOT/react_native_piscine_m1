# Backend Photo Management

Ce projet est un backend en **Go** pour la gestion de photos :

-   Upload de photos avec date et coordonnées GPS
-   Stockage sur le serveur
-   Récupération des photos et des informations associées

Le backend est containerisé via **Docker Compose** et utilise **PostgreSQL** comme base de données.

---

## Prérequis

-   [Docker](https://www.docker.com/get-started)
-   [Docker Compose](https://docs.docker.com/compose/install/)
-   Go 1.24+ si vous souhaitez exécuter le backend localement

---

## Lancer le projet avec Docker Compose

1. Depuis la racine du projet (où se trouve `docker-compose.yml`) :

```bash
docker-compose up -d
```

2. Les services seront créés :

**backend** : expose le port 8080

**db (PostgreSQL)** : port interne 5432 (non exposé par défaut)

---

## Configuration

Dossier des uploads : `./uploads` (volume Docker)

Port backend : `8080`

DB URL (dans le code) :

```txt
postgres://user:rby6014vtziqaRwF4VEINxfnaxtrIZCaX5@db:5432/photosdb
```

---

## Endpoints

| Endpoint             | Méthode | Description                                                                            |
| -------------------- | ------- | -------------------------------------------------------------------------------------- |
| `/upload`            | POST    | Upload d’une photo avec `photo`, `date`, `latitude`, `longitude` (multipart/form-data) |
| `/photos/{filename}` | GET     | Récupère la photo avec le nom `{filename}` (UUID + extension)                          |
| `/list`              | GET     | Liste toutes les photos disponibles avec leur URL                                      |
| `/gps`               | GET     | Liste toutes les coordonnées GPS des photos avec ID et date                            |
| `/photos/by-date`    | GET     | Liste toutes les photos triées par date avec URL et coordonnées                        |
