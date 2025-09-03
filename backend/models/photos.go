package models

type Photo struct {
	ID        string  `json:"id"`
	Date      string  `json:"date"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	URL       string  `json:"url,omitempty"`
}

type GPS struct {
	ID        string  `json:"id"`
	Date      string  `json:"date"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}
