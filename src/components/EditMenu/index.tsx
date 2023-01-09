import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { version as getVersion, type as getType } from '@tauri-apps/api/os';
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import { DocumentEdit16Regular } from '@fluentui/react-icons';
import { useAsyncEffect } from 'ahooks';

const EditMenu: React.FC = () => {
    const [emojiAvailable, setEmojiAvailable] = useState<boolean>(false);
    useAsyncEffect(async () => {
        const type = await getType();
        if (type !== 'Windows_NT') return;
        const version = await getVersion();
        const buildNumber = parseInt(version.substring(version.lastIndexOf('.') + 1));
        if (buildNumber >= 17134) setEmojiAvailable(true);
    }, []);
    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <MenuButton
                    size="small"
                    appearance="subtle"
                    icon={<DocumentEdit16Regular />}
                >
                    Edit
                </MenuButton>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <MenuItem>Find</MenuItem>
                    <MenuItem>Replace</MenuItem>
                    <MenuItem 
                        disabled={!emojiAvailable}
                        onClick={() => {
                            if (emojiAvailable) invoke('open_emoji_panel');
                        }}
                    >Emoji & Symbols</MenuItem>
                    <MenuDivider />
                    <MenuItem>Add table</MenuItem>
                    <MenuItem>Add diagram</MenuItem>
                    <MenuItem>Add math block</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};

export default EditMenu;
