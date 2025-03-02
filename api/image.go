package api

import (
	"fmt"
	"image/color"
	"net/http"
	"strconv"

	"github.com/fogleman/gg"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	width, _ := strconv.Atoi(r.URL.Query().Get("width"))
	height, _ := strconv.Atoi(r.URL.Query().Get("height"))
	text := r.URL.Query().Get("text")

	if width <= 0 {
		width = 300
	}

	if height <= 0 {
		height = 200
	}

	if text == "" {
		text = fmt.Sprintf("%d x %d", width, height)
	}

	dc := gg.NewContext(width, height)
	dc.SetColor(color.Transparent)
	dc.Clear()

	dc.SetRGB(0.5, 0.5, 0.5)
	dc.DrawRectangle(0, 0, float64(width), float64(height))
	dc.Fill()

	dc.SetRGB(1, 1, 1)
	dc.DrawStringAnchored(text, float64(width) / 2, float64(height) / 2, 0.5, 0.5)

	w.Header().Set("Content-Type", "image/png")
	dc.EncodePNG(w)
}