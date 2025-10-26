package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestDateFormat(t *testing.T) {
	tests := []struct {
		name string
		date Date
		want string
	}{
		{
			name: "normal date",
			date: Date{Year: 2025, Month: 10, Day: 5},
			want: "2025-10-05",
		},
		{
			name: "single digit month and day",
			date: Date{Year: 2025, Month: 1, Day: 1},
			want: "2025-01-01",
		},
		{
			name: "last day of year",
			date: Date{Year: 2024, Month: 12, Day: 31},
			want: "2024-12-31",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := tt.date.Format()
			if got != tt.want {
				t.Errorf("Date.Format() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestMustAtoi(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  int
	}{
		{
			name:  "positive number",
			input: "123",
			want:  123,
		},
		{
			name:  "zero",
			input: "0",
			want:  0,
		},
		{
			name:  "negative number",
			input: "-42",
			want:  -42,
		},
		{
			name:  "invalid input",
			input: "abc",
			want:  0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := mustAtoi(tt.input)
			if got != tt.want {
				t.Errorf("mustAtoi(%v) = %v, want %v", tt.input, got, tt.want)
			}
		})
	}
}

func TestLoadConfig(t *testing.T) {
	tests := []struct {
		name         string
		configYAML   string
		wantErr      bool
		wantOutdir   string
		wantFilename string
		wantTemplate string
	}{
		{
			name: "valid config",
			configYAML: `default:
  outdir: /tmp/diary
  filename: "{{.Date}}.md"
  template: template.md`,
			wantErr:      false,
			wantOutdir:   "/tmp/diary",
			wantFilename: "{{.Date}}.md",
			wantTemplate: "template.md",
		},
		{
			name:       "invalid yaml",
			configYAML: "invalid: yaml: content:",
			wantErr:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Create temporary config file
			tmpfile, err := os.CreateTemp("", "config-*.yaml")
			if err != nil {
				t.Fatal(err)
			}
			defer os.Remove(tmpfile.Name())

			if _, err := tmpfile.Write([]byte(tt.configYAML)); err != nil {
				t.Fatal(err)
			}
			if err := tmpfile.Close(); err != nil {
				t.Fatal(err)
			}

			// Test loadConfig
			config, err := loadConfig(tmpfile.Name())
			if (err != nil) != tt.wantErr {
				t.Errorf("loadConfig() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			d := config["default"]

			if !tt.wantErr {
				if d.Outdir != tt.wantOutdir {
					t.Errorf("d.Outdir = %v, want %v", d.Outdir, tt.wantOutdir)
				}
				if d.Filename != tt.wantFilename {
					t.Errorf("d.Filename = %v, want %v", d.Filename, tt.wantFilename)
				}
				if d.Template != tt.wantTemplate {
					t.Errorf("d.Template = %v, want %v", d.Template, tt.wantTemplate)
				}
			}
		})
	}
}

func TestGenerateFilePath(t *testing.T) {
	tests := []struct {
		name     string
		config   Config
		date     Date
		wantPath string
		wantErr  bool
	}{
		{
			name: "simple filename template",
			config: map[string]TemplateConfig{
				"default": TemplateConfig{
					Outdir:   "/tmp/diary",
					Filename: "{{.Date}}.md",
				},
			},
			date:     Date{Year: 2025, Month: 10, Day: 5},
			wantPath: "/tmp/diary/2025-10-05.md",
			wantErr:  false,
		},
		{
			name: "filename with title",
			config: map[string]TemplateConfig{
				"default": TemplateConfig{
					Outdir:   "/var/logs",
					Filename: "{{.Title}}_entry.txt",
				},
			},
			date:     Date{Year: 2024, Month: 1, Day: 1},
			wantPath: "/var/logs/2024-01-01_entry.txt",
			wantErr:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			temp := tt.config["default"]
			gotPath, err := temp.generateFilePath(tt.date)
			if (err != nil) != tt.wantErr {
				t.Errorf("generateFilePath() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if gotPath != tt.wantPath {
				t.Errorf("generateFilePath() = %v, want %v", gotPath, tt.wantPath)
			}
		})
	}
}

func TestCreateFromTemplate(t *testing.T) {
	tests := []struct {
		name            string
		templateContent string
		date            Date
		expectedContent string
		wantErr         bool
	}{
		{
			name:            "simple template",
			templateContent: "# {{.Title}}\n\nDate: {{.Date}}",
			date:            Date{Year: 2025, Month: 10, Day: 5},
			expectedContent: "# 2025-10-05\n\nDate: 2025-10-05",
			wantErr:         false,
		},
		{
			name:            "template with only date",
			templateContent: "{{.Date}}",
			date:            Date{Year: 2024, Month: 12, Day: 31},
			expectedContent: "2024-12-31",
			wantErr:         false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Create temporary directory for test
			tmpDir, err := os.MkdirTemp("", "diary-test-*")
			if err != nil {
				t.Fatal(err)
			}
			defer os.RemoveAll(tmpDir)

			// Create template file
			templatePath := filepath.Join(tmpDir, "template.md")
			if err := os.WriteFile(templatePath, []byte(tt.templateContent), 0644); err != nil {
				t.Fatal(err)
			}

			// Setup config
			outputDir := filepath.Join(tmpDir, "output")
			outputPath := filepath.Join(outputDir, "test.md")
			config := map[string]TemplateConfig{
				"default": TemplateConfig{
					Outdir:   outputDir,
					Filename: "test.md",
					Template: templatePath,
				},
			}

			temp := config["default"]
			// Test createFromTemplate
			err = temp.createFromTemplate(outputPath, tt.date)
			if (err != nil) != tt.wantErr {
				t.Errorf("createFromTemplate() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if !tt.wantErr {
				// Verify file was created
				if _, err := os.Stat(outputPath); os.IsNotExist(err) {
					t.Errorf("Expected file was not created: %v", outputPath)
					return
				}

				// Verify file content
				content, err := os.ReadFile(outputPath)
				if err != nil {
					t.Fatal(err)
				}

				if string(content) != tt.expectedContent {
					t.Errorf("File content = %v, want %v", string(content), tt.expectedContent)
				}
			}
		})
	}
}
