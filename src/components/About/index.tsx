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
import { FormattedMessage, useIntl } from 'react-intl';

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
    const intl = useIntl();
    useAsyncEffect(async () => {
        setVersion(await getVersion());
        setTauriVersion(await getTauriVersion());
    }, []);
    return (
        <Dialog open={open}>
            <DialogSurface>
                <DialogBody className={styles.body}>
                    <DialogTitle>
                        <FormattedMessage
                            id="about.title"
                            defaultMessage="About"
                        />
                    </DialogTitle>
                    <DialogContent>
                        <div className={styles.about}>
                            <img src={icon} />
                            <div className={styles.version}>
                                <Text weight="semibold" size={400}>Typability</Text>
                                <Text>
                                    <FormattedMessage
                                        id="about.version"
                                        defaultMessage="Version: {version}"
                                        values={{
                                            version: version === null ? intl.formatMessage({
                                                id: 'loading',
                                                defaultMessage: 'Loading...'
                                            }) : version
                                        }}
                                    />
                                </Text>
                                <Text>
                                    <FormattedMessage
                                        id="about.tauriVersion"
                                        defaultMessage="Tauri Version: {version}"
                                        values={{
                                            version: tauriVersion === null ? intl.formatMessage({
                                                id: 'loading',
                                                defaultMessage: 'Loading...'
                                            }) : tauriVersion
                                        }}
                                    />
                                </Text>
                                <Text>
                                    <FormattedMessage
                                        id="about.thanks"
                                        defaultMessage="Thanks to SoilZhu for drawing the icon!"
                                    />
                                </Text>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance='secondary' disabled>
                            <FormattedMessage
                                id="about.button.checkUpdate"
                                defaultMessage="Check Update"
                            />
                        </Button>
                        <Button appearance="primary" onClick={() => {
                            onClose && onClose();
                        }}>
                            <FormattedMessage
                                id="about.button.ok"
                                defaultMessage="Ok"
                            />
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default About;
