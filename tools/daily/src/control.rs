use crate::error::{MyErr, Result};
use chrono::{prelude::Local, Datelike, NaiveDate};
use std::{path, process::Command, str::from_utf8};

pub struct DailyFile {
    pub date: String,
}

impl DailyFile {
    pub fn new(date: NaiveDate) -> Self {
        DailyFile {
            date: date.format("%Y-%m-%d").to_string(),
        }
    }

    pub fn today() -> Self {
        let today = Local::now().date_naive();
        Self::new(today)
    }

    pub fn filepath(&self) -> Result<String> {
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

    pub fn ensure_exist(&self) -> Result<()> {
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
pub struct MyDate {
    date: NaiveDate,
}

impl MyDate {
    pub fn now() -> Self {
        let current = Local::now().date_naive();
        MyDate { date: current }
    }

    pub fn force(&self, y: Option<i32>, m: Option<u32>, d: Option<u32>) -> Result<Self> {
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

    pub fn force_day(&self, d: u32) -> Result<Self> {
        self.force(None, None, Some(d))
    }

    pub fn to_naive_date(&self) -> NaiveDate {
        self.date
    }
}