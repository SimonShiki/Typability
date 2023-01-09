import MilkdownEditor from "./components/MilkdownEditor";
import styles from './App.module.scss';
import TitleBar from "./components/TitleBar";
import { useAtom } from "jotai";
import { contentJotai, filePathJotai } from "./jotais/file";
import { aboutJotai, loadingJotai, preferenceJotai } from "./jotais/ui";
import classNames from "classnames";
import { Spinner } from "@fluentui/react-components";
import { useLayoutEffect } from "react";
import { readTextFile } from '@tauri-apps/api/fs';
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';
import useIsDarkMode from "./hooks/dark";
import Preferences from "./components/Preferences";
import { writeTextFile } from '@tauri-apps/api/fs';
import { settingsJotai } from "./jotais/settings";
import { useKeyPress, useInterval, useEventListener } from "ahooks";
import About from "./components/About";

function App() {
    const [content, setContent] = useAtom(contentJotai);
    const [filePath] = useAtom(filePathJotai);
    const [loading] = useAtom(loadingJotai);
    const [settings] = useAtom(settingsJotai);
    const [preference, setPreference] = useAtom(preferenceJotai);
    const [about, setAbout] = useAtom(aboutJotai);
    const isDarkMode = useIsDarkMode();

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
            <div className={styles.container}>
                <TitleBar />
                <div className={styles.editor}>
                    <MilkdownEditor
                        useMenu={false}
                        content={content}
                        onMarkdownUpdated={(markdown) => {
                            setContent(markdown);
                        }}
                        theme={isDarkMode ? settings.themeDark : settings.theme}
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
            </div>
        </FluentProvider>
    );
}

export default App;
