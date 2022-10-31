use mslnk::ShellLink;
use tauri::api::path::desktop_dir;

use std::env::current_exe;

#[tauri::command]
pub fn create_desktop_lnk() -> Result<(), String> {
    let target =  match current_exe() {
        Ok(current_exe) => current_exe.display().to_string(),
        Err(_) => return Err("获取当前工具路径失败".into()),
    };
    let mut lnk_path = match desktop_dir() {
        None => return Err("定位桌面文件夹失败".into()),
        Some(s) => s,
    };
    lnk_path.push("UbiGamesBackupTool");
    lnk_path.set_extension("lnk");
    let lnk = lnk_path.display().to_string();
    let sl = ShellLink::new(&target).unwrap();
    sl.create_lnk(&lnk).unwrap();
    Ok(())
}
