# Étape 1 : Builder
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY backend/go.mod backend/go.sum ./backend/
WORKDIR /app/backend
RUN go mod download
COPY backend/ . 
RUN go build -o photo-backend main.go

# Étape 2 : Image finale
FROM alpine:latest
WORKDIR /app/backend
COPY --from=builder /app/backend/photo-backend .
COPY backend/uploads ./uploads
EXPOSE 8080
CMD ["./photo-backend"]
