import { TextSelection, Transaction } from '@milkdown/prose/state';
import { Node } from '@milkdown/prose/model';

type EndPoint = {
    from: number;
    to: number;
};

// @todo make it a milkdown plugin
export class Finder {
    tr: Transaction;
    /**
     * Finder to find string in Milkdown/ ProseMirror.
     * @param tr the transaction of the state. You can use ``getInstance().ctx.get(editorViewCtx).state.tr`` to get it.
     */
    constructor (tr: Transaction) {
        this.tr = tr;
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
        } else {
            return null;
        }
    }

    // Referenced from the https://github.com/mattberkowitz/prosemirror-find-replace implementation
    private findInNode (node: Node, findStr: string) {
        let ret: TextSelection[] = [];

        if (node.isTextblock) {
            let index = 0, foundAt;
            const ep = this.getNodeEndpoints(this.tr.doc, node);
            if (ep === null) return;
            // @todo case-sensitive support
            while ((foundAt = node.textContent.slice(index).search(new RegExp(findStr, ''))) > -1) {
                // Maybe there's more elegant way to create text selection?
                const sel = new TextSelection(this.tr.doc.resolve(ep.from + index + foundAt + 1), this.tr.doc.resolve(ep.from + index + foundAt + findStr.length + 1));
                ret.push(sel);
                index = index + foundAt + findStr.length;
            }
        } else {
            node.content.forEach((child) => ret = ret.concat(this.findInNode(child, findStr) ?? []));
        }
        return ret;
    }
}
