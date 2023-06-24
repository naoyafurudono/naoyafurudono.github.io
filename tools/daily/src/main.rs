use std::os::unix::process::CommandExt;
use std::str::from_utf8;
use std::{path, process::Command};

use chrono::prelude::Local;
use chrono::{Datelike, NaiveDate};
use clap::Parser;

mod error;
use error::{MyErr, Result};

struct DailyFile {
    pub date: String,
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

    fn filepath(&self) -> Result<String> {
        let content_dir = path::Path::new("./content/");
        let filepath = self.hugo_name();
        let fpath = content_dir.join(filepath);
        let s = fpath.to_str();
        match s {
            None => Err(MyErr {
                msg: "fail string conversion".to_string(),
            }
            .into()),
            Some(s) => Ok(s.to_string()),
        }
    }

    fn hugo_name(&self) -> path::PathBuf {
        let s = format!["daily/{}.md", self.date];
        path::PathBuf::from(s)
    }

    fn ensure_exist(&self) -> Result<()> {
        let filepath_str = self.filepath()?;
        let already_exists = Command::new("test")
            // 次の２つはこのように別々に渡すのが正解らしい。これはUnixの教養？
            .arg("-f")
            .arg(filepath_str)
            .output()?
            .status
            .success();

        if already_exists {
            Ok(())
        } else {
            let hugo_name = self.hugo_name();
            let hugo_name_str = hugo_name.to_str().ok_or(MyErr {
                msg: "fail string conversion".to_string(),
            })?;
            let res = Command::new("hugo")
                .arg("new")
                .arg(hugo_name_str)
                .output()?;
            if res.status.success() {
                Ok(())
            } else {
                Err(MyErr {
                    msg: from_utf8(&res.stdout)
                        .map_err(|_err| MyErr {
                            msg: _err.to_string(),
                        })?
                        .to_string(),
                }
                .into())
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

    fn force(&self, y: Option<i32>, m: Option<u32>, d: Option<u32>) -> Result<Self> {
        let y = y.unwrap_or(self.date.year());
        let m = m.unwrap_or(self.date.month());
        let d = d.unwrap_or(self.date.day());

        match NaiveDate::from_ymd_opt(y, m, d) {
            Some(nd) => Ok(MyDate { date: nd }),
            None => Err(MyErr {
                // TODO formatを使う
                msg: "cannot create date".to_string(),
            }
            .into()),
        }
    }

    fn force_day(&self, d: u32) -> Result<Self> {
        self.force(None, None, Some(d))
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
    fn new(args: &Args) -> Result<Cmd> {
        let cmd = match &args.date {
            None => match (args.month, args.day) {
                (None, None) => Cmd::Today,
                _ => {
                    let nd = MyDate::now()
                        .force(None, args.month, args.day)?
                        .to_naive_date();
                    Cmd::Date { date: nd }
                }
            },
            Some(date) => {
                let nd = NaiveDate::parse_from_str(&date, "%Y-%m-%d").or_else(
                    |_| -> Result<NaiveDate> {
                        if date.len() == 2 {
                            let d = date.parse::<u32>().or_else(|_| {
                                Err(MyErr {
                                    msg: "fail to parse day".to_string(),
                                })
                            })?;
                            let nd = MyDate::now().force_day(d)?.to_naive_date();
                            Ok(nd)
                        } else if date.len() == 5 {
                            let m_d: Vec<&str> = date.split("-").collect();
                            let m = m_d
                                .get(0)
                                .ok_or(MyErr {
                                    msg: "fail to parse month".to_string(),
                                })?
                                .parse::<u32>()
                                .or_else(|_| {
                                    Err(MyErr {
                                        msg: "fail to parse month".to_string(),
                                    })
                                })?;
                            let d = m_d
                                .get(1)
                                .ok_or(MyErr {
                                    msg: "fail to parse day".to_string(),
                                })?
                                .parse::<u32>()
                                .or_else(|_| {
                                    Err(MyErr {
                                        msg: "fail to parse day".to_string(),
                                    })
                                })?;
                            let nd = MyDate::now().force(None, Some(m), Some(d))?.to_naive_date();
                            Ok(nd)
                        } else {
                            Err(MyErr {
                                msg: "fail to parse date".to_string(),
                            }
                            .into())
                        }
                    },
                )?;
                Cmd::Date { date: nd }
            }
        };
        Ok(cmd)
    }
}

fn run(args: Args) -> Result<()> {
    let cmd = Cmd::new(&args)?;
    let df = match cmd {
        Cmd::Today => DailyFile::today(),
        Cmd::Date { date } => DailyFile::new(date),
    };
    let () = df.ensure_exist()?;
    let filepath = df.filepath()?;
    // ensure no existとか実装して、もっといい感じに条件分岐するといいんじゃないでしょうか？
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
    #[arg(short, long, default_value = "false")]
    remove: bool,
}

fn main() {
    let args = Args::parse();
    match run(args) {
        Ok(_) => (),
        Err(e) => eprintln!("{}", e),
    }
}
