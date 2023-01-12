import React from 'react';
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import { DocumentEdit16Regular } from '@fluentui/react-icons';
import { useAtom } from 'jotai';
import { editMenuJotai, toolbarJotai } from '../../jotais/ui';
import { Editor } from '@milkdown/core';
import { FormattedMessage } from 'react-intl';

interface EditMenu {
    editorInstance: {
        current?: Editor | null;
    };
}

const EditMenu: React.FC<EditMenu> = () => {
    const [, setFloatingToolbar] = useAtom(toolbarJotai);
    const [, setEditMenu] = useAtom(editMenuJotai);

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
                    <FormattedMessage
                        id='menu.edit.title'
                        defaultMessage='Edit'
                    />
                </MenuButton>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    <MenuItem onClick={() => {
                        setFloatingToolbar('find');
                    }}>
                        <FormattedMessage
                            id='menu.edit.find'
                            defaultMessage='Find'
                        />
                    </MenuItem>
                    <MenuItem onClick={() => {
                        setFloatingToolbar('replace');
                    }}>
                        <FormattedMessage
                            id='menu.edit.replace'
                            defaultMessage='Replace'
                        />
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem>
                        <FormattedMessage
                            id='menu.edit.addTable'
                            defaultMessage='Add table'
                        />
                    </MenuItem>
                    <MenuItem>
                        <FormattedMessage
                            id='menu.edit.addDiagram'
                            defaultMessage='Add diagram'
                        />
                    </MenuItem>
                    <MenuItem>
                        <FormattedMessage
                            id='menu.edit.addFormula'
                            defaultMessage='Add formula'
                        />
                    </MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};

export default EditMenu;
