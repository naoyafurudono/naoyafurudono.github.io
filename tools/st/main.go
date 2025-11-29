package main

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/naoyafurudono/naoyafurudono.github.io/tools/st/api"
)

type FileServer struct {
	filesDir string
}

func NewFileServer(filesDir string) *FileServer {
	return &FileServer{filesDir: filesDir}
}

// GetFile implements the getFile operation.
func (s *FileServer) GetFile(ctx context.Context, params api.GetFileParams) (api.GetFileRes, error) {
	filename := params.Filename
	filePath := filepath.Join(s.filesDir, filename)

	// Security: prevent directory traversal
	absPath, err := filepath.Abs(filePath)
	if err != nil {
		return &api.GetFileInternalServerError{
			Message: "Internal server error",
		}, nil
	}

	absFilesDir, err := filepath.Abs(s.filesDir)
	if err != nil {
		return &api.GetFileInternalServerError{
			Message: "Internal server error",
		}, nil
	}

	// Check if the resolved path is within the files directory
	relPath, err := filepath.Rel(absFilesDir, absPath)
	if err != nil || len(relPath) > 0 && relPath[0] == '.' {
		return &api.GetFileNotFound{
			Message: "File not found",
		}, nil
	}

	// Read file
	data, err := os.ReadFile(absPath)
	if err != nil {
		if os.IsNotExist(err) {
			return &api.GetFileNotFound{
				Message: "File not found",
			}, nil
		}
		return &api.GetFileInternalServerError{
			Message: "Failed to read file",
		}, nil
	}

	return &api.GetFileOK{Data: bytes.NewReader(data)}, nil
}

// UploadFile implements the uploadFile operation.
func (s *FileServer) UploadFile(ctx context.Context, req api.UploadFileReq, params api.UploadFileParams) (api.UploadFileRes, error) {
	filename := params.Filename

	// Security: prevent directory traversal
	if filepath.IsAbs(filename) || filepath.Clean(filename) != filename {
		return &api.UploadFileBadRequest{
			Message: "Invalid filename",
		}, nil
	}

	filePath := filepath.Join(s.filesDir, filename)

	// Security: prevent directory traversal
	absPath, err := filepath.Abs(filePath)
	if err != nil {
		return &api.UploadFileInternalServerError{
			Message: "Internal server error",
		}, nil
	}

	absFilesDir, err := filepath.Abs(s.filesDir)
	if err != nil {
		return &api.UploadFileInternalServerError{
			Message: "Internal server error",
		}, nil
	}

	// Check if the resolved path is within the files directory
	relPath, err := filepath.Rel(absFilesDir, absPath)
	if err != nil || len(relPath) > 0 && relPath[0] == '.' {
		return &api.UploadFileBadRequest{
			Message: "Invalid filename",
		}, nil
	}

	// Read data from request
	data, err := io.ReadAll(req.Data)
	if err != nil {
		return &api.UploadFileInternalServerError{
			Message: "Failed to read request body",
		}, nil
	}

	// Write file
	if err := os.WriteFile(absPath, data, 0644); err != nil {
		return &api.UploadFileInternalServerError{
			Message: "Failed to write file",
		}, nil
	}

	return &api.UploadResponse{
		Filename: filename,
		Size:     len(data),
		Message:  "File uploaded successfully",
	}, nil
}

// Health implements the health check operation.
func (s *FileServer) Health(ctx context.Context) (*api.HealthOK, error) {
	return &api.HealthOK{Status: api.NewOptString("ok")}, nil
}

func main() {
	// Get port from environment variable (Render sets this)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Posts directory
	postsDir := os.Getenv("POSTS_DIR")
	if postsDir == "" {
		postsDir = "./posts"
	}

	// Ensure posts directory exists
	if err := os.MkdirAll(postsDir, 0755); err != nil {
		log.Fatalf("Failed to create posts directory: %v", err)
	}

	// Create server
	fileServer := NewFileServer(postsDir)
	srv, err := api.NewServer(fileServer)
	if err != nil {
		log.Fatalf("Failed to create server: %v", err)
	}

	// Start HTTP server
	addr := fmt.Sprintf(":%s", port)
	log.Printf("Starting server on %s, serving posts from %s", addr, postsDir)
	if err := http.ListenAndServe(addr, srv); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
