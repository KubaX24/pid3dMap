package pid

import (
	"encoding/json"
	"net/http"
)

func Serve(router *http.ServeMux) {
	router.HandleFunc("/pid/", func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Content-Type", "application/json")
		json.NewEncoder(writer).Encode(GetShape("L150V3"))
	})
}
