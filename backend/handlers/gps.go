package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"backend/db"
	"backend/models"
)

// ListGPSHandler retourne toutes les coordonnées GPS des photos
func ListGPSHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Conn.Query(r.Context(),
		"SELECT id, date, latitude, longitude FROM photos")
	if err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var gpsList []models.GPS
	for rows.Next() {
		var g models.GPS
		var dateVal time.Time
		if err := rows.Scan(&g.ID, &dateVal, &g.Latitude, &g.Longitude); err != nil {
			http.Error(w, "Scan error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		g.Date = dateVal.Format(time.RFC3339)
		gpsList = append(gpsList, g)
	}
	fmt.Println("Liste des coordonnées GPS", gpsList)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(gpsList)
}
