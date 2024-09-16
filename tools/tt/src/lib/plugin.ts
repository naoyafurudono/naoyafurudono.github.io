import type { ListItem, Root } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";
import type unified from "unified";
import type { Node } from "unist";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

export const print: (depth: number) => unified.Plugin =
	(depth: number) => () => {
		return (tree: Node, _file: VFile) => {
			console.log(JSON.stringify(tree, null, depth));
			console.log(_file.data);
		};
	};

export const ignoreNewLine = () => {
	return (tree: Root, _file: VFile) => {
		findAndReplace(tree, [/\n/gi, ""]);
	};
};

export const unchecked = () => {
	return (tree: Root, file: VFile) => {
		const unchecked: ListItem[] = [];
		visit(tree, "listItem", (node: ListItem) => {
			if (node.checked === false) {
				unchecked.push(node);
			}
		});

		file.data.unchecked = unchecked;
	};
};
