package repository

import (
	"backend/models"
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	DB *pgxpool.Pool
}

func (r *UserRepository) Create(ctx context.Context, email, password string) (string, error) {
	var id string
	err := r.DB.QueryRow(ctx,
		"INSERT INTO users (email, password) VALUES ($1, $2) RETURNING userid",
		email, password,
	).Scan(&id)
	return id, err
}

func (r *UserRepository) Update(ctx context.Context, email string, req models.UpdateUserRequest) (int64, error) {
	cmdTag, err := r.DB.Exec(ctx,
		`UPDATE users 
		 SET first_name=$1, last_name=$2, phone=$3, country=$4, bio=$5 
		 WHERE email=$6`,
		req.FirstName, req.LastName, req.Phone, req.Country, req.Bio, email,
	)
	return cmdTag.RowsAffected(), err
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User
	err := r.DB.QueryRow(ctx,
		`SELECT userid, first_name, last_name, email, phone, country, bio 
		 FROM users WHERE email=$1`, email).
		Scan(&user.UserId, &user.FirstName, &user.LastName,
			&user.Email, &user.Phone, &user.Country, &user.Bio)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetUserProfilePicture(ctx context.Context, email string) (string, error) {
	var profilePictureName string
	err := r.DB.QueryRow(ctx,
		`SELECT profile_picture_name 
		 FROM users 
		 WHERE email=$1`,
		email).Scan(&profilePictureName)
	if err != nil {
		return "", err
	}
	return profilePictureName, nil
}

func (r *UserRepository) UpdateProfilePictureName(ctx context.Context, profilePictureName, email string) (int64, error) {
	cmdTag, err := r.DB.Exec(ctx,
		`UPDATE users
		SET profile_picture_name=$1
		WHERE email=$2`,
		profilePictureName, email,
	)
	return cmdTag.RowsAffected(), err
}
