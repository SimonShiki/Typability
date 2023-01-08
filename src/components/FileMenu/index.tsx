import React from 'react';
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import { Folder16Regular } from '@fluentui/react-icons';
import { useAtom } from 'jotai';
import  { open as openFilePicker, save as saveFilePicker } from '@tauri-apps/api/dialog';
import { documentDir } from '@tauri-apps/api/path';
import { contentJotai, filePathJotai } from '../../jotais/file';
import { writeTextFile } from '@tauri-apps/api/fs';

const availbleExts = [{
    name: 'Markdown',
    extensions: ['md']
}, {
    name: 'Text file',
    extensions: ['txt']
}];

const FileMenu: React.FC = () => {
    const [filePath, setFilePath] = useAtom(filePathJotai);
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

                        setFilePath(selected as string);
                    }}>Save As</MenuItem>
                    <MenuDivider />
                    <MenuItem>Export</MenuItem>
                    <MenuItem>Preferences</MenuItem>
                </MenuList>
            </MenuPopover>
      </Menu>
    );
};

export default FileMenu;
