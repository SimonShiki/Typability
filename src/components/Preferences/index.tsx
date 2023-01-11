import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    Input,
    Text,
    Switch
} from '@fluentui/react-components';
import React, { useState } from 'react';
import { Dropdown, Option } from '@fluentui/react-components/unstable';
import styles from './preferences.module.scss';
import { useAtom } from 'jotai';
import { settingsJotai } from '../../jotais/settings';
import { Card } from '@fluentui/react-components/unstable';
import { relaunch } from '@tauri-apps/api/process';
import { Warning16Regular } from '@fluentui/react-icons';
import { invoke } from '@tauri-apps/api/tauri';
import { vibrancyJotai } from '../../jotais/ui';

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

const syntaxMap = {
    gfm: 'GitHub Flavored Markdown',
    commonmark: 'CommonMark'
};

const vibrancyMap = {
    none: 'None',
    arcylic: 'Arcylic',
    mica: 'Mica',
    vibrancy: 'Vibrancy'
};

const Preferences: React.FC<PerferencesProps> = ({
    open,
    onClose
}) => {
    const [settings, setSettings] = useAtom(settingsJotai);
    const [vibrancy] = useAtom(vibrancyJotai);
    const [relaunchItem, setRelaunchItem] = useState<{[prop in keyof typeof settings]?: unknown}>({});
    function setSetting (key: keyof typeof settings, value: unknown) {
        setSettings(Object.assign({}, settings, {
            [key]: value
        }));
    }
    function addRelaunchItem (key: keyof typeof settings, value: unknown) {
        setRelaunchItem(Object.assign({}, relaunchItem, {
            [key]: value
        }));
    }
    function deleteRelaunchItem (key: keyof typeof settings) {
        const modifiedRelaunchItem = Object.assign({}, relaunchItem);
        delete modifiedRelaunchItem[key];
        setRelaunchItem(modifiedRelaunchItem);
    }
    async function relaunchApply () {
        setSettings(Object.assign({}, settings, relaunchItem));
        await relaunch();
    }
    return (
        <Dialog open={open}>
            <DialogSurface>
                <DialogBody className={styles.body}>
                    <DialogTitle>Preferences</DialogTitle>
                    <DialogContent className={styles.content}>
                        {Object.keys(relaunchItem).length !== 0 && (
                            <Card appearance="outline" className={styles.alert}>
                                <Warning16Regular className={styles.icon} />
                                <Text weight="semibold">You need to re-launch to apply the changes</Text>
                            </Card>
                        )}
                        <div className={styles.option}>
                            <p className={styles.description}>
                                Language
                            </p>
                            <Dropdown value={languageMap[settings.language]} onOptionSelect={(e, data) => {
                                setSetting('language', data.optionValue);
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
                                    setSetting('theme', data.optionValue);
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
                                    setSetting('themeDark', data.optionValue);
                                }}
                            >
                                <Option value="nord">Nord</Option>
                                <Option value="nordDark">Nord (Dark)</Option>
                                <Option value="tokyo">Tokyo</Option>
                            </Dropdown>
                        </div>
                        <div className={styles.option}>
                            <p className={styles.description}>
                                Syntax
                            </p>
                            <Dropdown value={syntaxMap[relaunchItem.syntax as keyof typeof syntaxMap ?? settings.syntax]} onOptionSelect={(e, data) => {
                                if (data.optionValue !== settings.syntax) addRelaunchItem('syntax', data.optionValue);
                                else deleteRelaunchItem('syntax');
                            }}>
                                <Option value="commonmark">CommonMark</Option>
                                <Option value="gfm">GitHub Flavored Markdown</Option>
                            </Dropdown>
                        </div>
                        <div className={styles.option}>
                            <p className={styles.description}>
                                Vibrancy
                            </p>
                            <Dropdown
                                value={vibrancyMap[settings.vibrancy]}
                                onOptionSelect={(e, data) => {
                                    if (settings.vibrancy === 'mica') invoke('clear_mica');
                                    else if (settings.vibrancy === 'arcylic') invoke('clear_arcylic');

                                    // window-vibrancy doesn't provide clear_vibrancy right now, so we cannot hot-update it.
                                    if (data.optionValue === 'vibrancy' || (settings.vibrancy === 'vibrancy' && data.optionValue === 'none')) {
                                        addRelaunchItem('vibrancy', data.optionValue);
                                    } else setSetting('vibrancy', data.optionValue);
                                }}
                            >
                                <Option value="none">None</Option>
                                {vibrancy.arcylic && <Option value="arcylic">Arcylic</Option>}
                                {vibrancy.mica && <Option value="mica">Mica</Option>}
                                {vibrancy.vibrancy && <Option value="mica">Vibrancy</Option>}
                            </Dropdown>
                        </div>
                        <div className={styles.option}>
                            <p className={styles.description}>
                                Auto save
                            </p>
                            <Switch checked={settings.autoSave} onChange={(e, data) => {
                                setSetting('autoSave', data.checked);
                            }} />
                        </div>
                        <div className={styles.option}>
                            <p className={styles.description}>
                                Save when editor blurred
                            </p>
                            <Switch checked={settings.saveBlur} onChange={(e, data) => {
                                setSetting('saveBlur', data.checked);
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
                                    setSetting('saveInterval', Math.max(parseInt(data.value) || 0, 10));
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
                            if (Object.keys(relaunchItem).length !== 0) relaunchApply();
                            else onClose && onClose();
                        }}>{Object.keys(relaunchItem).length !== 0 ? 'Re-launch' : 'Ok'}</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default Preferences;
