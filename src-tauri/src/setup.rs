use tauri::{App, Manager};
use window_vibrancy::{self};

use window_shadows::set_shadow;

#[cfg(target_os = "macos")]
pub fn init(app: &mut App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    let win = app.get_window("main").unwrap();
    set_shadow(&win, true).unwrap();

    Ok(())
}

#[tauri::command]
pub fn apply_mica(window: tauri::Window, dark: Option<bool>) {
    #[cfg(target_os = "windows")]
    window_vibrancy::apply_mica(&window, dark)
        .expect("Unsupported platform! 'apply_mica' is only supported on Windows 10.0.21996");
}

#[tauri::command]
pub fn clear_mica(window: tauri::Window) {
    #[cfg(target_os = "windows")]
    window_vibrancy::clear_mica(&window)
        .expect("Unsupported platform! 'clear_mica' is only supported on Windows 10.0.21996");
}

#[tauri::command]
pub fn apply_tabbed(window: tauri::Window, dark: Option<bool>) {
    #[cfg(target_os = "windows")]
    window_vibrancy::apply_tabbed(&window, dark)
        .expect("Unsupported platform! 'apply_tabbed' is only supported on Windows 10.0.21996");
}

#[tauri::command]
pub fn clear_tabbed(window: tauri::Window) {
    #[cfg(target_os = "windows")]
    window_vibrancy::clear_tabbed(&window)
        .expect("Unsupported platform! 'clear_mica' is only supported on Windows 10.0.21996");
}

#[tauri::command]
pub fn apply_arcylic(window: tauri::Window) {
    #[cfg(target_os = "windows")]
    window_vibrancy::apply_acrylic(&window, Some((18, 18, 18, 125)))
        .expect("Unsupported platform! 'apply_arcylic' is only supported on Windows 10.0.17134");
}

#[tauri::command]
pub fn clear_arcylic(window: tauri::Window) {
    #[cfg(target_os = "windows")]
    window_vibrancy::clear_acrylic(&window)
        .expect("Unsupported platform! 'clear_arcylic' is only supported on Windows 10.0.17134");
}

#[tauri::command]
pub fn get_args() -> Result<Vec<String>, ()> {
  let system_args: Vec<String> = std::env::args().collect();
  Ok(system_args)
}

#[cfg(target_os = "windows")]
pub fn init(app: &mut App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    let win = app.get_window("typability").unwrap();
    set_shadow(&win, true).unwrap();

    Ok(())
}

#[cfg(target_os = "linux")]
pub fn init(app: &mut App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    Ok(())
}