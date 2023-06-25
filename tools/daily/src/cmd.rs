use crate::control::{DailyFile, MyDate};
use crate::error::{MyErr, Result};
use crate::Args;
use chrono::NaiveDate;
use std::os::unix::process::CommandExt;
use std::process::Command;

enum Spec {
    Today,
    Date { date: NaiveDate },
}
pub struct Cmd {
    spec: Spec,
    remove: bool,
}

impl Cmd {
    pub fn new(args: &Args) -> Result<Cmd> {
        let spec = match &args.date {
            None => match (args.month, args.day) {
                (None, None) => Spec::Today,
                _ => {
                    let nd = MyDate::now()
                        .force(None, args.month, args.day)?
                        .to_naive_date();
                    Spec::Date { date: nd }
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
                Spec::Date { date: nd }
            }
        };
        Ok(Cmd {
            spec,
            remove: args.remove,
        })
    }
    pub fn run(self) -> Result<()> {
        // let cmd = Cmd::new(&args)?;
        let df = match self.spec {
            Spec::Today => DailyFile::today(),
            Spec::Date { date } => DailyFile::new(date),
        };
        let () = df.ensure_exist()?;
        let filepath = df.filepath()?;
        // ensure no existとか実装して、もっといい感じに条件分岐するといいんじゃないでしょうか？
        if self.remove {
            let err = Command::new("rm").arg(filepath).exec();
            println!("{:?}", err);
            return Ok(());
        } else {
            let err = Command::new("nvim").arg(filepath).exec();
            println!("{:?}", err);
        }
        Ok(())
    }
}
