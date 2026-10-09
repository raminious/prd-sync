import type { ElementContent, Root, RootContent } from "hast";
import { CHANGE_STYLES, MARK_CLOSE, MARK_DEL, MARK_INS } from "@/lib/change-marks";

type Tag = "ins" | "del" | undefined;

const TAGS: Record<string, Tag> = { [MARK_INS]: "ins", [MARK_DEL]: "del", [MARK_CLOSE]: undefined };
const MARKS = new RegExp(`([${MARK_INS}${MARK_DEL}${MARK_CLOSE}])`);

// A rehype plugin. It changes the marks from markChanges into <ins> and <del> elements.
export function rehypeChangeMarks() {
  return (tree: Root) => {
    // a mark can open in one text node and close in a later one, for example around bold text
    let tag: Tag;
    const mark = (nodes: RootContent[]): RootContent[] =>
      nodes.flatMap((node) => {
        if (node.type === "element") node.children = mark(node.children) as ElementContent[];
        if (node.type !== "text") return [node];
        return node.value.split(MARKS).flatMap((value): RootContent[] => {
          if (value in TAGS) {
            tag = TAGS[value];
            return [];
          }
          if (!value) return [];
          const text = { type: "text" as const, value };
          if (!tag || !value.trim()) return [text];
          const properties = { className: CHANGE_STYLES[tag].split(" ") };
          return [{ type: "element", tagName: tag, properties, children: [text] }];
        });
      });
    tree.children = mark(tree.children);
  };
}
