import React from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import { DocumentEdit16Regular } from '@fluentui/react-icons';
import { useAtom } from 'jotai';
import { editMenuJotai, toolbarJotai, vibrancyJotai } from '../../jotais/ui';

const EditMenu: React.FC = () => {
    const [, setFloatingToolbar] = useAtom(toolbarJotai);
    const [, setEditMenu] = useAtom(editMenuJotai);
    const [vibrancy] = useAtom(vibrancyJotai);

    return (
        <Menu onOpenChange={(e, data) => {
            setEditMenu(data.open);
        }}>
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
                    <MenuItem onClick={() => {
                        setFloatingToolbar('find');
                    }}>Find</MenuItem>
                    <MenuItem onClick={() => {
                        setFloatingToolbar('replace');
                    }}>Replace</MenuItem>
                    <MenuItem 
                        disabled={!vibrancy.arcylic}
                        onClick={() => {
                            if (vibrancy.arcylic) invoke('open_emoji_panel');
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
