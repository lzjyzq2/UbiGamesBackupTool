#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod autostart;
mod lnk;
mod proc;
extern crate winreg;
use autostart::MacosLauncher;
use std::env::current_exe;
use winreg::enums::*;
use winreg::RegKey;
use lnk::create_desktop_lnk;
use proc::get_all_process;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn get_registry() -> Result<String, String> {
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let cur_ver = hklm.open_subkey("SOFTWARE\\Classes\\uplay\\Shell\\Open\\Command");
    let cur_ver = match cur_ver {
        Ok(cur_ver) => cur_ver,
        Err(_e) => return Err("".into()),
    };
    let pk = cur_ver.get_value("");
    match pk {
        Ok(pk) => return Ok(pk),
        Err(_e) => return Err("".into()),
    }
}
#[tauri::command]
fn get_running_dir() -> Result<String, String> {
    let current_exe = match current_exe() {
        Ok(current_exe) => current_exe,
        Err(_) => return Err("获取当前工具路径失败".into()),
    };
    let path = match current_exe.parent() {
        None => return Err("获取当前目录失败".into()),
        Some(p)=> p.display().to_string()
    };
    Ok(path)
}

fn main() {
    tauri::Builder::default()
        .plugin(autostart::init(MacosLauncher::LaunchAgent, None))
        .invoke_handler(tauri::generate_handler![
            get_registry,
            get_running_dir,
            create_desktop_lnk,
            get_all_process,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
