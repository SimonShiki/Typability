use tauri::{App, Manager};
use window_vibrancy::{self, NSVisualEffectMaterial};
use rdev::{simulate, EventType, Key, SimulateError};
use std::{thread, time};

use window_shadows::set_shadow;

#[cfg(target_os = "macos")]
pub fn init(app: &mut App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    let win = app.get_window("main").unwrap();
    set_shadow(&win, true).unwrap();

    window_vibrancy::apply_vibrancy(&win, NSVisualEffectMaterial::FullScreenUI, None, None)
        .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
    Ok(())
}

#[cfg(target_os = "windows")]
#[tauri::command]
pub fn open_emoji_panel() {
    send(&EventType::KeyPress(Key::MetaLeft));
    send(&EventType::KeyPress(Key::Dot));
    send(&EventType::KeyRelease(Key::MetaLeft));
    send(&EventType::KeyRelease(Key::Dot));
}

#[tauri::command]
pub fn apply_mica(window: tauri::Window) {
    #[cfg(target_os = "windows")]
    window_vibrancy::apply_mica(&window)
        .expect("Unsupported platform! 'apply_mica' is only supported on Windows 10.0.21996");
}

#[tauri::command]
pub fn clear_mica(window: tauri::Window) {
    #[cfg(target_os = "windows")]
    window_vibrancy::clear_mica(&window)
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

#[cfg(target_os = "windows")]
fn send(event_type: &EventType) { // Now it's only available on Windows, don't compile it in macOS
    let delay = time::Duration::from_millis(20);
    match simulate(event_type) {
        Ok(()) => (),
        Err(SimulateError) => {
            println!("We could not send {:?}", event_type);
        }
    }
    // Let ths OS catchup (at least MacOS)
    thread::sleep(delay);
}

#[cfg(target_os = "windows")]
pub fn init(app: &mut App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    let win = app.get_window("main").unwrap();
    set_shadow(&win, true).unwrap();

    Ok(())
}

#[cfg(target_os = "linux")]
pub fn init(app: &mut App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    Ok(())
}