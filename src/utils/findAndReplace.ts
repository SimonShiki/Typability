import { Transaction } from '@milkdown/prose/state';
import { Node, Fragment } from '@milkdown/prose/model';

export interface MatchedRange {
    from: number;
    to: number;
}

export class Finder {
    tr: Transaction;
    constructor (tr: Transaction) {
        this.tr = tr;
    }

    find (findStr: string) {
        const { content } = this.tr.doc;
        console.log('matching...');
        const range = this._find(findStr, content);
        return range;
    }

    private _find (findStr: string, parentNode: Fragment, parentOffset = 0): MatchedRange[] {
        const matchedRange: MatchedRange[] = [];
        let currentOffset = parentOffset;
        for (let i = 0; i < parentNode.childCount; i++) {
            const node = parentNode.child(i);
            if (node.type.name === 'text') {
                if (node.text?.includes(findStr)) {
                    const findExp = new RegExp(findStr, 'g');
                    const matches = node.text?.matchAll(findExp);
                    for (const match of matches) {
                        if (!match.index) continue;
                        matchedRange.push({
                            from: currentOffset + match.index,
                            to: currentOffset + match.index + match[0].length
                        });
                    }
                }
            } else matchedRange.push(...this._find(findStr, node.content, currentOffset));
            // Add current level node size
            currentOffset += node.nodeSize;
        }
        return matchedRange;
    }
}
