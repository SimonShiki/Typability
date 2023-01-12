import { TextSelection, Transaction } from '@milkdown/prose/state';
import { Node } from '@milkdown/prose/model';

type EndPoint = {
    from: number;
    to: number;
};

function makeSafeRegExpStr (str: string) {
    const modifiedStr = str.split('');
    const indices = [...str.matchAll(/[|\\{}()[\]^$+*?.]/g)].map(a => a.index);
    if (!indices) return str;
    for (const index of indices as number[]) {
        modifiedStr[index] = `\\${modifiedStr[index]}`;
    }
    return modifiedStr.join('');
}

// @todo make it a milkdown plugin
export class Finder {
    tr: Transaction;
    caseSensitive: boolean;
    /**
     * Finder to find string in Milkdown/ ProseMirror.
     * @param tr the transaction of the state. You can use ``getInstance().ctx.get(editorViewCtx).state.tr`` to get it.
     */
    constructor (tr: Transaction, caseSensitive: boolean) {
        this.tr = tr;
        this.caseSensitive = caseSensitive;
    }

    /**
     * Find a string in transaction's doc.
     * @param findStr the string need to be found
     * @returns ``TextSelection[] | undefined`` All matched text selections
     */
    find (findStr: string) {
        const { doc } = this.tr;
        const range = this.findInNode(doc, findStr);
        return range;
    }

    // Referenced from the https://github.com/mattberkowitz/prosemirror-find-replace implementation
    private getNodeEndpoints (context: Node, node: Node): EndPoint | null {
        let offset = 0;

        if (context === node) {
            return {
                from: offset,
                to: offset + node.nodeSize
            };
        }

        if (node.isBlock) {
            for (let i = 0; i < context.content.childCount; i++) {
                // Use method that exists in type declaration to get node endpoints to avoid issues
                const result = this.getNodeEndpoints(context.content.child(i), node);
                if (result) return {
                    // There's a offset in original code snippet, but there isn't exist in type declaration.
                    from: result.from + offset/* + (context.type.kind === null ? 0 : 1)*/,
                    to: result.to + offset/* + (context.type.kind === null ? 0 : 1)*/
                };
                offset += context.content.child(i).nodeSize;
            }
            return null;
        } 
        return null;
        
    }

    // Referenced from the https://github.com/mattberkowitz/prosemirror-find-replace implementation
    private findInNode (node: Node, findStr: string) {
        let ret: TextSelection[] = [];

        if (node.isTextblock) {
            let index = 0, foundAt;
            const ep = this.getNodeEndpoints(this.tr.doc, node);
            if (ep === null) return;
            while ((foundAt = node.textContent.slice(index).search(new RegExp(makeSafeRegExpStr(findStr), this.caseSensitive ? '' : 'i'))) > -1) {
                const sel = TextSelection.create(this.tr.doc, ep.from + index + foundAt + 1, ep.from + index + foundAt + findStr.length + 1);
                ret.push(sel);
                index = index + foundAt + findStr.length;
            }
        } else {
            node.content.forEach((child) => ret = ret.concat(this.findInNode(child, findStr) ?? []));
        }
        return ret;
    }
}
