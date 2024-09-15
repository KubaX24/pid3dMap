package tiles

import (
	"bytes"
	"compress/gzip"
	"database/sql"
	"errors"
	"fmt"
	"github.com/twpayne/go-mbtiles"
	"io"
	"net/http"
	"os"
	"strconv"
)

func Serve(router *http.ServeMux) {
	reader, err := mbtiles.NewReader(os.Getenv("TILES_FILE"))
	if err != nil {
		panic(err)
	}

	fs := http.FileServer(http.Dir("./data/"))
	router.Handle("/data/", http.StripPrefix("/data/", fs))

	router.HandleFunc("/map/{z}/{x}/{y}/tile.pbf", func(w http.ResponseWriter, r *http.Request) {
		x, _ := strconv.Atoi(r.PathValue("x"))
		y, _ := strconv.Atoi(r.PathValue("y"))
		z, _ := strconv.Atoi(r.PathValue("z"))

		tile, err := reader.SelectTile(z, x, y)

		w.Header().Set("accept-ranges", "bytes")
		w.Header().Set("content-type", "application/octet-stream")
		w.Header().Set("vary", "Accept-Encoding")

		gzipReader, err := gzip.NewReader(bytes.NewReader(tile))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		output, _ := io.ReadAll(gzipReader)

		_, _ = w.Write(output)

		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				fmt.Printf("tile doesn't exist: %d, %d, %d\n", z, x, y)
				return
			}
		}
	})
}
