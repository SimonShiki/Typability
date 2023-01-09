#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use rdev::{simulate, Button, EventType, Key, SimulateError};
use std::{thread, time};

mod setup;

fn send(event_type: &EventType) {
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

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn open_emoji_panel() {
    send(&EventType::KeyPress(Key::MetaLeft));
    send(&EventType::KeyPress(Key::Dot));
    send(&EventType::KeyRelease(Key::MetaLeft));
    send(&EventType::KeyRelease(Key::Dot));
}

fn main() {
    tauri::Builder::default()
        .setup(setup::init)
        .invoke_handler(tauri::generate_handler![open_emoji_panel])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
