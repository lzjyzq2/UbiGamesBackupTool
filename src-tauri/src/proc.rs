use serde::{Deserialize, Serialize};
use winproc::Process;

#[derive(Debug, Deserialize, Serialize)]
pub struct Proc {
    path: String,
    name: String,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct ProcList {
    procs: Vec<Proc>
}

#[tauri::command]
pub fn get_all_process() -> Result<ProcList, String> {
    let process_list = match Process::all() {
        Ok(p) => p,
        Err(_) => return Err("".into()),
    };
    let procs:Vec<Proc> = process_list.map(|p| Proc {
        path: match p.path() {
            Ok(path) => path.display().to_string(),
            Err(_) => "".into(),
        },
        name: match p.name() {
            Ok(name) => name,
            Err(_) => "".into(),
        },
    }).collect();
    let proc_list = ProcList{
        procs
    };
    Ok(proc_list)
}
