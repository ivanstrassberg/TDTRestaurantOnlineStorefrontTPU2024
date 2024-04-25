package main

import "time"

type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
}

type Customer struct {
	ID              int       `json:"id"`
	Email           string    `json:"email"`
	PasswordHash    string    `json:"password_hash"`
	DeliveryAddress string    `json:"delivery_address"`
	CreatedAt       time.Time `json:"created_at"`
	CartID          int       `json:"cart_id"`
}

type CustomerLR struct {
	Email        string `json:"email"`
	PasswordHash string `json:"password_hash"`
}
