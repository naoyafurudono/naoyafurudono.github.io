use crate::control::{DailyFile, MyDate};
use crate::error::{MyErr, Result};
use crate::Args;
use chrono::NaiveDate;
use std::iter;
use std::os::unix::process::CommandExt;
use std::process::Command;
use std::env;

enum Spec {
    Today,
    Yesterday,
    Date { date: NaiveDate },
}
pub struct Cmd {
    spec: Spec,
    remove: bool,
}

impl Cmd {
    pub fn new(args: &Args) -> Result<Cmd> {
        let spec = if args.yesterday {
            Spec::Yesterday
        } else {
            match (&args.date, &args.month, &args.day) {
                (None, None, None) => Spec::Today,
                (Some(date), None, None) => Spec::Date {
                    date: parse_naive_date(&date)?,
                },
                (None, _, _) => {
                    let today = MyDate::now()
                        .force(None, args.month, args.day)?
                        .to_naive_date();
                    Spec::Date { date: today }
                }
                _ => {
                    return Err(Box::new(MyErr {
                    msg: "invalid argument. Date argument can used with neither --day nor --month.".to_string(),
                }));
                }
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
            Spec::Yesterday => DailyFile::yesterday(),
            Spec::Date { date } => DailyFile::new(date),
        };
        let _ = df.ensure_exist()?;
        let filepath = df.filepath()?;
        let editor_name = env::var("EDITOR").unwrap_or("nvim".to_string());
        let err = if self.remove {
            Command::new("rm").arg(filepath).exec()
        } else {
            let mut cmd = Command::new(editor_name);
            cmd.arg(filepath);
            cmd.exec()
        };
        Err(Box::new(err))
    }
}

fn ensure_length<A: Copy>(v: Vec<A>, len: usize) -> Vec<Option<A>> {
    if v.len() > len {
        v[0..len].iter().map(|&x| Some(x)).collect()
    } else {
        v.iter()
            .map(|&x| Some(x))
            .chain(iter::repeat(None))
            .take(len)
            .collect()
    }
}
fn parse_naive_date(s: &str) -> Result<NaiveDate> {
    let ss = s.split('-').rev();
    let mut us = Vec::new();
    for ds in ss {
        let d = ds.parse::<u32>().or_else(|_| {
            Err(MyErr {
                msg: "fail to parse day".to_string(),
            })
        })?;
        us.push(d);
    }

    let mut us = ensure_length(us, 3);
    us.reverse();
    Ok(MyDate::now().force(us[0], us[1], us[2])?.to_naive_date())
}
