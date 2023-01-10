import React, { useLayoutEffect, useState } from 'react';
import styles from './floating-toolbar.module.scss';
import { useAtom } from 'jotai';
import { toolbarJotai } from '../../jotais/ui';
import { Card, Toolbar, ToolbarButton } from '@fluentui/react-components/unstable';
import { Input, Text, Tooltip } from '@fluentui/react-components';
import classNames from 'classnames';
import { Add20Regular, ArrowDown24Regular, ArrowUp24Regular, Search24Regular, TextExpand24Regular, TextGrammarWand24Regular } from '@fluentui/react-icons';
import { useKeyPress } from 'ahooks';
import { Editor, editorViewCtx } from '@milkdown/core';
import { Finder, MatchedRange } from '../../utils/findAndReplace';
import { TextSelection } from '@milkdown/prose/state';
import { EditorView } from '@milkdown/prose/view';

interface FloatingToolbar {
    editorInstance: {
        current?: Editor | null;
    };
}

interface CustomEditorView extends EditorView {
    scrollToSelection: () => void;
}

const FloatingToolbar: React.FC<FloatingToolbar> = ({
    editorInstance
}) => {
    const [status, setStatus] = useAtom(toolbarJotai);
    const [find, setFind] = useState('');
    const [result, setResult] = useState<MatchedRange[]>([]);
    const [pos, setPos] = useState(0);

    useKeyPress('esc', () => {
        if (status) setStatus(false);
    });
    useLayoutEffect(() => {
        if (!editorInstance.current) return;
        const editorView = editorInstance.current.ctx.get(editorViewCtx);
        (editorView as CustomEditorView).scrollToSelection();
        const transaction = editorView.state.tr;
        const { from, to } = result[pos - 1];
        transaction.setSelection(new TextSelection(transaction.doc.resolve(from), transaction.doc.resolve(to)));

        console.log(transaction);
    }, [pos]);

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
                        />
                        {status === 'replace' && <Input placeholder="Replace..." />}
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
                                    if (!editorInstance.current) return;
                                    if (find.length === 0) {
                                        setResult([]);
                                        return;
                                    }

                                    const editorView = editorInstance.current.ctx.get(editorViewCtx);
                                    const editorState = editorView.state;
                                    const transaction = editorState.tr;
                                    const finder = new Finder(transaction);
                                    const matched = finder.find(find);
                                    if (matched.length != 0) {
                                        setResult(matched);
                                        setPos(1);
                                    }
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
                        {status === 'replace' && (
                            <>
                                <Tooltip
                                    content="Replace"
                                    showDelay={650}
                                    relationship="label"
                                >
                                    <ToolbarButton
                                        icon={<TextExpand24Regular />}
                                    />
                                </Tooltip>
                                <Tooltip
                                    content="Replace All"
                                    showDelay={650}
                                    relationship="label"
                                >
                                    <ToolbarButton
                                        icon={<TextGrammarWand24Regular />}
                                    />
                                </Tooltip>
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
