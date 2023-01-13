import MilkdownEditor from "./components/MilkdownEditor";
import styles from './App.module.scss';
import TitleBar from "./components/TitleBar";
import { useAtom } from "jotai";
import { contentJotai, filePathJotai, savedJotai } from "./jotais/file";
import { aboutJotai, loadingJotai, preferenceJotai, toolbarJotai, vibrancyJotai } from "./jotais/ui";
import classNames from "classnames";
import { Spinner } from "@fluentui/react-components";
import { useEffect, useLayoutEffect, useRef } from "react";
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';
import useIsDarkMode from "./hooks/dark";
import Preferences from "./components/Preferences";
import { writeTextFile, readTextFile } from '@tauri-apps/api/fs';
import { settingsJotai } from "./jotais/settings";
import { useKeyPress, useInterval, useEventListener, useAsyncEffect } from "ahooks";
import { version as getVersion, type as getType } from '@tauri-apps/api/os';
import About from "./components/About";
import { save as saveFilePicker } from '@tauri-apps/api/dialog';
import { documentDir } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/tauri';
import FloatingToolbar from "./components/FloatingToolbar";
import { Editor } from "@milkdown/core";
import { IntlProvider } from 'react-intl';
import localeData from '../locale';

const availbleExts = [{
    name: 'Markdown',
    extensions: ['md']
}, {
    name: 'Text file',
    extensions: ['txt']
}];

function App () {
    const [content, setContent] = useAtom(contentJotai);
    const [filePath, setFilePath] = useAtom(filePathJotai);
    const [loading] = useAtom(loadingJotai);
    const [, setToolbar] = useAtom(toolbarJotai);
    const [saved, setSaved] = useAtom(savedJotai);
    const [settings] = useAtom(settingsJotai);
    const [preference, setPreference] = useAtom(preferenceJotai);
    const [, setVibrancy] = useAtom(vibrancyJotai);
    const [about, setAbout] = useAtom(aboutJotai);
    const isDarkMode = useIsDarkMode();
    const editorInstance = useRef<Editor>(null);

    // Initialize
    useAsyncEffect(async () => {
        const type = await getType();
        if (type === 'Linux') return;

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
            /*
             * FluentUI doesn't work on macOS 11.3 - (Safari 14.1 -)
             * For vibrancy feature(macOS 10.14 +), there's no need to detect version.
             */
            setVibrancy({
                arcylic: false,
                mica: false,
                vibrancy: true
            });
        }

        const args: string[] = await invoke('get_args');
        if (args.length > 1) setFilePath(args[1]);
    }, []);

    // Auto save
    useInterval(async () => {
        if (filePath === null || saved) return;
        await writeTextFile({ path: filePath, contents: content });
        setSaved(true);

    }, settings.autoSave ? settings.saveInterval * 1000 : -1);

    // Save when editor blurred
    useEventListener('blur', async () => {
        if (!settings.saveBlur || filePath === null || saved) return;
        await writeTextFile({ path: filePath, contents: content });
        setSaved(true);
    });

    // Shortcuts
    useKeyPress('ctrl.s', async () => {
        let selected = filePath ?? '';
        if (!selected) {
            const _selected = await saveFilePicker({
                defaultPath: await documentDir(),
                filters: availbleExts
            });
            if (_selected === null) return;
            selected = _selected;
            setFilePath(selected as string);
        }
        await writeTextFile({ path: selected, contents: content });
        setSaved(true);
    });
    useKeyPress('ctrl.f', (e) => {
        e.preventDefault();
        setToolbar('find');
    });
    useKeyPress('f5, f7', (e) => {
        e.preventDefault();
    });
    useKeyPress('ctrl.h', () => {
        setToolbar('replace');
    });

    useKeyPress('ctrl.alt.d', () => {
        alert(`filePath: ${filePath}\nsettings: ${JSON.stringify(settings)}\ncontent: ${content}`);
    });

    useEffect(() => {
        invoke(`apply_${settings.vibrancy}`);
    }, [settings.vibrancy]);

    // Read text file from path if filePath changed
    useLayoutEffect(() => {
        if (filePath !== null) {
            readTextFile(filePath).then((text) => {
                setContent(text as string);
                setSaved(true);
            }).catch(e => {
                alert(`Cannot open file: ${e.message}`);
            });
        }
    }, [filePath]);

    return (
        <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme} className='provider'>
            <IntlProvider defaultLocale='en' locale={settings.language} messages={localeData[settings.language].message}>
                <div className={classNames(styles.container, {
                    [styles.window]: !settings.vibrancy || settings.vibrancy === 'none'
                })}>
                    <TitleBar editorInstance={editorInstance} />
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
            </IntlProvider>
        </FluentProvider>
    );
}

export default App;
