import { atomWithStorage } from "jotai/utils";

interface Setting {
    language: 'en'; // TODO: use react-intl instead
    theme: 'nord' | 'nordDark' | 'tokyo';
    themeDark: 'nord' | 'nordDark' | 'tokyo';
    syntax: 'gfm' | 'commonmark';
    autoSave: boolean;
    saveBlur: boolean;
    saveInterval: number;
    defaultPath: string;
}

export const settingsJotai = atomWithStorage<Setting>('settings', {
    language: 'en',
    theme: 'nord',
    themeDark: 'nordDark',
    syntax: 'gfm',
    autoSave: false,
    saveBlur: false,
    saveInterval: 120,
    defaultPath: ''
});