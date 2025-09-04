package models

import "github.com/google/uuid"

type User struct {
	UserId             uuid.UUID `json:"id"`
	FirstName          string    `json:"first_name"`
	LastName           string    `json:"last_name"`
	Email              string    `json:"email"`
	Phone              string    `json:"phone"`
	Country            string    `json:"country"`
	Bio                string    `json:"bio"`
	ProfilePictureName string    `json:"profile_picture_name"`
}

type CreateUserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UpdateUserRequest struct {
	FirstName          string `json:"first_name"`
	LastName           string `json:"last_name"`
	Phone              string `json:"phone"`
	Country            string `json:"country"`
	Bio                string `json:"bio"`
	ProfilePictureName string `json:"profile_picture_name"`
}
