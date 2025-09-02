# Étape 1 : Builder
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN go build -o photo-backend main.go

# Étape 2 : Image finale
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/photo-backend .
COPY uploads ./uploads
EXPOSE 8080
CMD ["./photo-backend"]
