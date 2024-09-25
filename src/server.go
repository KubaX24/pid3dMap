package src

import (
	"github.com/rs/cors"
	"html/template"
	"mapServer/src/pid"
	"mapServer/src/tiles"
	"net/http"
)

func Server() {
	router := http.NewServeMux()

	staticServe(router)

	tiles.Serve(router)
	pid.Serve(router)

	indexServe(router)

	handler := cors.Default().Handler(router)
	err := http.ListenAndServe(":8080", handler)
	if err != nil {
		panic(err)
		return
	}
}

func staticServe(router *http.ServeMux) {
	fs := http.FileServer(http.Dir("./static/"))
	router.Handle("/static/", http.StripPrefix("/static/", fs))
}

func indexServe(router *http.ServeMux) {
	tmpl, err := template.ParseFiles("./frontend/index.html")
	if err != nil {
		panic(err)
		return
	}

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		err := tmpl.Execute(w, nil)
		if err != nil {
			panic(err)
			return
		}
	})
}
