import React from 'react';
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import { Folder16Regular } from '@fluentui/react-icons';
import { useAtom } from 'jotai';
import  { open as openFilePicker, save as saveFilePicker } from '@tauri-apps/api/dialog';
import { documentDir } from '@tauri-apps/api/path';
import { contentJotai, filePathJotai, savedJotai } from '../../jotais/file';
import { writeTextFile } from '@tauri-apps/api/fs';
import { aboutJotai, preferenceJotai } from '../../jotais/ui';
import * as showdown from 'showdown';

const availbleExts = [{
    name: 'Markdown',
    extensions: ['md']
}, {
    name: 'Text file',
    extensions: ['txt']
}];

const availbleExportExts = [{
    name: 'HTML',
    extensions: ['htm']
}];

const FileMenu: React.FC = () => {
    const [filePath, setFilePath] = useAtom(filePathJotai);
    const [,setContent] = useAtom(contentJotai);
    const [, setPreference] = useAtom(preferenceJotai);
    const [, setAbout] = useAtom(aboutJotai);
    const [, setSaved] = useAtom(savedJotai);
    const [content] = useAtom(contentJotai);
    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <MenuButton
                    size="small"
                    appearance="subtle"
                    icon={<Folder16Regular />}
                >
                    File
                </MenuButton>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <MenuItem onClick={async () => {
                        setFilePath(null);
                        setContent('');
                    }}>New</MenuItem>
                    <MenuItem onClick={async () => {
                        const selected = await openFilePicker({
                            defaultPath: await documentDir(),
                            filters: availbleExts
                        });
                        if (selected === null) return;
                        setFilePath(selected as string);

                    }}>Open</MenuItem>
                    <MenuItem disabled={filePath === null} onClick={async () => {
                        if (filePath === null) return;

                        await writeTextFile({ path: filePath, contents: content });
                    }}>Save</MenuItem>
                    <MenuItem onClick={async () => {
                        const selected = await saveFilePicker({
                            defaultPath: await documentDir(),
                            filters: availbleExts
                        });
                        if (selected === null) return;

                        await writeTextFile({ path: selected as string, contents: content });
                        setSaved(true);

                        setFilePath(selected as string);
                    }}>Save As</MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={async () => {
                        const selected = await saveFilePicker({
                            defaultPath: await documentDir(),
                            filters: availbleExportExts
                        });
                        if (selected === null) return;
                        const index = selected.lastIndexOf('.');
                        if (index === -1) return;
                        const ext = selected.substring(index + 1);
                        switch (ext) {
                        case 'htm':
                            // eslint-disable-next-line no-case-declarations
                            const converter = new showdown.Converter();
                            await writeTextFile({ path: selected as string, contents: converter.makeHtml(content) });
                            break;
                        }
                    }}>Export</MenuItem>
                    <MenuItem onClick={() => {
                        setPreference(true);
                    }}>Preferences</MenuItem>
                    <MenuItem onClick={() => {
                        setAbout(true);
                    }}>About</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};

export default FileMenu;
