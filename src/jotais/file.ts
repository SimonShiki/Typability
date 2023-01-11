import { atom } from "jotai";

export const filePathJotai = atom(null, (_get, set, value) => {
    set(filePathJotai, value);
    set(savedJotai, true);
});
export const savedJotai = atom(true);
export const contentJotai = atom(`
# 🗒️ Typability
> **Typability** is a WYSIWYG markdown editor based on [Milkdown](https://milkdown.dev/).
> Here is the [repo](https://github.com/SimonShiki/typability)
*   Features
    *   [x] 📝 **WYSIWYG Markdown**
    *   [x] 🎨 **Fluent Design**
    *   [x] 🚀 **Lightweight**
`, (_get, set, value) => {
    set(contentJotai, value);
    set(savedJotai, false);
});