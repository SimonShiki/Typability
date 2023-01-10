import { atom } from "jotai";

export const filePathJotai = atom<string | null>(null);
export const contentJotai = atom<string>(`
# 🗒️ Typability
> **Typability** is a WYSIWYG markdown editor based on [Milkdown](https://milkdown.dev/).
> Here is the [repo](https://github.com/SimonShiki/typability)
*   Features
    *   [x] 📝 **WYSIWYG Markdown**
    *   [x] 🎨 **Fluent Design**
    *   [x] 🚀 **Lightweight**
`);
