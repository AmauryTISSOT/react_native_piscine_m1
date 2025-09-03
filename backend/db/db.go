package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5"
)

var Conn *pgx.Conn

func InitDB(dbURL string) {
	var err error
	Conn, err = pgx.Connect(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v", err)
	}
}

func Migrate() {
	_, err := Conn.Exec(context.Background(), `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE TABLE IF NOT EXISTS photos (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            date TIMESTAMP NOT NULL,
            latitude DOUBLE PRECISION NOT NULL,
            longitude DOUBLE PRECISION NOT NULL
        );
    `)
	if err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}
}
