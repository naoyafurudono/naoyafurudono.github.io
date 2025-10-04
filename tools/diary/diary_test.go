package main

import (
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestDetermineDate(t *testing.T) {
	now := time.Now()

	tests := []struct {
		name      string
		dateStr   string
		month     int
		day       int
		yesterday bool
		wantYear  int
		wantMonth time.Month
		wantDay   int
	}{
		{
			name:      "today (no args)",
			dateStr:   "",
			month:     0,
			day:       0,
			yesterday: false,
			wantYear:  now.Year(),
			wantMonth: now.Month(),
			wantDay:   now.Day(),
		},
		{
			name:      "yesterday flag",
			dateStr:   "",
			month:     0,
			day:       0,
			yesterday: true,
			wantYear:  now.AddDate(0, 0, -1).Year(),
			wantMonth: now.AddDate(0, 0, -1).Month(),
			wantDay:   now.AddDate(0, 0, -1).Day(),
		},
		{
			name:      "specific day",
			dateStr:   "",
			month:     0,
			day:       15,
			yesterday: false,
			wantYear:  now.Year(),
			wantMonth: now.Month(),
			wantDay:   15,
		},
		{
			name:      "specific month and day",
			dateStr:   "",
			month:     3,
			day:       20,
			yesterday: false,
			wantYear:  now.Year(),
			wantMonth: time.March,
			wantDay:   20,
		},
		{
			name:      "date string dd",
			dateStr:   "25",
			month:     0,
			day:       0,
			yesterday: false,
			wantYear:  now.Year(),
			wantMonth: now.Month(),
			wantDay:   25,
		},
		{
			name:      "date string mm-dd",
			dateStr:   "06-15",
			month:     0,
			day:       0,
			yesterday: false,
			wantYear:  now.Year(),
			wantMonth: time.June,
			wantDay:   15,
		},
		{
			name:      "date string YYYY-mm-dd",
			dateStr:   "2024-12-25",
			month:     0,
			day:       0,
			yesterday: false,
			wantYear:  2024,
			wantMonth: time.December,
			wantDay:   25,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := determineDate(tt.dateStr, tt.month, tt.day, tt.yesterday)
			if err != nil {
				t.Fatalf("determineDate() error = %v", err)
			}

			if got.Year() != tt.wantYear || got.Month() != tt.wantMonth || got.Day() != tt.wantDay {
				t.Errorf("determineDate() = %v, want %d-%02d-%02d",
					got, tt.wantYear, tt.wantMonth, tt.wantDay)
			}
		})
	}
}

func TestLoadConfig(t *testing.T) {
	// テスト用の一時設定ファイルを作成
	tmpDir := t.TempDir()
	configPath := filepath.Join(tmpDir, "test_config.yaml")

	configContent := `default:
  outdir: test/diary
  filename: "{{.Title}}.md"
  template: test/template.md
`
	if err := os.WriteFile(configPath, []byte(configContent), 0644); err != nil {
		t.Fatalf("Failed to create test config: %v", err)
	}

	config, err := loadConfig(configPath)
	if err != nil {
		t.Fatalf("loadConfig() error = %v", err)
	}

	if config.Default.Outdir != "test/diary" {
		t.Errorf("config.Default.Outdir = %v, want test/diary", config.Default.Outdir)
	}
	if config.Default.Filename != "{{.Title}}.md" {
		t.Errorf("config.Default.Filename = %v, want {{.Title}}.md", config.Default.Filename)
	}
	if config.Default.Template != "test/template.md" {
		t.Errorf("config.Default.Template = %v, want test/template.md", config.Default.Template)
	}
}

func TestGenerateFilePath(t *testing.T) {
	config := &Config{}
	config.Default.Outdir = "content/diary"
	config.Default.Filename = "{{.Title}}.md"

	date := time.Date(2024, 3, 15, 0, 0, 0, 0, time.Local)

	got, err := generateFilePath(config, date)
	if err != nil {
		t.Fatalf("generateFilePath() error = %v", err)
	}

	want := filepath.Join("content/diary", "2024-03-15.md")
	if got != want {
		t.Errorf("generateFilePath() = %v, want %v", got, want)
	}
}

func TestCreateFromTemplate(t *testing.T) {
	tmpDir := t.TempDir()

	// テンプレートファイルの作成
	templatePath := filepath.Join(tmpDir, "template.md")
	templateContent := `---
title: "{{ .Date }}"
date: "{{ .Date }}"
---
`
	if err := os.WriteFile(templatePath, []byte(templateContent), 0644); err != nil {
		t.Fatalf("Failed to create template file: %v", err)
	}

	// 設定の準備
	config := &Config{}
	config.Default.Outdir = filepath.Join(tmpDir, "diary")
	config.Default.Filename = "{{.Title}}.md"
	config.Default.Template = templatePath

	// ファイル作成
	date := time.Date(2024, 3, 15, 0, 0, 0, 0, time.Local)
	filePath := filepath.Join(config.Default.Outdir, "2024-03-15.md")

	err := createFromTemplate(config, filePath, date)
	if err != nil {
		t.Fatalf("createFromTemplate() error = %v", err)
	}

	// ファイルが作成されたか確認
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		t.Errorf("File was not created: %v", filePath)
	}

	// ファイルの内容を確認
	content, err := os.ReadFile(filePath)
	if err != nil {
		t.Fatalf("Failed to read created file: %v", err)
	}

	expectedContent := `---
title: "2024-03-15"
date: "2024-03-15"
---
`
	if string(content) != expectedContent {
		t.Errorf("File content = %v, want %v", string(content), expectedContent)
	}
}
