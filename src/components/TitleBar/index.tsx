import React, { useEffect, useRef } from 'react';
import { appWindow } from '@tauri-apps/api/window';
import { confirm } from '@tauri-apps/api/dialog';
import { Button } from '@fluentui/react-components';
import styles from './title-bar.module.scss';
import { Add20Regular, ArrowDown20Regular, FullScreenMaximize20Regular } from '@fluentui/react-icons';
import FileMenu from '../FileMenu';
import EditMenu from '../EditMenu';
import {  save as saveFilePicker } from '@tauri-apps/api/dialog';
import { documentDir } from '@tauri-apps/api/path';
import { useAtom } from 'jotai';
import { aboutJotai, preferenceJotai } from '../../jotais/ui';
import { Editor } from '@milkdown/core';
import { contentJotai, filePathJotai, savedJotai } from '../../jotais/file';
import { writeTextFile } from '@tauri-apps/api/fs';
import { useIntl } from 'react-intl';

interface TitleBar {
    editorInstance: {
        current?: Editor | null;
    };
}

const availbleExts = [{
    name: 'Markdown',
    extensions: ['md']
}, {
    name: 'Text file',
    extensions: ['txt']
}];

const TitleBar : React.FC<TitleBar> = ({editorInstance}) => {
    const [preference] = useAtom(preferenceJotai);
    const [about] = useAtom(aboutJotai);
    const [content] = useAtom(contentJotai);
    const [filePath, setFilePath] = useAtom(filePathJotai);
    const [saved] = useAtom(savedJotai);
    const titleBarRef = useRef<HTMLDivElement>(null);
    const intl = useIntl();
    const disableMenu = (e: MouseEvent) => {
        e.preventDefault();
    };
    useEffect(() => {
        if (!titleBarRef.current) return;
        titleBarRef.current.addEventListener('contextmenu', disableMenu);
        return () => {
            if (!titleBarRef.current) return;
            titleBarRef.current.removeEventListener('contextmenu', disableMenu);
        };
    }, []);
    return (
        <>
            <div data-tauri-drag-region className={styles.bar} ref={titleBarRef} >
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
                                const result = await confirm(intl.formatMessage({
                                    id: 'closeDialog.title',
                                    defaultMessage: 'Do you need to save and then exit?'
                                }), {
                                    title: intl.formatMessage({
                                        id: 'closeDialog.content',
                                        defaultMessage: 'You haven\'t saved it yet'
                                    }),
                                    type: 'warning'
                                });
                                
                                if (result) {
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
                                };
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