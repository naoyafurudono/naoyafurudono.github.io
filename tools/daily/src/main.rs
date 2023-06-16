use std::fmt::{Debug, Display};
use std::os::unix::process::CommandExt;
use std::{path, process::Command};

use chrono::prelude::Local;
use chrono::{Datelike, NaiveDate};
use clap::Parser;

struct DailyFile {
    pub date: String,
}

#[derive(Debug)]
struct MyErr {}
impl Display for MyErr {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_fmt(format_args!("MyErr {}", "hello"))
    }
}

impl DailyFile {
    fn new(date: NaiveDate) -> Self {
        DailyFile {
            date: date.format("%Y-%m-%d").to_string(),
        }
    }

    fn today() -> Self {
        let today = Local::now().date_naive();
        Self::new(today)
    }

    fn filepath(&self) -> Option<String> {
        let content_dir = path::Path::new("./content/");
        let filepath = self.hugo_name();
        let fpath = content_dir.join(filepath);
        let s = fpath.to_str().and_then(|st| Some(st.to_string()));
        s
    }

    fn hugo_name(&self) -> path::PathBuf {
        let s = format!["daily/{}.md", self.date];
        path::PathBuf::from(s)
    }

    fn ensure_exist(&self) -> Result<(), MyErr> {
        let filepath_str = self.filepath().ok_or(MyErr {})?;
        let already_exists = Command::new("test")
            // 次の２つはこのように別々に渡すのが正解らしい。これはUnixの教養？
            .arg("-f")
            .arg(filepath_str)
            .output()
            .or_else(|_err| Err(MyErr {}))
            .and_then(|o| {
                if o.status.success() {
                    Ok(())
                } else {
                    Err(MyErr {})
                }
            });

        if already_exists.is_ok() {
            Ok(())
        } else {
            let hugo_name = self.hugo_name();
            let hugo_name_str = hugo_name.to_str().ok_or(MyErr {})?;
            let res = Command::new("hugo").arg("new").arg(hugo_name_str).output();
            match res {
                Ok(o) => {
                    if o.status.success() {
                        return Ok(());
                    } else {
                        return Err(MyErr {});
                    }
                }
                Err(_) => Err(MyErr {}),
            }
        }
    }
}

#[derive(Clone)]
struct MyDate {
    date: NaiveDate,
}

impl MyDate {
    fn now() -> Self {
        let current = Local::now().date_naive();
        MyDate { date: current }
    }

    fn force_month(&self, m: Option<u32>) -> Option<Self> {
        if m.is_none() {
            Some(self.clone())
        } else {
            let y = self.date.year();
            let d = self.date.day();
            NaiveDate::from_ymd_opt(y, m?, d).and_then(|nd| Some(MyDate { date: nd }))
        }
    }
    fn force_day(&self, d: Option<u32>) -> Option<Self> {
        if d.is_none() {
            Some(self.clone())
        } else {
            let y = self.date.year();
            let m = self.date.month();
            NaiveDate::from_ymd_opt(y, m, d?).and_then(|nd| Some(MyDate { date: nd }))
        }
    }

    fn to_naive_date(&self) -> NaiveDate {
        self.date
    }
}

enum Cmd {
    Today,
    Date { date: NaiveDate },
}
impl Cmd {
    fn new(args: &Args) -> Result<Cmd, MyErr> {
        let cmd = match &args.date {
            None => match (args.month, args.day) {
                (None, None) => Cmd::Today,
                _ => {
                    let nd = MyDate::now()
                        .force_month(args.month)
                        .ok_or(MyErr {})?
                        .force_day(args.day)
                        .ok_or(MyErr {})?
                        .to_naive_date();
                    Cmd::Date { date: nd }
                }
            },
            Some(date) => {
                let nd = NaiveDate::parse_from_str(&date, "%Y-%m-%d").or_else(|_| {
                    if date.len() == 2 {
                        let d = date.parse::<u32>().or_else(|_| Err(MyErr {}))?;
                        let nd = MyDate::now()
                            .force_day(Some(d))
                            .ok_or(MyErr {})?
                            .to_naive_date();
                        Ok(nd)
                    } else if date.len() == 5 {
                        let m_d: Vec<&str> = date.split("-").collect();
                        let m = m_d
                            .get(0)
                            .ok_or(MyErr {})?
                            .parse::<u32>()
                            .or_else(|_| Err(MyErr {}))?;
                        let d = m_d
                            .get(1)
                            .ok_or(MyErr {})?
                            .parse::<u32>()
                            .or_else(|_| Err(MyErr {}))?;
                        let nd = MyDate::now()
                            .force_day(Some(d))
                            .ok_or(MyErr {})?
                            .force_month(Some(m))
                            .ok_or(MyErr {})?
                            .to_naive_date();
                        Ok(nd)
                    } else {
                        Err(MyErr {})
                    }
                })?;
                Cmd::Date { date: nd }
            }
        };
        Ok(cmd)
    }
}

fn run(args: Args) -> Result<(), MyErr> {
    let cmd = Cmd::new(&args)?;
    let df = match cmd {
        Cmd::Today => DailyFile::today(),
        Cmd::Date { date } => DailyFile::new(date),
    };
    let () = df.ensure_exist()?;
    let filepath = df.filepath().ok_or(MyErr {})?;
    if args.remove {
        let err = Command::new("rm").arg(filepath).exec();
        println!("{:?}", err);
        return Ok(());
    } else {
        let err = Command::new("nvim").arg(filepath).exec();
        println!("{:?}", err);
    }
    Ok(())
}

#[derive(Parser)]
#[command(name = "daily")]
#[command(author = "Naoya Furudono <naoyafurudono@gmail.com>")]
#[command(about = "Hugoで日記ファイルを生成し、開くためのCLI", long_about = None)]
struct Args {
    /// (YYYY-)(mm-)ddd
    /// 指定しなかった場合は現在の年、月が使われる
    /// 他とは併用不可
    date: Option<String>,

    /// `mm` | `m`
    /// dayと併用可
    #[arg(short, long)]
    month: Option<u32>,

    /// `dd` | `d`
    /// monthと併用可
    #[arg(short, long)]
    day: Option<u32>,

    /// 指定した日の日記ファイルを削除する
    #[arg(short, long, default_value = "true")]
    remove: bool,
}

fn main() {
    let args = Args::parse();
    match run(args) {
        Ok(_) => (),
        Err(e) => eprintln!("{}", e),
    }
}
