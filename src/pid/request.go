package pid

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

const apiGateway = "https://api.golemio.cz/v2"

func parseJsonFromRequest(r io.Reader, v any) {
	body, err := io.ReadAll(r)
	if err != nil {
		fmt.Println("Error reading the response", err)
		return
	}

	err = json.Unmarshal(body, v)
	if err != nil {
		fmt.Println("Could not parse JSON: ", err)
		return
	}
}

func getResponse(url string) *http.Response {
	request, err := http.NewRequest("GET", apiGateway+url, nil)
	if err != nil {
		fmt.Println("Error creating the request", err)
		return nil
	}

	request.Header.Set("X-Access-Token", os.Getenv("GOLEMIO_API_KEY"))

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		fmt.Println("Error sending the request", err)
		return nil
	}

	return resp
}
