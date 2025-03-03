package api

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHandler(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	rr := httptest.NewRecorder()

	Handler(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", rr.Code)
	}

	if contentType := rr.Header().Get("Content-Type"); contentType != "image/png" {
		t.Errorf("expected Content-Type 'image/png', got %s", contentType)
	}

	pngSignature := []byte{0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A}
	body := rr.Body.Bytes()

	if len(body) < len(pngSignature) {
		t.Fatalf("response body too short to be a valid PNG")
	}

	if !bytes.Equal(body[:len(pngSignature)], pngSignature) {
		t.Error("response does not start with a valid PNG signature")
	}
}