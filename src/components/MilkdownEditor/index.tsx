import React from 'react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { ReactEditor, useEditor } from '@milkdown/react';
import { commonmark, heading as commonmarkHeading} from '@milkdown/preset-commonmark';
import { tooltip } from '@milkdown/plugin-tooltip';
import { gfm, heading as gfmHeading } from '@milkdown/preset-gfm';
import { menu } from '@milkdown/plugin-menu';
import '@material-design-icons/font';
import { history } from '@milkdown/plugin-history';

interface MilkdownEditor {
    content: string;
    useMenu?: boolean;
    syntaxOption?: 'commonmark' | 'gfm';
}

const syntaxMap = {
    'gfm': gfm.configure(gfmHeading, {
        className: (attrs) => `milkdownHeading h${attrs.level}`
    }),
    'commonmark': commonmark.configure(commonmarkHeading, {
        className: (attrs) => `milkdownHeading h${attrs.level}`
    })
};

const MilkdownEditor: React.FC<MilkdownEditor> = ({
    content,
    useMenu = false,
    syntaxOption = 'gfm'
}) => {
    const { editor } = useEditor((root) => {
        const instance = Editor.make()
            .config((ctx) => {
                ctx.set(defaultValueCtx, content);
                ctx.set(rootCtx, root);
            }).use(history).use(tooltip).use(nord).use(syntaxMap[syntaxOption]);

        if (useMenu) instance.use(menu);

        return instance;
        });

    return <ReactEditor editor={editor}/>;
};

export default MilkdownEditor;