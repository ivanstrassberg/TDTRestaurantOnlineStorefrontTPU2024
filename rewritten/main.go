package main

import "log"

func main() {

	store, err := NewPostgresStorage()
	store.Init()
	if err != nil {
		log.Fatal(err)
	}

	// todo make it env variable
	staticDir := "/Users/ivansilin/Documents/coding/golang/foodShop/initHandle/static/"
	server := NewAPIServer(":8080", store, staticDir)
	server.Run()

}
