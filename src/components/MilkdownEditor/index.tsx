import React, { useLayoutEffect } from 'react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
import { nord, nordDark } from '@milkdown/theme-nord';
import { ReactEditor, useEditor } from '@milkdown/react';
import { commonmark, heading as commonmarkHeading} from '@milkdown/preset-commonmark';
import { tooltip } from '@milkdown/plugin-tooltip';
import { gfm, heading as gfmHeading } from '@milkdown/preset-gfm';
import { menu } from '@milkdown/plugin-menu';
import '@material-design-icons/font';
import { history } from '@milkdown/plugin-history';
import { replaceAll, switchTheme } from '@milkdown/utils';
import { prism } from '@milkdown/plugin-prism';
import { math } from '@milkdown/plugin-math';
import { emoji } from '@milkdown/plugin-emoji';
import { clipboard } from '@milkdown/plugin-clipboard';
import { tokyo } from '@milkdown/theme-tokyo';
import { listener, listenerCtx } from '@milkdown/plugin-listener';
import 'katex/dist/katex.min.css';

interface MilkdownEditor {
    content: string;
    useMenu?: boolean;
    syntaxOption?: keyof typeof syntaxMap;
    theme?: keyof typeof themeMap;
    onMarkdownUpdated?: (markdown: string, prevMarkdown: string | null) => void;
}

const syntaxMap = {
    'gfm': gfm.configure(gfmHeading, {
        className: (attrs) => `milkdownHeading h${attrs.level}`
    }),
    'commonmark': commonmark.configure(commonmarkHeading, {
        className: (attrs) => `milkdownHeading h${attrs.level}`
    })
};

const themeMap = {
    'nord': nord,
    'nordDark': nordDark,
    'tokyo': tokyo
};

let currentContent = '';

const MilkdownEditor: React.FC<MilkdownEditor> = ({
    content,
    useMenu = false,
    syntaxOption = 'gfm',
    theme = 'nord',
    onMarkdownUpdated,

}) => {
    const { editor, loading, getInstance } = useEditor((root) => {
        currentContent = content;
        const instance = Editor.make()
            .config((ctx) => {
                ctx.set(defaultValueCtx, content);
                ctx.set(rootCtx, root);
                const listener = ctx.get(listenerCtx);
                if (onMarkdownUpdated) {
                    listener.markdownUpdated((ctx, markdown, prevMarkdown) => {
                        currentContent = markdown;
                        onMarkdownUpdated(markdown, prevMarkdown);
                    });
                }

            }).use(history)
            .use(listener)
            .use(tooltip)
            .use(themeMap[theme])
            .use(prism)
            .use(math)
            .use(emoji)
            .use(clipboard)
            .use(syntaxMap[syntaxOption]);

        if (useMenu) instance.use(menu);

        return instance;
    });
    
    useLayoutEffect(() => {
        if (!loading) {
            const instance = getInstance();
            instance?.action(replaceAll(content));
            instance?.action(switchTheme(themeMap[theme]));
        }
    }, [content, theme]);

    return <ReactEditor editor={editor} />;
};

function areEqual (prevProps: Readonly<MilkdownEditor>, nextProps: Readonly<MilkdownEditor>) {
    if (prevProps !== nextProps) {
        for (const nextProp in nextProps) {
            if (nextProps[nextProp as keyof typeof nextProps] !== prevProps[nextProp as keyof typeof prevProps]) {
                // Don't refresh if content is equal
                if (nextProp === 'content' && nextProps.content === currentContent) continue;
                // For Milkdown Editor, Function is a constant, don't update
                if (typeof nextProps[nextProp as keyof typeof nextProps] === 'function') continue;
                return false;
            }
        }
        return true;
    }
    return true;
}

export default React.memo(MilkdownEditor, areEqual);