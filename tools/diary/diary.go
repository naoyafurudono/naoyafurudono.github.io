package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"text/template"
	"time"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Default TemplateConfig `yaml:"default"`
}

type TemplateConfig struct {
	Outdir   string `yaml:"outdir"`
	Filename string `yaml:"filename"`
	Template string `yaml:"template"`
}

type Article struct {
	Date  string
	Title string
}

func main() {
	// 設定ファイルの読み込み
	config, err := loadConfig("diary.yaml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading config: %v\n", err)
		os.Exit(1)
	}

	targetDate := Today()

	// ファイルパスの生成
	filePath, err := generateFilePath(config, targetDate)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error generating file path: %v\n", err)
		os.Exit(1)
	}

	// ファイルが存在しない場合はテンプレートから生成
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		if err := createFromTemplate(config, filePath, targetDate); err != nil {
			fmt.Fprintf(os.Stderr, "Error creating file from template: %v\n", err)
			os.Exit(1)
		}
		fmt.Printf("Created: %s\n", filePath)
	}

	// エディタで開く
	editor := os.Getenv("EDITOR")
	if editor == "" {
		editor = "nvim"
	}

	cmd := exec.Command(editor, filePath)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		fmt.Fprintf(os.Stderr, "Error opening editor: %v\n", err)
		os.Exit(1)
	}
}

type Date struct {
	Year  int
	Month int
	Day   int
}

func (d *Date) Format() string {
	return fmt.Sprintf("%04d-%02d-%02d", d.Year, d.Month, d.Day)
}

var local *time.Location

func init() {
	l, err := time.LoadLocation("Local")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading local location: %v\n", err)
		os.Exit(1)
	}
	local = l
}

func Today() Date {
	now := time.Now().In(local)
	return Date{
		Year:  now.Year(),
		Month: int(now.Month()),
		Day:   now.Day(),
	}
}

func mustAtoi(s string) int {
	var result int
	fmt.Sscanf(s, "%d", &result)
	return result
}

func loadConfig(configPath string) (*Config, error) {
	data, err := os.ReadFile(configPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read config file: %w", err)
	}

	var config Config
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, fmt.Errorf("failed to parse config file: %w", err)
	}

	return &config, nil
}

func generateFilePath(config *Config, date Date) (string, error) {
	dateStr := date.Format()

	// filenameテンプレートの処理
	tmpl, err := template.New("filename").Parse(config.Default.Filename)
	if err != nil {
		return "", fmt.Errorf("failed to parse filename template: %w", err)
	}

	var filenameBuf strings.Builder
	data := Article{
		Date:  dateStr,
		Title: dateStr,
	}
	if err := tmpl.Execute(&filenameBuf, data); err != nil {
		return "", fmt.Errorf("failed to execute filename template: %w", err)
	}

	return filepath.Join(config.Default.Outdir, filenameBuf.String()), nil
}

func createFromTemplate(config *Config, filePath string, date Date) error {
	// ディレクトリの作成
	dir := filepath.Dir(filePath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	// テンプレートの読み込み
	templateContent, err := os.ReadFile(config.Default.Template)
	if err != nil {
		return fmt.Errorf("failed to read template file %s: %w", config.Default.Template, err)
	}

	// テンプレートの実行
	tmpl, err := template.New("diary").Parse(string(templateContent))
	if err != nil {
		return fmt.Errorf("failed to parse template %s: %w", config.Default.Template, err)
	}

	dateStr := date.Format()
	data := Article{
		Date:  dateStr,
		Title: dateStr,
	}

	// ファイルの作成
	file, err := os.Create(filePath)
	if err != nil {
		return fmt.Errorf("failed to create file: %w", err)
	}
	defer file.Close()

	if err := tmpl.Execute(file, data); err != nil {
		return fmt.Errorf("failed to execute template: %w", err)
	}

	return nil
}
