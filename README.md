# PROJET PISCINE 01 - REACT NATIVE

Ce projet est une application mobile de gestion de photos qui permet à un utilisateur de prendre des photos, les sauvegarder, les visualiser sur une carte ou un calendrier, et gérer son profil.

Etudiants :

-   Adrien FOUQUET
-   Amaury TISSOT
-   Satya MINGUEZ
-   Léa DRUFFIN

# Présentation de l'application

L'application contient les fonctionnalités suivantes :

-   une page `accueil` avec des boutons permettant d'accéder aux différentes pages de l'application
-   une page `calendrier` qui permet à l'utilisateur de visualiser les dates de prises des photos
-   une page `carte` qui permet à l'utilisateur de visualiser la position de la prise de ses photos
-   une page `camera` qui affiche la camera et de l'appareil photo pour prendre des photos et les sauvegarder
-   une page `mes photos` qui permet à l'utilisateur de visualiser ses photos
-   une page `profil` avec les informations de l'utilisateur ainsi que ses statistiques

# Prérequis

Le lancement du projet nécessite l'installation sur votre machine de :

-   Node.js
-   Docker
-   Expo Go (sur votre mobile)

# Frontend

Le frontend de l'application a été réalisé avec **react-native**.
![](<https://www.atakinteractive.com/hubfs/react-native%20(1).png>)

Pour exécuter l'environnement de développement de l'application, exécutez les commandes suivantes dans un terminal à la racine du projet :

```shell
# Installation des dépendances
npm install
```

```shell
# Lancement d'expo
npx expo start
```

# Backend

Le backend de l’application est développé en **Go** et expose une API REST permettant de gérer les utilisateurs et leurs photos.
![](https://www.softwebsolutions.com/wp-content/uploads/2020/10/golang-Programing.jpg)

### Base de données

-   La base de données utilisée est **PostgreSQL** (container Docker).
-   Un container **pgAdmin** est également disponible à l’adresse [http://localhost:5050](http://localhost:5050) pour administrer la base.
    -   Identifiants par défaut :
        -   Email : `admin@admin.com`
        -   Mot de passe : `admin`

### Migrations

-   Lors du démarrage du backend, les **migrations** sont automatiquement exécutées pour initialiser les tables nécessaires.

### Stockage des photos

-   Les photos envoyées depuis le frontend sont sauvegardées côté serveur dans le répertoire `/backend/uploads/`.

### API REST

L'API expose les endpoints suivants :

| Endpoint                      | Méthode | Description                                                                            |
| ----------------------------- | ------- | -------------------------------------------------------------------------------------- |
| `/photos/upload`              | POST    | Upload d’une photo avec `photo`, `date`, `latitude`, `longitude` (multipart/form-data) |
| `/photos/{filename}`          | GET     | Récupère la photo avec le nom `{filename}` (UUID + extension)                          |
| `/photos`                     | GET     | Liste toutes les photos disponibles avec leur URL                                      |
| `/photos/gps`                 | GET     | Liste toutes les coordonnées GPS des photos avec ID et date                            |
| `/photos/by-date`             | GET     | Liste toutes les photos triées par date avec URL et coordonnées                        |
| `/photos/count`               | GET     | Retourne le nombre total de photos enregistrées                                        |
| `/users`                      | POST    | Crée un utilisateur avec `email` et `password` (JSON body)                             |
| `/users/{id}`                 | GET     | Récupère les informations d’un utilisateur via son `{id}`                              |
| `/users/{id}`                 | PUT     | Met à jour un utilisateur existant (champs `first_name`, `last_name`, etc.)            |
| `/users/{id}/profile-picture` | GET     | Récupère la photo de profil d’un utilisateur                                           |
| `/users/{id}/profile-picture` | PUT     | Met à jour la photo de profil d’un utilisateur                                         |

### Lancement du backend avec Docker

Ce backend est entièrement containerisé, pour exécuter le backend, effectuez la commande suivante dans un terminal depuis la racine du projet :

```shell
docker-compose up --build
```

L’API est alors disponible sur http://localhost:8080

# Architecture du projet

```
├── app/ # Code source du frontend React Native
├── assets/ # Ressources statiques (images, icônes, etc.)
├── backend/ # Code source du backend Go + API REST
│ ├── db/ # Gestion de la base de données (connexion, migrations)
│ ├── handlers/ # Handlers HTTP (logique des routes)
│ ├── repository/ # Requêtes vers la base de données
│ └── uploads/ # Répertoire de stockage des photos
├── components/ # Composants réutilisables côté frontend
├── constants/ # Constantes globales du frontend
├── hooks/ # Hooks React personnalisés
├── services/ # Services (API calls, gestion de session, etc.)
├── scripts/ # Scripts utilitaires éventuels
├── uploads/ # Volume monté pour le stockage des photos côté serveur
├── docker-compose.yml # Orchestration des containers (backend, db, pgAdmin)
├── Dockerfile # Image du backend Go
├── package.json # Dépendances du frontend React Native
├── tsconfig.json # Configuration TypeScript
├── README.md # Documentation du projet
```
