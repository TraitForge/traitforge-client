package main

import (
    "fmt"
    "github.com/fogleman/gg"
    "log"
    "net/http"
    "strconv"
)

// generateImageFromEntropy creates an image based on provided entropy (tokenID in this case).
func generateImageFromEntropy(entropy int) *gg.Context {
    const S = 400 // Size of the image
    dc := gg.NewContext(S, S)

    // Use the entropy to determine the color. This is a simplistic approach.
    r := float64((entropy*123456789)%255) / 255.0
    g := float64((entropy*987654321)%255) / 255.0
    b := float64((entropy*192837465)%255) / 255.0
    dc.SetRGB(r, g, b)
    dc.Clear()

    // Optionally, add more graphics or text based on your requirements.
    dc.SetRGB(0, 0, 0) // Set color to black for text.
    dc.DrawStringAnchored(fmt.Sprintf("Token ID: %d", entropy), float64(S)/2, float64(S)/2, 0.5, 0.5)

    return dc
}

// imageHandler handles HTTP requests and generates an image based on the tokenID query parameter.
func imageHandler(w http.ResponseWriter, r *http.Request) {
    keys, ok := r.URL.Query()["tokenID"]

    if !ok || len(keys[0]) < 1 {
        http.Error(w, "Token ID is missing", http.StatusBadRequest)
        return
    }

    tokenID, err := strconv.Atoi(keys[0])
    if err != nil {
        http.Error(w, "Invalid Token ID", http.StatusBadRequest)
        return
    }

    // Generate the image from the token ID entropy.
    dc := generateImageFromEntropy(tokenID)

    w.Header().Set("Content-Type", "image/png")
    dc.EncodePNG(w) // Encode and write the image to the response.
}

func main() {
    // Serve static files from the current directory, helpful for serving an HTML form
    fs := http.FileServer(http.Dir("."))
    http.Handle("/", fs)

    // Handle requests to generate images on a specific endpoint
    http.HandleFunc("/generate-image", imageHandler)

    fmt.Println("Starting server at port 8080...")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
