package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"backend/db"
	"backend/utils"
)

const uploadPath = "./uploads"

func UploadPhotoHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	dateStr := r.FormValue("date")
	latStr := r.FormValue("latitude")
	lonStr := r.FormValue("longitude")

	date, err := time.Parse(time.RFC3339, dateStr)
	if err != nil {
		http.Error(w, "Invalid date format", http.StatusBadRequest)
		return
	}

	lat, err := strconv.ParseFloat(latStr, 64)
	if err != nil {
		http.Error(w, "Invalid latitude", http.StatusBadRequest)
		return
	}

	lon, err := strconv.ParseFloat(lonStr, 64)
	if err != nil {
		http.Error(w, "Invalid longitude", http.StatusBadRequest)
		return
	}

	var id string
	err = db.Conn.QueryRow(
		r.Context(),
		"INSERT INTO photos (date, latitude, longitude) VALUES ($1,$2,$3) RETURNING id",
		date, lat, lon,
	).Scan(&id)
	if err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	ext, err := utils.SaveUploadedFile(r, "photo", uploadPath, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Println("Upload de la photo : ", id)
	json.NewEncoder(w).Encode(map[string]string{
		"id":   id,
		"url":  "/photos/" + id + ext,
		"date": date.Format(time.RFC3339),
	})
}
