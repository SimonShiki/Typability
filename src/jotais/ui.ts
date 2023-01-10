import { atom } from "jotai";
export const loadingJotai = atom<boolean>(false);
export const preferenceJotai = atom<boolean>(false);
export const aboutJotai = atom<boolean>(false);
export const toolbarJotai = atom<boolean | 'find' | 'replace'>(false);
export const editMenuJotai = atom<boolean>(false);
