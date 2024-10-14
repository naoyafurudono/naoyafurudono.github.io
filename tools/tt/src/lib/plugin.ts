import * as crypto from "node:crypto";
import type { Element } from "hast";
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

// 指定した要素にコンテンツに依存したIDをつける。
// hastを入力に期待する。
export const putIDOn = (className: string) => {
	const target = className;
	return () => {
		return (tree: Root, _f: VFile) => {
			visit(tree, "element", (node: Element) => {
				if (Array.isArray(node?.properties?.className)) {
					if (node.properties.className.includes(target)) {
						const content = node.children
							.filter((child) => child.type === "text")
							.map((child) => child.value)
							.join("");

						const hash = hashContent(content);
						node.properties.id = hash;
					}
				}
			});
		};
	};
};

export function hashContent(content: string): string {
	const h = crypto.createHash("sha256").update(content).digest();
	return h.toString("base64url");
}

// idを持つ要素のURLをクリップボードにコピーするプラグイン
export function rehypeCopyElementURL() {
	return (tree: Root) => {
		visit(tree, "element", (node: Element) => {
			// `id` 属性を持つすべての要素に対して処理を行う
			if (node.properties?.id) {
				// 現在のページURLを取得して、そのidを含むURLを生成する
				const onclick = `
          event.preventDefault();
          const url = window.location.origin + window.location.pathname + '#' + this.id;
          navigator.clipboard.writeText(url).then(_ => {
            window.location.href = url;
          })
        `;
				node.properties.onclick = onclick;
				// カーソルをポインタにする
				node.properties.style = node.properties.style || "";
				node.properties.style += "cursor: pointer;";
			}
		});
	};
}
