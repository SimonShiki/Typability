import MilkdownEditor from "./components/MilkdownEditor";
import styles from './App.module.scss';
import TitleBar from "./components/TitleBar";
import { useAtom } from "jotai";
import { contentJotai, filePathJotai } from "./jotais/file";
import { aboutJotai, loadingJotai, preferenceJotai, toolbarJotai, vibrancyJotai } from "./jotais/ui";
import classNames from "classnames";
import { Spinner } from "@fluentui/react-components";
import { useEffect, useLayoutEffect, useRef } from "react";
import { readTextFile } from '@tauri-apps/api/fs';
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';
import useIsDarkMode from "./hooks/dark";
import Preferences from "./components/Preferences";
import { writeTextFile } from '@tauri-apps/api/fs';
import { settingsJotai } from "./jotais/settings";
import { useKeyPress, useInterval, useEventListener, useAsyncEffect } from "ahooks";
import { version as getVersion, type as getType } from '@tauri-apps/api/os';
import About from "./components/About";
import { invoke } from '@tauri-apps/api/tauri';
import FloatingToolbar from "./components/FloatingToolbar";
import { Editor } from "@milkdown/core";

function App() {
    const [content, setContent] = useAtom(contentJotai);
    const [filePath] = useAtom(filePathJotai);
    const [loading] = useAtom(loadingJotai);
    const [, setToolbar] = useAtom(toolbarJotai);
    const [settings] = useAtom(settingsJotai);
    const [preference, setPreference] = useAtom(preferenceJotai);
    const [, setVibrancy] = useAtom(vibrancyJotai);
    const [about, setAbout] = useAtom(aboutJotai);
    const isDarkMode = useIsDarkMode();
    const editorInstance = useRef<Editor>(null);

    // Auto save
    useInterval(async () => {
        if (filePath === null) return;
        await writeTextFile({ path: filePath, contents: content });
    }, settings.autoSave ? settings.saveInterval * 1000 : -1);

    // Save when editor blurred
    useEventListener('blur', async () => {
        if (!settings.saveBlur || filePath === null) return;
        await writeTextFile({ path: filePath, contents: content });
    });

    // Shortcuts
    useKeyPress('ctrl.s', async () => {
        if (filePath === null) return;
        await writeTextFile({ path: filePath, contents: content });
        return;
    });
    useKeyPress('ctrl.f', (e) => {
        e.preventDefault();
        setToolbar('find');
    });
    useKeyPress('ctrl.h', () => {
        setToolbar('replace');
    });

    useEffect(() => {
        invoke(`apply_${settings.vibrancy}`);
    }, [settings.vibrancy]);

    // Ensure os info
    useAsyncEffect(async () => {
        const type = await getType();
        if (type === 'Linux') return;
        else {
            const version = await getVersion();
            if (type === 'Windows_NT') {
                const buildNumber = parseInt(version.substring(version.lastIndexOf('.') + 1));
                if (buildNumber >= 21996) { // Windows 11
                    setVibrancy({
                        arcylic: true,
                        mica: true,
                        vibrancy: false
                    });
                } else if (buildNumber >= 17134) { // Windows 10 1803
                    setVibrancy({
                        arcylic: true,
                        mica: false,
                        vibrancy: false
                    });
                }
            } else {
                // Ignore small version
                const versionNum = parseInt(version.substring(version.indexOf('.') + 1));
                if (versionNum >= 14) { // macOS 10.14 Mojave
                    setVibrancy({
                        arcylic: false,
                        mica: false,
                        vibrancy: true
                    });
                }
            }
        }
    }, []);

    // Read text file from path if filePath changed
    useLayoutEffect(() => {
        if (filePath !== null) {
            readTextFile(filePath).then((text) => {
                setContent(text as string);
            });
        }
    }, [filePath]);

    return (
        <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme} className='provider'>
            <div className={classNames(styles.container, {
                [styles.window]: !settings.vibrancy || settings.vibrancy === 'none'
            })}>
                <TitleBar />
                <div className={styles.editor} spellCheck={false}>
                    <MilkdownEditor
                        useMenu={false}
                        content={content}
                        onMarkdownUpdated={(markdown) => {
                            setContent(markdown);
                        }}
                        syntaxOption={settings.syntax}
                        theme={isDarkMode ? settings.themeDark : settings.theme}
                        ref={editorInstance}
                    />
                </div>
                <div
                    data-tauri-drag-region
                    className={classNames(styles.mask, {
                        [styles.white]: loading
                    })}
                >
                    <Spinner />
                </div>
                <Preferences open={preference} onClose={() => {
                    setPreference(false);
                }} />
                <About open={about} onClose={() => {
                    setAbout(false);
                }} />
                <FloatingToolbar editorInstance={editorInstance} />
            </div>
        </FluentProvider>
    );
}

export default App;
