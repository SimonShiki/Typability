import React, { useEffect, useRef } from 'react';
import { appWindow } from '@tauri-apps/api/window';
import { confirm } from '@tauri-apps/api/dialog';
import { Button } from '@fluentui/react-components';
import styles from './title-bar.module.scss';
import { Add20Regular, ArrowDown20Regular, FullScreenMaximize20Regular } from '@fluentui/react-icons';
import FileMenu from '../FileMenu';
import EditMenu from '../EditMenu';
import { useAtom } from 'jotai';
import { aboutJotai, preferenceJotai, vibrancyJotai } from '../../jotais/ui';
import { Editor } from '@milkdown/core';
import { savedJotai, savingJotai } from '../../jotais/file';
import { useIntl } from 'react-intl';

interface TitleBar {
    editorInstance: {
        current?: Editor | null;
    };
}

const TitleBar : React.FC<TitleBar> = ({editorInstance}) => {
    const [preference] = useAtom(preferenceJotai);
    const [about] = useAtom(aboutJotai);
    const [saved] = useAtom(savedJotai);
    const [vibrancy] = useAtom(vibrancyJotai);
    const [, setSaving] = useAtom(savingJotai);
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
    if (vibrancy.vibrancy) return <></>;
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
                                
                                if (result) await setSaving(true);
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