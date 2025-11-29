package main

import (
	"context"
	"fmt"
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

	return &api.GetFileOK{Data: api.NewOptGetFileOKData(data)}, nil
}

// Health implements the health check operation.
func (s *FileServer) Health(ctx context.Context) (*api.HealthOK, error) {
	return &api.HealthOK{Status: "ok"}, nil
}

// NewError creates a new error response.
func (s *FileServer) NewError(ctx context.Context, err error) *api.ErrorStatusCode {
	return &api.ErrorStatusCode{
		StatusCode: http.StatusInternalServerError,
		Response: api.Error{
			Message: err.Error(),
		},
	}
}

func main() {
	// Get port from environment variable (Render sets this)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Files directory
	filesDir := os.Getenv("FILES_DIR")
	if filesDir == "" {
		filesDir = "./files"
	}

	// Ensure files directory exists
	if err := os.MkdirAll(filesDir, 0755); err != nil {
		log.Fatalf("Failed to create files directory: %v", err)
	}

	// Create server
	fileServer := NewFileServer(filesDir)
	srv, err := api.NewServer(fileServer)
	if err != nil {
		log.Fatalf("Failed to create server: %v", err)
	}

	// Start HTTP server
	addr := fmt.Sprintf(":%s", port)
	log.Printf("Starting server on %s, serving files from %s", addr, filesDir)
	if err := http.ListenAndServe(addr, srv); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
