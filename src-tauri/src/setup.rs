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
    use os_info::Version;

    let binding = os_info::get();
    let build = binding.version();
    if PartialOrd::ge(&build, &&Version::Semantic(10, 0, 21996)) {
        window_vibrancy::apply_mica(&win)
            .expect("Unsupported platform! 'apply_mica' is only supported on Windows 11");
    } else if PartialOrd::ge(&build, &&Version::Semantic(10, 0, 17134)) {
        window_vibrancy::apply_acrylic(&win, Some((18, 18, 18, 125)))
            .expect("Unsupported platform! 'apply_arcylic' is only supported on Windows");
    }

    Ok(())
}