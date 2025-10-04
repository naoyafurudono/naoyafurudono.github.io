package main

import (
	"flag"
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
	Default struct {
		Outdir   string `yaml:"outdir"`
		Filename string `yaml:"filename"`
		Template string `yaml:"template"`
	} `yaml:"default"`
}

type TemplateData struct {
	Date  string
	Title string
}

func main() {
	// コマンドライン引数の解析
	var (
		dateStr   = flag.String("date", "", "(YYYY-)(mm-)dd format")
		month     = flag.Int("month", 0, "month (1-12)")
		day       = flag.Int("day", 0, "day (1-31)")
		remove    = flag.Bool("remove", false, "remove the diary file")
		yesterday = flag.Bool("yesterday", false, "use yesterday's date")
	)
	flag.Parse()

	// 日付の決定
	targetDate, err := determineDate(*dateStr, *month, *day, *yesterday)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error determining date: %v\n", err)
		os.Exit(1)
	}

	// 設定ファイルの読み込み
	config, err := loadConfig("diary.yaml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading config: %v\n", err)
		os.Exit(1)
	}

	// ファイルパスの生成
	filePath, err := generateFilePath(config, targetDate)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error generating file path: %v\n", err)
		os.Exit(1)
	}

	// 削除モードの場合
	if *remove {
		if err := os.Remove(filePath); err != nil {
			fmt.Fprintf(os.Stderr, "Error removing file: %v\n", err)
			os.Exit(1)
		}
		fmt.Printf("Removed: %s\n", filePath)
		return
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

func determineDate(dateStr string, month, day int, yesterday bool) (time.Time, error) {
	now := time.Now()

	if yesterday {
		return now.AddDate(0, 0, -1), nil
	}

	if dateStr != "" {
		// dateStrのパース
		parts := strings.Split(dateStr, "-")
		var year, mon, d int

		switch len(parts) {
		case 1: // dd
			d = mustAtoi(parts[0])
			year = now.Year()
			mon = int(now.Month())
		case 2: // mm-dd
			mon = mustAtoi(parts[0])
			d = mustAtoi(parts[1])
			year = now.Year()
		case 3: // YYYY-mm-dd
			year = mustAtoi(parts[0])
			mon = mustAtoi(parts[1])
			d = mustAtoi(parts[2])
		default:
			return time.Time{}, fmt.Errorf("invalid date format: %s", dateStr)
		}

		return time.Date(year, time.Month(mon), d, 0, 0, 0, 0, time.Local), nil
	}

	// month/dayオプションの処理
	year := now.Year()
	mon := int(now.Month())
	d := now.Day()

	if month > 0 {
		mon = month
	}
	if day > 0 {
		d = day
	}

	return time.Date(year, time.Month(mon), d, 0, 0, 0, 0, time.Local), nil
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

func generateFilePath(config *Config, date time.Time) (string, error) {
	dateStr := date.Format("2006-01-02")

	// filenameテンプレートの処理
	tmpl, err := template.New("filename").Parse(config.Default.Filename)
	if err != nil {
		return "", fmt.Errorf("failed to parse filename template: %w", err)
	}

	var filenameBuf strings.Builder
	data := TemplateData{
		Date:  dateStr,
		Title: dateStr,
	}
	if err := tmpl.Execute(&filenameBuf, data); err != nil {
		return "", fmt.Errorf("failed to execute filename template: %w", err)
	}

	return filepath.Join(config.Default.Outdir, filenameBuf.String()), nil
}

func createFromTemplate(config *Config, filePath string, date time.Time) error {
	// ディレクトリの作成
	dir := filepath.Dir(filePath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	// テンプレートの読み込み
	templateContent, err := os.ReadFile(config.Default.Template)
	if err != nil {
		return fmt.Errorf("failed to read template file: %w", err)
	}

	// テンプレートの実行
	tmpl, err := template.New("diary").Parse(string(templateContent))
	if err != nil {
		return fmt.Errorf("failed to parse template: %w", err)
	}

	dateStr := date.Format("2006-01-02")
	data := TemplateData{
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
