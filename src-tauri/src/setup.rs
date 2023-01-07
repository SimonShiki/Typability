use tauri::{App, Manager};
use window_vibrancy::{self, NSVisualEffectMaterial};

use window_shadows::set_shadow;

/// setup
pub fn init(app: &mut App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    let win = app.get_window("main").unwrap();

    #[cfg(any(windows, target_os = "macos"))]
    set_shadow(&win, true).unwrap();

    #[cfg(target_os = "macos")]
    window_vibrancy::apply_vibrancy(&win, NSVisualEffectMaterial::FullScreenUI)
        .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

    #[cfg(target_os = "windows")]
    window_vibrancy::apply_mica(&win)
        .expect("Unsupported platform! 'apply_mica' is only supported on Windows 11");

    Ok(())
}