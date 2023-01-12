import React from 'react';
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import { Folder16Regular } from '@fluentui/react-icons';
import { useAtom } from 'jotai';
import  { open as openFilePicker, save as saveFilePicker } from '@tauri-apps/api/dialog';
import { documentDir } from '@tauri-apps/api/path';
import { contentJotai, filePathJotai, savedJotai } from '../../jotais/file';
import { writeTextFile } from '@tauri-apps/api/fs';
import { aboutJotai, preferenceJotai } from '../../jotais/ui';
import { FormattedMessage } from 'react-intl';
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
    const [, setContent] = useAtom(contentJotai);
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
                    <FormattedMessage
                        id='menu.file.title'
                        defaultMessage='File'
                    />
                </MenuButton>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <MenuItem onClick={async () => {
                        setFilePath(null);
                        setContent('');
                    }}>
                        <FormattedMessage
                            id='menu.file.new'
                            defaultMessage='New'
                        />
                    </MenuItem>
                    <MenuItem onClick={async () => {
                        const selected = await openFilePicker({
                            defaultPath: await documentDir(),
                            filters: availbleExts
                        });
                        if (selected === null) return;
                        setFilePath(selected as string);

                    }}>
                        <FormattedMessage
                            id='menu.file.open'
                            defaultMessage='Open'
                        />
                    </MenuItem>
                    <MenuItem disabled={filePath === null} onClick={async () => {
                        if (filePath === null) return;

                        await writeTextFile({ path: filePath, contents: content });
                    }}>
                        <FormattedMessage
                            id='menu.file.save'
                            defaultMessage='Save'
                        />
                    </MenuItem>
                    <MenuItem onClick={async () => {
                        const selected = await saveFilePicker({
                            defaultPath: await documentDir(),
                            filters: availbleExts
                        });
                        if (selected === null) return;

                        await writeTextFile({ path: selected as string, contents: content });
                        setSaved(true);

                        setFilePath(selected as string);
                    }}>
                        <FormattedMessage
                            id='menu.file.saveAs'
                            defaultMessage='Save as'
                        />
                    </MenuItem>
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
                    }}>
                        <FormattedMessage
                            id='menu.file.export'
                            defaultMessage='Export'
                        />
                    </MenuItem>
                    <MenuItem onClick={() => {
                        setPreference(true);
                    }}>
                        <FormattedMessage
                            id='menu.file.preference'
                            defaultMessage='Preference'
                        />
                    </MenuItem>
                    <MenuItem onClick={() => {
                        setAbout(true);
                    }}>
                        <FormattedMessage
                            id='menu.file.about'
                            defaultMessage='About'
                        />
                    </MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};

export default FileMenu;
