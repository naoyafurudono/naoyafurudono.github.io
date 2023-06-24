use std::os::unix::process::CommandExt;
use std::process::Command;

use chrono::NaiveDate;
use clap::Parser;

mod error;
use control::{MyDate, DailyFile};
use error::{MyErr, Result};
mod control;

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
