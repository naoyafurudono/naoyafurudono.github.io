import unified from "unified";
import { Node } from "unist";
import { VFileCompatible } from "vfile";
import { visit } from "unist-util-visit";
import { findAndReplace } from "mdast-util-find-and-replace";
import { Root } from "mdast";

export const print: (depth: number) => unified.Plugin =
  (depth: number) => () => {
    return (tree: Root, file: VFileCompatible) => {
      console.log(JSON.stringify(tree, null, depth));
    };
  };

export const ignoreNewLine = () => {
  return (tree: Root, file: VFileCompatible) => {
    findAndReplace(tree, [/\n/gi, ""]);
  };
};
