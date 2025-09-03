package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"backend/db"
	"backend/handlers"
	"backend/repository"
)

const uploadPath = "./uploads"

func main() {
	// Initialisation de la DB
	dbURL := "postgres://user:rby6014vtziqaRwF4VEINxfnaxtrIZCaX5@db:5432/photosdb"
	db.InitDB(dbURL)
	db.Migrate()

	// Création du dossier uploads si nécessaire
	if _, err := os.Stat(uploadPath); os.IsNotExist(err) {
		if err := os.Mkdir(uploadPath, os.ModePerm); err != nil {
			log.Fatalf("Failed to create upload folder: %v", err)
		}
	}

	// Initialisation du repository et handler
	userRepo := &repository.UserRepository{DB: db.Conn}
	userHandler := &handlers.UserHandler{Repo: userRepo}

	// Enregistrement des routes HTTP
	http.HandleFunc("/upload", handlers.UploadPhotoHandler)
	http.HandleFunc("/photos/", handlers.GetPhotoHandler)
	http.HandleFunc("/list", handlers.ListAllPhotosHandler)
	http.HandleFunc("/gps", handlers.ListGPSHandler)
	http.HandleFunc("/photos/by-date", handlers.ListPhotosByDateHandler)

	// Routes utilisateurs
	http.HandleFunc("/createUser", userHandler.CreateUser)
	http.HandleFunc("/updateUser", userHandler.UpdateUser)
	http.HandleFunc("/getUser", userHandler.GetUser)

	// Démarrage du serveur
	fmt.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe("0.0.0.0:8080", nil))
}
