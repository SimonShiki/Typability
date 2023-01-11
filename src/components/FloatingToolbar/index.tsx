import React, { useState } from 'react';
import styles from './floating-toolbar.module.scss';
import { useAtom } from 'jotai';
import { toolbarJotai } from '../../jotais/ui';
import { Card, Toolbar, ToolbarButton, ToolbarToggleButton } from '@fluentui/react-components/unstable';
import { Input, Text, Tooltip } from '@fluentui/react-components';
import classNames from 'classnames';
import { Add20Regular, ArrowDown24Regular, ArrowUp24Regular, Search24Regular, TextCaseTitle24Regular, TextExpand24Regular, TextGrammarWand24Regular } from '@fluentui/react-icons';
import { useKeyPress, useUpdateEffect } from 'ahooks';
import { Editor, editorViewCtx, parserCtx } from '@milkdown/core';
import { Finder } from '../../utils/findAndReplace';
import { contentJotai } from '../../jotais/file';
import { Selection, TextSelection } from '@milkdown/prose/state';
import { Slice } from '@milkdown/prose/model';

interface FloatingToolbar {
    editorInstance: {
        current?: Editor | null;
    };
}

const FloatingToolbar: React.FC<FloatingToolbar> = ({
    editorInstance
}) => {
    const [status, setStatus] = useAtom(toolbarJotai);
    const [content] = useAtom(contentJotai);
    const [find, setFind] = useState('');
    const [replace, setReplace] = useState('');
    const [cs, setCs] = useState(false);
    const [result, setResult] = useState<Selection[]>([]); // matched selections
    const [pos, setPos] = useState(0); // position of result
    const handleSearch = (originalPos?: number) => {
        if (!editorInstance.current) return;
        if (find.length === 0) {
            setResult([]);
            return;
        }

        const editorView = editorInstance.current.ctx.get(editorViewCtx);
        const editorState = editorView.state;
        const transaction = editorState.tr;
        // Wrapping a Finder into a class
        const finder = new Finder(transaction, cs);
        const matched = finder.find(find);
        if (matched?.length != 0) {
            setResult(matched as TextSelection[]);
            setPos(originalPos ? Math.min(pos, (matched as TextSelection[]).length) : 1);
        } else {
            setResult([]);
        }
    };
    const selectByPos = (scroll = true) => {
        if (!editorInstance.current) return;
        if (result.length === 0) return;
        const editorView = editorInstance.current.ctx.get(editorViewCtx);
        const transaction = editorView.state.tr;
        const selection = result[pos - 1];
        const currentTransaction = transaction.setSelection(selection);
        editorView.dispatch(scroll ? currentTransaction.scrollIntoView() : currentTransaction);
    };
    const handleReplace = () => {
        if (!editorInstance.current || result.length === 0) return;

        const editorView = editorInstance.current.ctx.get(editorViewCtx);
        const parser = editorInstance.current.ctx.get(parserCtx);
        const editorState = editorView.state;
        const transaction = editorState.tr;


        if (!transaction.selection) selectByPos(false);

        const contentSlice = editorState.selection.content();
        const parsedReplace = parser(replace); // Parsed text as node in order to replace.
        if (!parsedReplace) return;

        // Dispatch events to editor view, then editor updated.
        editorView.dispatch(
            transaction.replaceSelection(
                new Slice(
                    parsedReplace.content,
                    contentSlice.openStart, 
                    contentSlice.openEnd
                )
            ).scrollIntoView()
        );

        // Update result rather than slice it, it will break ProseMirror's internal logic.
        // ...or slice it?
        handleSearch(pos);
    };

    /*
    const handleReplaceAll = () => {
        if (!editorInstance.current || result.length === 0) return;

        const editorView = editorInstance.current.ctx.get(editorViewCtx);
        const parser = editorInstance.current.ctx.get(parserCtx);
        const editorState = editorView.state;
        const transaction = editorState.tr;
        for (const selection of result) {
            editorView.dispatch(transaction.setSelection(selection));
            const contentSlice = editorState.selection.content();
            console.log(contentSlice);
            const parsedReplace = parser(replace); // Parsed text as node in order to replace.
            if (!parsedReplace) continue;
            editorView.dispatch(transaction.replaceSelection(
                new Slice(
                    parsedReplace.content,
                    contentSlice.openStart,
                    contentSlice.openEnd
                )
            ));
        }
        // Result is empty
        setResult([]);
    };
    */

    useKeyPress('esc', () => {
        if (status) setStatus(false);
    });
    useUpdateEffect(() => {
        selectByPos();
    }, [pos, result]);
    useUpdateEffect(() => {
        if (status && find !== '' && result.length !== 0) {
            handleSearch();
        }
    }, [content]);

    if (!status) return <></>;
    return (
        <div className={styles.wrapper}>
            <Card
                appearance="filled-alternative"
                className={classNames(styles.card, {
                    [styles.replace]: status === 'replace'
                })}
            >
                <Toolbar>
                    <div className={styles.input}>
                        <Input
                            placeholder="Find..."
                            value={find}
                            onChange={(e, data) => {
                                setFind(data.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                        />
                        {status === 'replace' && (
                            <Input
                                placeholder="Replace..."
                                value={replace}
                                onChange={(e, data) => {
                                    setReplace(data.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleReplace();
                                }}
                            />)}
                    </div>
                    <div className={styles.buttons}>
                        <Tooltip
                            content="Search"
                            showDelay={650}
                            relationship="label"
                        >
                            <ToolbarButton
                                icon={<Search24Regular />}
                                onClick={() => {
                                    handleSearch();
                                }}
                            />
                        </Tooltip>
                        <Tooltip
                            content="Previous"
                            showDelay={650}
                            relationship="label"
                        >
                            <ToolbarButton
                                icon={<ArrowUp24Regular />}
                                disabled={result.length === 0}
                                onClick={() => {
                                    if (pos !== 0) setPos(Math.max(pos - 1, 1));
                                }}
                            />
                        </Tooltip>
                        <Tooltip
                            content="Next"
                            showDelay={650}
                            relationship="label"
                        >
                            <ToolbarButton
                                icon={<ArrowDown24Regular />}
                                disabled={result.length === 0}
                                onClick={() => {
                                    if (pos !== 0) setPos(Math.min(pos + 1, result.length));
                                }}
                            />
                        </Tooltip>
                        <Tooltip
                            content="Close"
                            showDelay={650}
                            relationship="label"
                        >
                            <ToolbarButton
                                icon={<Add20Regular className={styles.close} />}
                                onClick={() => {
                                    setStatus(false);
                                }}
                            />
                        </Tooltip>
                        <Tooltip
                            content="Case-Sensitive"
                            showDelay={650}
                            relationship="label"
                        >
                            <ToolbarToggleButton
                                appearance="subtle"
                                as="button"
                                defaultChecked={cs}
                                className={styles.cs}
                                onClick={() => {
                                    setCs(!cs);
                                }}
                                name="case-sensitive"
                                value="case-sensitive"
                                icon={<TextCaseTitle24Regular />}
                            />
                        </Tooltip>
                        {status === 'replace' && (
                            <>
                                <Tooltip
                                    content="Replace"
                                    showDelay={650}
                                    relationship="label"
                                >
                                    <ToolbarButton
                                        icon={<TextExpand24Regular />}
                                        disabled={result.length === 0}
                                        onClick={handleReplace}
                                    />
                                </Tooltip>
                                {/*
                                // Current buggy right now (onTransform)
                                <Tooltip
                                    content="Replace All"
                                    showDelay={650}
                                    relationship="label"
                                >
                                    <ToolbarButton
                                        icon={<TextGrammarWand24Regular />}
                                        disabled={result.length === 0}
                                        onClick={handleReplaceAll}
                                    />
                                </Tooltip>
                                */}
                            </>
                        )}
                    </div>
                    <Text className={styles.found}>{result.length === 0 ? 0 : `${pos} / ${result.length}`} matches</Text>
                </Toolbar>
            </Card>
        </div>
    );
};

export default FloatingToolbar;
