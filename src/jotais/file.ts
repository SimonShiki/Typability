import { atom } from "jotai";
import { save as saveFilePicker } from '@tauri-apps/api/dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/api/fs';
import { documentDir } from '@tauri-apps/api/path';
import { settingsJotai } from "./settings";
import messages from '../../locale';
import { confirm } from '@tauri-apps/api/dialog';

// File extensions that can be opened by Typability
export const availbleExts = [{
    name: 'Markdown',
    extensions: ['md']
}, {
    name: 'Text file',
    extensions: ['txt']
}];

/*
 * Current file path. If you change this, then contentJotai & savedJotai will be updated (Means 'Open')
 * If it's null, contentJotai will be set to null (Means 'New')
 */
export const filePathJotai = atom(null, async (get, set, value: string | null) => {
    if (!get(savedJotai)) {
        const result = await confirm(
            messages[get(settingsJotai).language].message['closeDialog.title'],
            {
                title: messages[get(settingsJotai).language].message['closeDialog.content'],
                type: 'warning'
            }
        );

        if (result) await set(savingJotai, true);
    }

    set(filePathJotai, value);

    if (value !== null) {
        try {
            const textContent = await readTextFile(value);
            set(contentJotai, textContent);
        } catch (e) {
            alert(`Error occurred while opening file:\n${(e as Error).message}`);
        }
    } else {
        set(contentJotai, '');
    }
    set(savedJotai, true);
});

export const savedJotai = atom(true);

/**
 * Whether editor is saving a file.
 * If you change this, Editor will save content to your file(Means 'Save' or 'Save as')
 */
export const savingJotai = atom(false, async (get, set, value: boolean) => {
    set(savingJotai, value);
    if (!value) return;

    let path: string | null = get(filePathJotai);
    if (path === null) {
        path = await saveFilePicker({
            defaultPath: await documentDir(),
            filters: availbleExts
        });
        if (path === null) {
            set(savingJotai, false);
            return;
        }
    }

    try {
        await writeTextFile({ path, contents: get(contentJotai) });
        set(savedJotai, true);
    } catch (e) {
        alert(`Error occurred while saving file:\n${(e as Error).message}`);
    }
    set(savingJotai, false);
});

export const contentJotai = atom(`
# 🗒️ Typability
> **Typability** is a WYSIWYG markdown editor based on [Milkdown](https://milkdown.dev/).
> Here is the [repo](https://github.com/SimonShiki/typability)
*   Features
    *   [x] 📝 **WYSIWYG Markdown**
    *   [x] 🎨 **Fluent Design**
    *   [x] 🚀 **Lightweight**
`, (get, set, value: string) => {
    if (value.trim() !== get(contentJotai).trim()) {
        set(contentJotai, value);
        set(savedJotai, false);
    }
});