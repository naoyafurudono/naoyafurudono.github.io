import * as crypto from "node:crypto";
import type { Element } from "hast";
import type { Heading, ListItem, PhrasingContent, Root } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";
import slugify from "slugify";
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

		// file.data.unchecked = unchecked;
		file.data = { unchecked: unchecked, ...file.data };
	};
};

let _counter = 0;
function uniqueID(): string {
	const id = "genID{conteur}";
	_counter += 1;
	return id;
}

// 指定した要素にコンテンツに依存したIDをつける。
// hastを入力に期待する。
export const putIDOn = (className: string) => {
	const target = className;
	return () => {
		return (tree: Root, _f: VFile) => {
			visit(tree, "element", (node: Element) => {
				if (Array.isArray(node?.properties?.className)) {
					if (node.properties.className.includes(target)) {
						const contents = node.children
							.filter((child) => child.type === "text")
							.map((child) => child.value);
						const hash = hashContent(contents.at(0) || uniqueID());
						const linkSVG = createLinkSVG(hash);
						node.children.unshift(linkSVG);
					}
				}
			});
		};
	};
};

export const putIDOnTODOItem = () => {
	return (tree: Root, _f: VFile) => {
		const target = "task-list-item";
		visit(tree, "element", (node: Element) => {
			if (Array.isArray(node?.properties?.className)) {
				if (node.properties.className.includes(target)) {
					const hash = todoTitle(node) || uniqueID();

					const linkSVG = createLinkSVG(hash);
					node.children.unshift(linkSVG);
				}
			}
		});
	};
};

function todoTitle(todoItemNode: Element): string | undefined {
	const contents = todoItemNode.children
		.filter((child) => child.type === "text")
		.map((child) => child.value);
	return contents.at(0);
}

export function hashContent(content: string): string {
	const h = crypto.createHash("sha256").update(content).digest();
	return h.toString("base64url");
}

// SVG リンクアイコンを生成する関数
function createLinkSVG(id: string): Element {
	return {
		type: "element",
		tagName: "svg",
		properties: {
			id,
			viewBox: "0 0 24 24",
			width: "16",
			height: "16",
			xmlns: "http://www.w3.org/2000/svg",
		},
		children: [
			{
				type: "element",
				tagName: "path",
				properties: {
					d: "m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z",
				},
				children: [],
			},
		],
	};
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

// 見出しのidを追加するプラグイン
export const addHeadingIds = () => {
	return (tree: Node) => {
		visit(tree, "heading", (node: Heading) => {
			// 見出しのテキストを取得
			const text = node.children
				.filter(
					(child: PhrasingContent) =>
						child.type === "text" || child.type === "inlineCode",
				)
				.map((child) => child.value)
				.join(" ");

			const id = slugify(text, {
				lower: true,
				strict: false,
				remove: /[^\p{L}\p{N}\s]/gu, // Unicodeの文字や数字以外を取り除く（日本語対応）
			});

			if (!node.data) node.data = {};
			if (!node.data.hProperties) node.data.hProperties = {};
			node.data.hProperties.id = id;
		});
	};
};

// import type { Plugin } from "unified";

// export type AboutSections = {
// 	[key: string]: Node[];
// };

// export const extractAboutSections: Plugin<[], Root> = () => {
// 	return (tree, file) => {
// 		const sections: AboutSections = {};
// 		let currentSectionName: string | null = null;
// 		let currentSectionDepth: number | null = null;

// 		visit(tree, (node) => {
// 			// about: で始まる heading を見つけたら、セクションを開始
// 			if (
// 				node.type === "heading" &&
// 				node.children[0].type === "text" &&
// 				node.children[0].value.startsWith("about: ")
// 			) {
// 				currentSectionName = node.children[0].value.slice(6).trim();
// 				currentSectionDepth = node.depth; // depth を保持
// 				sections[currentSectionName] = [];
// 			} else if (currentSectionName && node.type === "heading") {
// 				// 同じ depth の heading が出現したら、セクションの終了
// 				if (node.depth === currentSectionDepth) {
// 					currentSectionName = null;
// 					currentSectionDepth = null;
// 				}
// 			} else if (currentSectionName) {
// 				// 現在のセクションにノードを追加（入れ子も含む）
// 				sections[currentSectionName].push(node);
// 			}
// 		});

// 		// 結果を file.data に保存
// 		file.data.about = sections;
// 	};
// };
