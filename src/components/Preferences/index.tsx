import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    Input,
    Switch
} from '@fluentui/react-components';
import React from 'react';
import { Dropdown, Option } from '@fluentui/react-components/unstable';
import styles from './preferences.module.scss';
import { useAtom } from 'jotai';
import { settingsJotai } from '../../jotais/settings';

interface PerferencesProps {
    open: boolean;
    onClose?: () => void;
}

const themeMap = {
    nord: 'Nord',
    nordDark: 'Nord (Dark)',
    tokyo: 'Tokyo'
};

const languageMap = {
    en: 'English'
};

const Preferences: React.FC<PerferencesProps> = ({
    open,
    onClose
}) => {
    const [settings, setSettings] = useAtom(settingsJotai);
    function set (key: keyof typeof settings, value: unknown) {
        setSettings(Object.assign({}, settings, {
            [key]: value
        }));
    }
    return (
        <Dialog open={open}>
            <DialogSurface>
                <DialogBody className={styles.body}>
                    <DialogTitle>Preferences</DialogTitle>
                    <DialogContent>
                        <div className={styles.option}>
                            <p className={styles.description}>
                                Language
                            </p>
                            <Dropdown value={languageMap[settings.language]} onOptionSelect={(e, data) => {
                                set('language', data.optionValue);
                            }}>
                                {/*TODO: Use react-intl instead */}
                                <Option value="en">English</Option>
                            </Dropdown>
                        </div>
                        <div className={styles.option}>
                            <p className={styles.description}>
                                Light Theme
                            </p>
                            <Dropdown
                                value={themeMap[settings.theme]}
                                onOptionSelect={(e, data) => {
                                    set('theme', data.optionValue);
                                }}
                            >
                                <Option value="nord">Nord</Option>
                                <Option value="nordDark">Nord (Dark)</Option>
                                <Option value="tokyo">Tokyo</Option>
                            </Dropdown>
                        </div>
                        <div className={styles.option}>
                            <p className={styles.description}>
                                Dark Theme
                            </p>
                            <Dropdown
                                value={themeMap[settings.themeDark]}
                                onOptionSelect={(e, data) => {
                                    set('themeDark', data.optionValue);
                                }}
                            >
                                <Option value="nord">Nord</Option>
                                <Option value="nordDark">Nord (Dark)</Option>
                                <Option value="tokyo">Tokyo</Option>
                            </Dropdown>
                        </div>
                        <div className={styles.option}>
                            <p className={styles.description}>
                                Auto save
                            </p>
                            <Switch checked={settings.autoSave} onChange={(e, data) => {
                                set('autoSave', data.checked);
                            }} />
                        </div>
                        <div className={styles.option}>
                            <p className={styles.description}>
                                Save when editor blurred
                            </p>
                            <Switch checked={settings.saveBlur} onChange={(e, data) => {
                                set('saveBlur', data.checked);
                            }} />
                        </div>
                        <div className={styles.option}>
                            <p className={styles.description}>
                                Save interval (sec)
                            </p>
                            <Input
                                type='number'
                                value={String(settings.saveInterval)}
                                disabled={!settings.autoSave}
                                onChange={(e, data) => {
                                    set('saveInterval', Math.max(parseInt(data.value) || 0, 10));
                                }}
                            />
                        </div>
                        {/*
                        <div className={styles.option}>
                            <p className={styles.description}>
                                Default path
                            </p>
                            <Input />
                        </div>
                        */}
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="primary" onClick={() => {
                            onClose && onClose();
                        }}>Ok</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default Preferences;
