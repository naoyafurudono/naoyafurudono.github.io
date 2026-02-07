import * as crypto from "node:crypto";
import type { Element } from "hast";
import type { Heading, Html, Link, ListItem, Paragraph, PhrasingContent, Root } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";
import { type Result, toc } from "mdast-util-toc";
import slugify from "slugify";
import type { Node, Parent } from "unist";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";
import { fetchOGP } from "./ogp";

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

export default function genTOC() {
  return (tree: Root, file: VFile) => {
    const t: Result = toc(tree, { maxDepth: 6, tight: true });

    if (!file.data) file.data = {};
    file.data.toc = t.map || undefined;
  };
}

let _counter = 0;
function uniqueID(): string {
  const id = "genID{conteur}";
  _counter += 1;
  return id;
}

// TODO テストする。
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
    .map((child) => child.value.trim());
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
export function rehypeReferredElement() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
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
        .filter((child: PhrasingContent) => child.type === "text" || child.type === "inlineCode")
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

// 段落内の単独リンクをOGPカードに変換するプラグイン
export const remarkLinkCard = () => {
  return async (tree: Root, _file: VFile) => {
    // 変換対象のノードを収集
    const replacements: { parent: Parent; index: number; url: string }[] = [];

    visit(tree, "paragraph", (node: Paragraph, index, parent) => {
      if (parent === null || index === undefined) return;

      // childrenが1つだけで、それがlinkノードの場合のみ処理
      if (node.children.length === 1 && node.children[0].type === "link") {
        const linkNode = node.children[0] as Link;
        // リンクのテキストがURLそのものか、空の場合のみカード化
        // （テキスト付きリンクは通常のリンクとして扱う）
        const linkText = linkNode.children
          .filter((c) => c.type === "text")
          .map((c) => c.value)
          .join("");

        if (linkText === linkNode.url || linkText === "") {
          replacements.push({
            parent: parent as Parent,
            index,
            url: linkNode.url,
          });
        }
      }
    });

    // 並列でOGP情報を取得
    const ogpResults = await Promise.all(
      replacements.map(async ({ url }) => {
        const ogp = await fetchOGP(url);
        return { url, ogp };
      })
    );

    // ノードを置換（後ろから処理してインデックスのずれを防ぐ）
    for (let i = replacements.length - 1; i >= 0; i--) {
      const { parent, index, url } = replacements[i];
      const { ogp } = ogpResults[i];

      if (ogp) {
        const imageHtml = ogp.image
          ? `<div class="ogp-card-image"><img src="${escapeHtml(ogp.image)}" alt="" loading="lazy" /></div>`
          : "";

        const htmlContent = `<a href="${escapeHtml(url)}" class="ogp-card" target="_blank" rel="noopener">
  ${imageHtml}
  <div class="ogp-card-content">
    <div class="ogp-card-title">${escapeHtml(ogp.title)}</div>
    <div class="ogp-card-description">${escapeHtml(ogp.description)}</div>
    <div class="ogp-card-url">${escapeHtml(url)}</div>
  </div>
</a>`;

        const htmlNode: Html = {
          type: "html",
          value: htmlContent,
        };

        parent.children.splice(index, 1, htmlNode);
      }
      // OGP取得に失敗した場合は元のリンクのまま
    }
  };
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
