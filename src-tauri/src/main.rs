#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod setup;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

fn main() {
    tauri::Builder::default()
        .setup(setup::init)
        .invoke_handler(tauri::generate_handler![setup::apply_mica, setup::clear_mica, setup::apply_arcylic, setup::clear_arcylic, setup::apply_vibrancy])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
