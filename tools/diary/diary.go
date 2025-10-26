package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"text/template"
	"time"

	"github.com/spf13/cobra"
	"gopkg.in/yaml.v3"
)

type Config = map[string]TemplateConfig

type TemplateConfig struct {
	Outdir   string `yaml:"outdir"`
	Filename string `yaml:"filename"`
	Template string `yaml:"template"`
}

type Article struct {
	Date  string
	Title string
}

var (
	title string
	date  string
)

func main() {
	var rootCmd = &cobra.Command{
		Use:   "diary [template]",
		Short: "Create and open a diary entry",
		Args:  cobra.MaximumNArgs(1),
		RunE:  run,
	}

	rootCmd.Flags().StringVarP(&title, "title", "t", "", "Title of the diary entry")
	rootCmd.Flags().StringVarP(&date, "date", "d", "", "Date of the diary entry (YYYY-MM-DD format)")

	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

func run(cmd *cobra.Command, args []string) error {
	// テンプレート名の決定
	templateName := "default"
	if len(args) > 0 {
		templateName = args[0]
	}

	// 設定ファイルの読み込み
	config, err := loadConfig("diary.yaml")
	if err != nil {
		return fmt.Errorf("error loading config: %w", err)
	}

	c, ok := config[templateName]
	if !ok {
		return fmt.Errorf("template '%s' not found in config", templateName)
	}

	// 日付の処理
	var targetDate Date
	if date != "" {
		parts := strings.Split(date, "-")
		if len(parts) != 3 {
			return fmt.Errorf("invalid date format: %s (expected YYYY-MM-DD)", date)
		}
		targetDate = Date{
			Year:  mustAtoi(parts[0]),
			Month: mustAtoi(parts[1]),
			Day:   mustAtoi(parts[2]),
		}
	} else {
		targetDate = Today()
	}

	// タイトルの決定
	articleTitle := title
	if articleTitle == "" {
		articleTitle = targetDate.Format()
	}

	// ファイルパスの生成
	filePath, err := c.generateFilePath(targetDate, articleTitle)
	if err != nil {
		return fmt.Errorf("error generating file path: %w", err)
	}

	// ファイルが存在しない場合はテンプレートから生成
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		if err := c.createFromTemplate(filePath, targetDate, articleTitle); err != nil {
			return fmt.Errorf("error creating file from template: %w", err)
		}
		fmt.Printf("Created: %s\n", filePath)
	}

	// エディタで開く
	editor := os.Getenv("EDITOR")
	if editor == "" {
		editor = "nvim"
	}

	execCmd := exec.Command(editor, filePath)
	execCmd.Stdin = os.Stdin
	execCmd.Stdout = os.Stdout
	execCmd.Stderr = os.Stderr

	if err := execCmd.Run(); err != nil {
		return fmt.Errorf("error opening editor: %w", err)
	}

	return nil
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

func loadConfig(configPath string) (Config, error) {
	data, err := os.ReadFile(configPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read config file: %w", err)
	}

	var config Config
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, fmt.Errorf("failed to parse config file: %w", err)
	}

	return config, nil
}

func (c *TemplateConfig) generateFilePath(date Date, title string) (string, error) {
	dateStr := date.Format()

	// filenameテンプレートの処理
	tmpl, err := template.New("filename").Parse(c.Filename)
	if err != nil {
		return "", fmt.Errorf("failed to parse filename template: %w", err)
	}

	var filenameBuf strings.Builder
	data := Article{
		Date:  dateStr,
		Title: title,
	}
	if err := tmpl.Execute(&filenameBuf, data); err != nil {
		return "", fmt.Errorf("failed to execute filename template: %w", err)
	}

	return filepath.Join(c.Outdir, filenameBuf.String()), nil
}

func (c *TemplateConfig) createFromTemplate(filePath string, date Date, title string) error {
	// ディレクトリの作成
	dir := filepath.Dir(filePath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	// テンプレートの読み込み
	templateContent, err := os.ReadFile(c.Template)
	if err != nil {
		return fmt.Errorf("failed to read template file %s: %w", c.Template, err)
	}

	// テンプレートの実行
	tmpl, err := template.New("diary").Parse(string(templateContent))
	if err != nil {
		return fmt.Errorf("failed to parse template %s: %w", c.Template, err)
	}

	dateStr := date.Format()
	data := Article{
		Date:  dateStr,
		Title: title,
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
