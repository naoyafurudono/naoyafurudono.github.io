use std::process;

use clap::Parser;
use cmd::Cmd;

mod cmd;
mod control;
mod error;

#[derive(Parser)]
#[command(name = "daily")]
#[command(author = "Naoya Furudono <naoyafurudono@gmail.com>")]
#[command(about = "Hugoで日記ファイルを生成し、開くためのCLI", long_about = None)]
pub struct Args {
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

    #[arg(short, long, default_value = "false")]
    yesterday: bool,
}

fn main() {
    let args = Args::parse();
    match Cmd::new(&args).and_then(|c| c.run()) {
        Ok(_) => process::exit(0),
        Err(e) => {
            eprintln!("{}", e);
            process::exit(1)
        }
    }
}
