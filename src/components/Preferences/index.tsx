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
import { FormattedMessage, useIntl } from 'react-intl';
import languageMap from '../../../locale';

interface PerferencesProps {
    open: boolean;
    onClose?: () => void;
}

// @todo multi-language
const themeMap = {
    nord: 'Nord',
    nordDark: 'Nord (Dark)',
    tokyo: 'Tokyo'
};

// @todo multi-language
const syntaxMap = {
    gfm: 'GitHub Flavored Markdown',
    commonmark: 'CommonMark'
};

const Preferences: React.FC<PerferencesProps> = ({
    open,
    onClose
}) => {
    const [settings, setSettings] = useAtom(settingsJotai);
    const [vibrancy] = useAtom(vibrancyJotai);
    const [relaunchItem, setRelaunchItem] = useState<{[prop in keyof typeof settings]?: unknown}>({});
    const intl = useIntl();
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
                    <DialogTitle>
                        <FormattedMessage
                            id="preferences.title"
                            defaultMessage="Preferences"
                        />
                    </DialogTitle>
                    <DialogContent className={styles.content}>
                        {Object.keys(relaunchItem).length !== 0 && (
                            <Card appearance="outline" className={styles.alert}>
                                <Warning16Regular className={styles.icon} />
                                <Text weight="semibold">
                                    <FormattedMessage
                                        id="preferences.relaunch"
                                        defaultMessage="You need to re-launch to apply the changes"
                                    />
                                </Text>
                            </Card>
                        )}
                        <div className={styles.option}>
                            <p className={styles.description}>
                                <FormattedMessage
                                    id="preferences.language"
                                    defaultMessage="Language"
                                />
                            </p>
                            <Dropdown value={languageMap[settings.language].name} onOptionSelect={(e, data) => {
                                setSetting('language', data.optionValue);
                            }}>
                                {Object.keys(languageMap).map((key, index) => (
                                    <Option value={key} key={index}>{languageMap[key as keyof typeof languageMap].name}</Option>
                                ))}
                            </Dropdown>
                        </div>
                        <div className={styles.option}>
                            <p className={styles.description}>
                                <FormattedMessage
                                    id="preferences.lightTheme"
                                    defaultMessage="Editor theme(light)"
                                />
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
                                <FormattedMessage
                                    id="preferences.darkTheme"
                                    defaultMessage="Editor theme(dark)"
                                />
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
                                <FormattedMessage
                                    id="preferences.syntax"
                                    defaultMessage="Markdown Syntax"
                                />
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
                                <FormattedMessage
                                    id="preferences.windowStyle"
                                    defaultMessage="Window Style"
                                />
                            </p>
                            <Dropdown
                                value={languageMap[settings.language].message[`preferences.windowStyle.${settings.vibrancy}`]}
                                onOptionSelect={(e, data) => {
                                    if (settings.vibrancy === 'mica') invoke('clear_mica');
                                    else if (settings.vibrancy === 'arcylic') invoke('clear_arcylic');

                                    // Window-vibrancy doesn't provide clear_vibrancy right now, so we cannot hot-update it.
                                    if (data.optionValue === 'vibrancy' || (settings.vibrancy === 'vibrancy' && data.optionValue === 'none')) {
                                        addRelaunchItem('vibrancy', data.optionValue);
                                    } else setSetting('vibrancy', data.optionValue);
                                }}
                            >
                                <Option value="none">
                                    {intl.formatMessage({
                                        id: 'preferences.windowStyle.none',
                                        defaultMessage: 'Default'
                                    })}
                                </Option>
                                {vibrancy.arcylic && (
                                    <Option value="arcylic">
                                        {intl.formatMessage({
                                            id: 'preferences.windowStyle.arcylic',
                                            defaultMessage: 'Arcylic'
                                        })}
                                    </Option>
                                )}
                                {vibrancy.mica && (
                                    <Option value="mica">
                                        {intl.formatMessage({
                                            id: 'preferences.windowStyle.mica',
                                            defaultMessage: 'Mica'
                                        })}
                                    </Option>
                                )}
                                {vibrancy.vibrancy && (
                                    <Option value="mica">
                                        {intl.formatMessage({
                                            id: 'preferences.windowStyle.vibrancy',
                                            defaultMessage: 'Vibrancy'
                                        })}
                                    </Option>
                                )}
                            </Dropdown>
                        </div>
                        <div className={styles.option}>
                            <p className={styles.description}>
                                <FormattedMessage
                                    id="preferences.autoSave"
                                    defaultMessage="Auto Save"
                                />
                            </p>
                            <Switch checked={settings.autoSave} onChange={(e, data) => {
                                setSetting('autoSave', data.checked);
                            }} />
                        </div>
                        <div className={styles.option}>
                            <p className={styles.description}>
                                <FormattedMessage
                                    id="preferences.saveBlur"
                                    defaultMessage="Save when editor blurred"
                                />
                            </p>
                            <Switch checked={settings.saveBlur} onChange={(e, data) => {
                                setSetting('saveBlur', data.checked);
                            }} />
                        </div>
                        <div className={styles.option}>
                            <p className={styles.description}>
                                <FormattedMessage
                                    id="preferences.saveInterval"
                                    defaultMessage="Save interval (sec)"
                                />
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
                        }}>{Object.keys(relaunchItem).length !== 0 ?
                                intl.formatMessage({
                                    id: 'preference.button.relaunch',
                                    defaultMessage: 'Re-launch'
                                }) : intl.formatMessage({
                                    id: 'preference.button.ok',
                                    defaultMessage: 'Ok'
                                })}</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default Preferences;
