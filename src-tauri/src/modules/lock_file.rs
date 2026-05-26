use std::env;
use std::fs;
use std::path::PathBuf;
use std::error::Error;

#[derive(Debug)]
#[allow(dead_code)]
pub struct LockfileData {
    pub name: String,
    pid: String,
    pub port: String,
    pub password: String,
    pub protocol: String,
}

#[allow(dead_code)]
pub fn get_data() -> Result<LockfileData, Box<dyn Error>> {
    let local_app_data = env::var("LOCALAPPDATA")?;
    let mut lockfile_path = PathBuf::from(local_app_data);
    lockfile_path.push("Riot Games");
    lockfile_path.push("Riot Client");
    lockfile_path.push("Config");
    lockfile_path.push("lockfile");

    let content = fs::read_to_string(lockfile_path)?;
    let parts: Vec<&str> = content.trim().split(':').collect();

    if parts.len() != 5 {
        return Err("unexpected lockfile format".into());
    }

    Ok(LockfileData {
        name: parts[0].to_string(),
        pid: parts[1].to_string(),
        port: parts[2].to_string(),
        password: parts[3].to_string(),
        protocol: parts[4].to_string(),
    })
}
