.PHONY: help build run test clean generate dev

# Default target
help:
	@echo "Available targets:"
	@echo "  build     - Build the server binary"
	@echo "  run       - Run the server"
	@echo "  test      - Run tests"
	@echo "  clean     - Clean build artifacts"
	@echo "  generate  - Generate code from OpenAPI spec"
	@echo "  dev       - Generate code and run server"

# Build the server
build:
	go build -o server main.go

# Run the server
run: build
	./server

# Run tests
test:
	go test -v ./...

# Clean build artifacts
clean:
	rm -f server
	go clean

# Generate code from OpenAPI spec
generate:
	go run github.com/ogen-go/ogen/cmd/ogen@latest --target api --clean openapi.yaml

# Development workflow: generate code and run
dev: generate build
	./server
