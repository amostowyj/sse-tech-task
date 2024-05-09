// This is a mock standing in for a remote analytics gathering service.

package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

type AnalyticsBody struct {
	Method, Url string
}

func handler(w http.ResponseWriter, r *http.Request) {
	var body AnalyticsBody
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Printf("Recording analytics for %+v\n", body.Url)
	delay := time.Duration(1+rand.Intn(500)) * time.Millisecond
	time.Sleep(delay)
	fmt.Fprintf(w, "OK")
}

func main() {
	http.HandleFunc("/page-analytics", handler)
	fmt.Println("Server listening on port 8080")
	http.ListenAndServe(":8080", nil)
}
