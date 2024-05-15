package main

import (
	"github.com/stripe/stripe-go/v78"
	"github.com/stripe/stripe-go/v78/client"
)

func oka() {
	stripe.Key = "sk_test_51PGBY6RsvEv5vPVlSr7KscWnARE1JSwq2Yuz6EqrYxs0Ksx6d8l1Uum5O5HUXj1rK8Hb2btsUvljijPxxAZQjTbk00bx8sBvRo"
	params := &stripe.ChargeParams{}
	sc := &client.API{}
	sc.Init(stripe.Key, nil)
	sc.Charges.Get("ch_3Ln3j02eZvKYlo2C0d5IZWuG", params)
}
