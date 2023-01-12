<div align="center">

<img src="./images/typability-icon.svg" width="150" />

# Typability
a WYSIWYG markdown editor based on [Milkdown](https://milkdown.dev/).
(Thanks to [SoilZhu](https://github.com/SoilZhu) for drawing this icon!)

[![build(nightly)](https://github.com/SimonShiki/Typability/actions/workflows/validate.yml/badge.svg)](https://github.com/SimonShiki/Typability/actions/workflows/validate.yml)


<img src="./images/typability-screenshot.png" width="400" />
</div>

# ✨ Features
- [x] **🌈 Fluent Design - Use FluentUI components with Mica\Arcylic background**
- [x] **🪶 Lightweight - Bundle with tauri for smaller installer size and memory usage**
- [x] 📝 **WYSIWYG Markdown - provides Typora-like seamless Markdown editing experience**
# 🚧 Todo
- [x] Multi-language support
- [x] Find/Replace
- [x] LaTeX support
- [ ] More export options
- [ ] Two-column editor

# ☔ System Requirements
- [x] Windows 7+ (Recommend: Windows 10 1803 +)
- [x] macOS 11.3+ (Reasons: see [Fluent UI's broswer support matrix](https://react.fluentui.dev/?path=/docs/concepts-developer-browser-support-matrix--page))
- [x] most Linux distributions (Recommend/Tested: Ubuntu 18.04 +)

# 📦 How to build
This project is bundled with [tauri](https://tauri.app), You should follow [this guide](https://tauri.app/v1/guides/getting-started/prerequisites/) first.
```bash
yarn install # Install dependencies
yarn tauri dev # Start development server
yarn tauri build # Bundle App
```
