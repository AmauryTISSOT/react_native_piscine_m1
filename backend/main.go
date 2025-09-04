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

	// Routes Photos
	http.HandleFunc("/photos/upload", handlers.UploadPhotoHandler)       // POST
	http.HandleFunc("/photos", handlers.ListAllPhotosHandler)            // GET
	http.HandleFunc("/photos/", handlers.GetPhotoHandler)                // GET
	http.HandleFunc("/photos/by-date", handlers.ListPhotosByDateHandler) // GET
	http.HandleFunc("/photos/count", handlers.GetPhotosCount)            // GET
	http.HandleFunc("/photos/gps", handlers.ListGPSHandler)              // GET

	// Routes Utilisateurs
	http.HandleFunc("/users", userHandler.CreateUser)                                    // POST
	http.HandleFunc("/users/update", userHandler.UpdateUser)                             // PUT
	http.HandleFunc("/users/get", userHandler.GetUser)                                   // GET
	http.HandleFunc("/users/profile-picture", userHandler.GetUserProfileImage)           // GET
	http.HandleFunc("/users/profile-picture/update", userHandler.UpdateUserProfileImage) // PUT

	// Démarrage du serveur
	fmt.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe("0.0.0.0:8080", nil))
}
