import { atomWithStorage } from "jotai/utils";
import availableLanguage from '../../locale';

interface Setting {
    language: keyof typeof availableLanguage;
    theme: 'nord' | 'nordDark' | 'tokyo';
    themeDark: 'nord' | 'nordDark' | 'tokyo';
    syntax: 'gfm' | 'commonmark';
    autoSave: boolean;
    saveBlur: boolean;
    saveInterval: number;
    defaultPath: string;
    vibrancy: 'mica' | 'arcylic' | 'none';
}

export const settingsJotai = atomWithStorage<Setting>('settings', {
    language: navigator.language.toLocaleLowerCase() as keyof typeof availableLanguage,
    theme: 'nord',
    themeDark: 'nordDark',
    syntax: 'gfm',
    autoSave: false,
    saveBlur: false,
    saveInterval: 120,
    defaultPath: '',
    vibrancy: 'none'
});