package handlers

import (
	"backend/models"
	"backend/repository"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"backend/utils"

	"github.com/google/uuid"
)

type UserHandler struct {
	Repo *repository.UserRepository
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var req models.CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	id, err := h.Repo.Create(r.Context(), req.Email, req.Password)
	if err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusCreated, map[string]string{"id": id})
}

func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")
	if email == "" {
		http.Error(w, "Missing email parameter", http.StatusBadRequest)
		return
	}

	var req models.UpdateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	rows, err := h.Repo.Update(r.Context(), email, req)
	if err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if rows == 0 {
		http.Error(w, "No user found with this email", http.StatusNotFound)
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"message": "User updated successfully"})
}

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")
	if email == "" {
		http.Error(w, "Missing email parameter", http.StatusBadRequest)
		return
	}

	user, err := h.Repo.GetByEmail(r.Context(), email)
	if err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, user)
}

func (h *UserHandler) GetUserProfileImage(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")
	if email == "" {
		http.Error(w, "Missing email parameter", http.StatusBadRequest)
		return
	}

	baseName, err := h.Repo.GetUserProfilePicture(r.Context(), email)
	if err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if baseName == "" {
		http.Error(w, "No profile picture set for this user", http.StatusNotFound)
		return
	}

	files, err := os.ReadDir("./uploads")
	if err != nil {
		http.Error(w, "Unable to read uploads folder: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var fullFileName string
	for _, file := range files {
		if !file.IsDir() && strings.HasPrefix(file.Name(), baseName) {
			fullFileName = file.Name()
			break
		}
	}

	if fullFileName == "" {
		http.Error(w, "Profile picture file not found", http.StatusNotFound)
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

func (h *UserHandler) UpdateUserProfileImage(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")
	id := uuid.New().String()
	ext, err := utils.SaveUploadedFile(r, "photo", uploadPath, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	_, err = h.Repo.UpdateProfilePictureName(r.Context(), id, email)
	if err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Println("Upload de la photo de profile : ", id)
	json.NewEncoder(w).Encode(map[string]string{
		"id":  id,
		"url": "/photos/" + id + ext,
	})
}
