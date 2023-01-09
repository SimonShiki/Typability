import React from 'react';
import styles from './floating-toolbar.module.scss';
import { useAtom } from 'jotai';
import { toolbarJotai } from '../../jotais/ui';
import { Card, Toolbar, ToolbarButton } from '@fluentui/react-components/unstable';
import { Input, Text, Tooltip } from '@fluentui/react-components';
import classNames from 'classnames';
import { Add20Regular, ArrowDown24Regular, ArrowUp24Regular, Search24Regular, TextExpand24Regular, TextGrammarWand24Regular } from '@fluentui/react-icons';
import { useKeyPress } from 'ahooks';

const FloatingToolbar: React.FC = () => {
    const [status, setStatus] = useAtom(toolbarJotai);
    useKeyPress('esc', () => {
        if (status) setStatus(false);
    });
    if (!status) return <></>;
    return (
        <div className={styles.wrapper}>
            <Card className={classNames(styles.card, {
                [styles.replace]: status === 'replace'
            })}>
                <Toolbar>
                    <div className={styles.input}>
                        <Input placeholder="Find..." />
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
                            />
                        </Tooltip>
                        <Tooltip
                            content="Previous"
                            showDelay={650}
                            relationship="label"
                        >
                            <ToolbarButton
                                icon={<ArrowUp24Regular />}
                            />
                        </Tooltip>
                        <Tooltip
                            content="Next"
                            showDelay={650}
                            relationship="label"
                        >
                            <ToolbarButton
                                icon={<ArrowDown24Regular />}
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
                    <Text className={styles.found}>0 matches</Text>
                </Toolbar>
            </Card>
        </div>
    );
};

export default FloatingToolbar;
