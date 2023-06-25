use std::error;
use std::fmt::{Debug, Display};

pub type Result<T> = std::result::Result<T, Box<dyn error::Error>>;

#[derive(Debug)]
pub struct MyErr {
    pub msg: String,
}

impl Display for MyErr {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_fmt(format_args!("error: {}", self.msg))
    }
}

impl error::Error for MyErr {}
