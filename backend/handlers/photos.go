package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"backend/db"
	"backend/models"
)

// GetPhotoHandler sert un fichier photo depuis le dossier uploads
func GetPhotoHandler(w http.ResponseWriter, r *http.Request) {
	filename := filepath.Base(r.URL.Path)
	filePath := filepath.Join("./uploads", filename)
	fmt.Printf("GET PHOTO %s", filePath)
	http.ServeFile(w, r, filePath)
}

func GetPhotoById(w http.ResponseWriter, r *http.Request) {
	imageID := r.URL.Query().Get("id")
	fmt.Printf("Id=: %v", imageID)
	files, err := os.ReadDir("./uploads")
	if err != nil {
		http.Error(w, "Unable to read uploads folder: "+err.Error(), http.StatusInternalServerError)
		return
	}
	var fullFileName string
	for _, file := range files {
		if !file.IsDir() && strings.HasPrefix(file.Name(), imageID) {
			fullFileName = file.Name()
			break
		}
	}
	if fullFileName == "" {
		http.Error(w, "Photo not found", http.StatusNotFound)
		return
	}
	baseURL := getBaseURL(r)
	imageURL := fmt.Sprintf("%s/photos/%s", baseURL, fullFileName)

	fmt.Println("PROFILE PICTURE URL :", imageURL)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"url": imageURL,
	})
}

// ListAllPhotosHandler retourne la liste de toutes les photos avec URL
func ListAllPhotosHandler(w http.ResponseWriter, r *http.Request) {
	files, err := os.ReadDir("./uploads")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var urls []string
	baseURL := getBaseURL(r)
	for _, file := range files {
		if !file.IsDir() {
			urls = append(urls, fmt.Sprintf("%s/photos/%s", baseURL, file.Name()))
		}
	}

	fmt.Println("Liste des photos :", urls)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(urls)
}

// ListPhotosByDateHandler retourne toutes les photos triées par date
func ListPhotosByDateHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Conn.Query(r.Context(),
		"SELECT id, date, latitude, longitude FROM photos ORDER BY date ASC")
	if err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var photos []models.Photo
	baseURL := getBaseURL(r)
	for rows.Next() {
		var p models.Photo
		var dateVal time.Time
		if err := rows.Scan(&p.ID, &dateVal, &p.Latitude, &p.Longitude); err != nil {
			http.Error(w, "Scan error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		p.Date = dateVal.Format(time.RFC3339)
		p.URL = fmt.Sprintf("%s/photos/%s.jpg", baseURL, p.ID) // gérer l'extension si besoin
		photos = append(photos, p)
	}

	fmt.Println("Liste des photos par dates :", photos)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(photos)
}

func GetPhotosCount(w http.ResponseWriter, r *http.Request) {
	var count int
	err := db.Conn.QueryRow(r.Context(), "SELECT COUNT(*) FROM photos").Scan(&count)
	if err != nil {
		http.Error(w, "Database error :"+err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Printf("Nombres de photos en BDD: %v", count)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]int{"count": count})
}

// utilitaire interne pour générer la base URL
func getBaseURL(r *http.Request) string {
	scheme := "http"
	if r.TLS != nil {
		scheme = "https"
	}
	return fmt.Sprintf("%s://%s", scheme, r.Host)
}
