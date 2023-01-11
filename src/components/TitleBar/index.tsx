import React from 'react';
import { appWindow } from '@tauri-apps/api/window';
import { confirm } from '@tauri-apps/api/dialog';
import { Button } from '@fluentui/react-components';
import styles from './title-bar.module.scss';
import { Add20Regular, ArrowDown20Regular, FullScreenMaximize20Regular } from '@fluentui/react-icons';
import FileMenu from '../FileMenu';
import EditMenu from '../EditMenu';
import { useAtom } from 'jotai';
import { aboutJotai, preferenceJotai } from '../../jotais/ui';
import { Editor } from '@milkdown/core';
import { contentJotai, filePathJotai, savedJotai } from '../../jotais/file';
import { writeTextFile } from '@tauri-apps/api/fs';

interface TitleBar {
    editorInstance: {
        current?: Editor | null;
    };
}

const TitleBar : React.FC<TitleBar> = ({editorInstance}) => {
    const [preference] = useAtom(preferenceJotai);
    const [about] = useAtom(aboutJotai);
    const [content] = useAtom(contentJotai);
    const [filePath] = useAtom(filePathJotai);
    const [saved] = useAtom(savedJotai);
    return (
        <>
            <div data-tauri-drag-region className={styles.bar}>
                <div data-tauri-drag-region className={styles.title}>Typability</div>
                <div data-tauri-drag-region className={styles.operation}>
                    <FileMenu />
                    <div style={{ width: '0.5rem' }}></div>
                    <EditMenu editorInstance={editorInstance} />
                </div>
                <div className={styles.control}>
                    <Button
                        appearance="subtle"
                        icon={<ArrowDown20Regular />}
                        onClick={async () => {
                            await appWindow.minimize();
                        }}
                    />
                    <Button
                        appearance="subtle"
                        icon={<FullScreenMaximize20Regular />}
                        onClick={async () => {
                            await appWindow.toggleMaximize();
                        }}
                    />
                    <Button
                        appearance="subtle"
                        icon={<Add20Regular className={styles.close} />}
                        onClick={async () => {
                            if (!saved) {
                                const result = await confirm('Do you need to save and then exit?', {
                                    title: 'You haven\'t saved it yet',
                                    type: 'warning'
                                });
                                if (result && filePath !== null) {
                                    await writeTextFile({ path: filePath, contents: content });
                                } else return;
                            }
                            await appWindow.close();
                        }}
                    />
                </div>
            </div>
            {(preference || about) && <div data-tauri-drag-region className={styles.invisibleBar} />}
        </>
    );
};

export default TitleBar;