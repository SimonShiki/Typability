import React from 'react';
import { appWindow } from '@tauri-apps/api/window';
import { Button } from '@fluentui/react-components';
import styles from './title-bar.module.scss';
import { Add20Regular, ArrowMinimize20Regular, FullScreenMaximize20Regular } from '@fluentui/react-icons';

const TitleBar : React.FC = () => {
    return (
        <div data-tauri-drag-region className={styles.bar}>
            <div data-tauri-drag-region className={styles.title}>Typability</div>
            <div data-tauri-drag-region className={styles.operation}>
                <Button>File</Button>
                <div style={{width: '10px'}}></div>
                <Button>Edit</Button>
            </div>
            <div className={styles.control}>
                <Button
                    appearance="subtle"
                    icon={<ArrowMinimize20Regular />}
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
                        await appWindow.close();
                    }}
                />
            </div>
        </div>
    );
};

export default TitleBar;