import { atom } from "jotai";
export const loadingJotai = atom<boolean>(false);
export const preferenceJotai = atom<boolean>(false);
export const aboutJotai = atom<boolean>(false);
export const toolbarJotai = atom<boolean | 'find' | 'replace'>(false);
export const editMenuJotai = atom<boolean>(false);

const defaultVibrancyConfig = {
    arcylic: false, // Also supports emoji panel
    mica: false,
    vibrancy: false
};

interface VibrancyConfig {
    arcylic: boolean;
    mica: boolean;
    vibrancy: boolean;
}

export const vibrancyJotai = atom<VibrancyConfig>(defaultVibrancyConfig);
