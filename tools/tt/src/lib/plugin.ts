import type { Root } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";
import type unified from "unified";
import type { Node } from "unist";
import type { VFileCompatible } from "vfile";

export const print: (depth: number) => unified.Plugin =
	(depth: number) => () => {
		return (tree: Node, file: VFileCompatible) => {
			console.log(JSON.stringify(tree, null, depth));
		};
	};

export const ignoreNewLine = () => {
	return (tree: Root, file: VFileCompatible) => {
		findAndReplace(tree, [/\n/gi, ""]);
	};
};
