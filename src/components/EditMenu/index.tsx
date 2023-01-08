import React from 'react';
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import { DocumentEdit16Regular } from '@fluentui/react-icons';

const EditMenu: React.FC = () => {
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
                    <MenuItem>Emoji & Symbols</MenuItem>
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
