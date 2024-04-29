package main

import (
	"time"
)

type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
	Rating      float64 `json:"rating"`
	Category_ID int     `json:"category_id"`
}
type ReqProduct struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
	Category_ID int     `json:"category_id"`
}

type Customer struct {
	ID              int       `json:"id"`
	Email           string    `json:"email"`
	PasswordHash    string    `json:"password_hash"`
	DeliveryAddress string    `json:"delivery_address"`
	CreatedAt       time.Time `json:"created_at"`
}

type CustomerLR struct {
	Email        string `json:"email"`
	PasswordHash string `json:"password_hash"`
}

type Category struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type ReqCategory struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type AuthKey struct {
	Header string `json:"Header"`
	Token  string `json:"Token"`
}
