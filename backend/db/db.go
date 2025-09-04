package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Conn *pgxpool.Pool

func InitDB(dbURL string) {
	var err error
	Conn, err = pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
}

func Migrate() {
	ctx := context.Background()
	tx, err := Conn.Begin(ctx)
	if err != nil {
		log.Fatalf("Failed to begin migration transaction: %v", err)
	}
	defer tx.Rollback(ctx)

	// Extension UUID
	_, err = tx.Exec(ctx, `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
	if err != nil {
		log.Fatalf("Failed to create extension: %v", err)
	}

	// 🔹 Drop tables si elles existent (dans l’ordre : enfants -> parent)
	_, err = tx.Exec(ctx, `DROP TABLE IF EXISTS photos;`)
	if err != nil {
		log.Fatalf("Failed to drop photos table: %v", err)
	}

	_, err = tx.Exec(ctx, `DROP TABLE IF EXISTS users;`)
	if err != nil {
		log.Fatalf("Failed to drop users table: %v", err)
	}

	// 🔹 Création des tables
	_, err = tx.Exec(ctx, `CREATE TABLE users (
		userId UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		first_name VARCHAR(100),
		password TEXT NOT NULL,
		last_name VARCHAR(100),
		email VARCHAR(100) NOT NULL UNIQUE,
		phone VARCHAR(20),
		country VARCHAR(50),
		bio TEXT,
		profile_picture_name VARCHAR(100)
	);`)
	if err != nil {
		log.Fatalf("Failed to create users table: %v", err)
	}

	_, err = tx.Exec(ctx, `CREATE TABLE photos (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		userId UUID REFERENCES users (userId) ON DELETE CASCADE,
		date TIMESTAMP NOT NULL,
		latitude DOUBLE PRECISION NOT NULL,
		longitude DOUBLE PRECISION NOT NULL
	);`)
	if err != nil {
		log.Fatalf("Failed to create photos table: %v", err)
	}

	// 🔹 Données mock
	_, err = tx.Exec(ctx, `INSERT INTO users (first_name, password, last_name, email, phone, country, bio) 
	VALUES ('Adrien','toto123', 'Fouquet', 'adrien.fouquet@example.com', '+33 6 12 34 56 78', 'France',
	'Passionné de voyage et des nouvelles technologies. J''aime explorer le monde et capturer des moments uniques à travers mes photos')`)
	if err != nil {
		log.Fatalf("Failed to insert mock data into users table: %v", err)
	}

	// Commit
	if err := tx.Commit(ctx); err != nil {
		log.Fatalf("Failed to commit migration: %v", err)
	}
}
