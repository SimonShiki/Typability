import React, { useState } from 'react';
import {
    Dialog,
    DialogSurface,
    DialogBody,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Text
} from '@fluentui/react-components';
import styles from './about.module.scss';
import icon from '../../assets/typability-icon.svg';
import { useAsyncEffect } from 'ahooks';
import { getVersion, getTauriVersion } from '@tauri-apps/api/app';

interface AboutProps {
    open: boolean;
    onClose?: () => void;
}

const About: React.FC<AboutProps> = ({
    open,
    onClose
}) => {
    const [version, setVersion] = useState<string | null>(null);
    const [tauriVersion, setTauriVersion] = useState<string | null>(null);
    useAsyncEffect(async () => {
        setVersion(await getVersion());
        setTauriVersion(await getTauriVersion());
    }, []);
    return (
        <Dialog open={open}>
            <DialogSurface>
                <DialogBody className={styles.body}>
                    <DialogTitle>About</DialogTitle>
                    <DialogContent>
                        <div className={styles.about}>
                            <img src={icon} />
                            <div className={styles.version}>
                                <Text weight="semibold" size={400}>Typability</Text>
                                <Text>Version: {version === null ? 'Loading...' : version}</Text>
                                <Text>Tauri Version: {tauriVersion === null ? 'Loading...' : tauriVersion}</Text>
                                <Text>Thanks to SoilZhu for drawing the icon!</Text>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance='secondary' disabled>
                            Check Update
                        </Button>
                        <Button appearance="primary" onClick={() => {
                            onClose && onClose();
                        }}>Ok</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default About;
