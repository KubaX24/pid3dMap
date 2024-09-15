package main

import (
	"github.com/joho/godotenv"
	"log"
	"mapServer/src"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	src.Server()
}
