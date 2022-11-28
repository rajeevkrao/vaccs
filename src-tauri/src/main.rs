#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, Menu, SystemTrayMenu, SystemTrayMenuItem, SystemTrayEvent};
use tauri_plugin_store::PluginBuilder;
use tauri::Manager;
use tauri::SystemTray;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn test() -> bool{
    println!("Testing");
    true
}

/* fn print_type_of<T>(_: &T) {
    println!("{}", std::any::type_name::<T>())
} */

fn main() {

    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let tray_menu = SystemTrayMenu::new()
      .add_item(hide)
      .add_native_item(SystemTrayMenuItem::Separator)
      .add_item(quit);
    let system_tray = SystemTray::new()
      .with_menu(tray_menu);

    let menu = Menu::new()
    .add_item(CustomMenuItem::new("refresh", "Refresh"))
    .add_item(CustomMenuItem::new("addToken", "Manage Token"));

    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| {
            match event.menu_item_id() {
              "addToken" => {
                event.window().app_handle().emit_all("addToken",true).ok();
              }
              "refresh" =>{
                event.window().app_handle().emit_all("refresh",true).ok();
              }
              _ => {}
            }
          })
        .plugin(PluginBuilder::default().build())
        .invoke_handler(tauri::generate_handler![greet, test])
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
          })
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
          SystemTrayEvent::LeftClick {
            position: _,
            size: _,
            ..
          } => {
            println!("system tray received a left click");
          }
          SystemTrayEvent::RightClick {
            position: _,
            size: _,
            ..
          } => {
            println!("system tray received a right click");
          }
          SystemTrayEvent::DoubleClick {
            position: _,
            size: _,
            ..
          } => {
            println!("system tray received a double click");
          }
          SystemTrayEvent::MenuItemClick { id, .. } => {
            match id.as_str() {
              "quit" => {
                std::process::exit(0);
              }
              "hide" => {
                let window = app.get_window("main").unwrap();
                window.hide().unwrap();
              }
              _ => {}
            }
          }
          _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
