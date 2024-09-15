package src

import (
	"github.com/rs/cors"
	"mapServer/src/pid"
	"mapServer/src/tiles"
	"net/http"
)

func Server() {
	router := http.NewServeMux()

	tiles.Serve(router)
	pid.Serve(router)

	handler := cors.Default().Handler(router)
	err := http.ListenAndServe(":8080", handler)
	if err != nil {
		panic(err)
		return
	}
}
