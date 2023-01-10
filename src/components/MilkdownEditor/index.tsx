import React, { forwardRef, useEffect, useLayoutEffect } from 'react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
import { nord, nordDark } from '@milkdown/theme-nord';
import { ReactEditor, useEditor } from '@milkdown/react';
import { commonmark, heading as commonmarkHeading } from '@milkdown/preset-commonmark';
import { tooltip } from '@milkdown/plugin-tooltip';
import { gfm, heading as gfmHeading } from '@milkdown/preset-gfm';
import { menu } from '@milkdown/plugin-menu';
import '@material-design-icons/font';
import { history } from '@milkdown/plugin-history';
import { replaceAll, switchTheme } from '@milkdown/utils';
import { prism } from '@milkdown/plugin-prism';
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
    ref?: React.ForwardedRef<Editor>;
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
let currentTheme = '';

const MilkdownEditor: React.FC<MilkdownEditor> = forwardRef<Editor, MilkdownEditor>(({
    content,
    useMenu = false,
    syntaxOption = 'gfm',
    theme = 'nord',
    onMarkdownUpdated,
}, ref) => {
    const { editor, loading, getInstance } = useEditor((root) => {
        currentContent = content;
        currentTheme = theme;
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
            .use(clipboard)
            .use(syntaxMap[syntaxOption]);

        if (useMenu) instance.use(menu);

        return instance;
    });

    useEffect(() => {
        if (ref) {
            if (typeof ref === 'function') ref(getInstance() ?? null);
            else ref.current = getInstance() ?? null;
        }
    });

    useLayoutEffect(() => {
        if (!loading) {
            const instance = getInstance();
            if (content !== currentContent) {
                instance?.action(replaceAll(content));
                currentContent = content;
            }
            if (theme !== currentTheme) {
                instance?.action(switchTheme(themeMap[theme]));
                currentTheme = theme;
            }
        }
    }, [content, theme, syntaxOption]);

    return <ReactEditor editor={editor} />;
});

function areEqual (prevProps: Readonly<MilkdownEditor>, nextProps: Readonly<MilkdownEditor>) {
    if (prevProps !== nextProps) {
        for (const nextProp in nextProps) {
            if (nextProps[nextProp as keyof typeof nextProps] !== prevProps[nextProp as keyof typeof prevProps]) {
                // Don't refresh if content is equal
                if (nextProp === 'content' && nextProps.content === currentContent) continue;
                // Syntax cannot be removed as a plugin, ignore it before re-create editor.
                if (nextProp === 'syntaxOption') continue;
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