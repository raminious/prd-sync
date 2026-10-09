// rare brackets: Markdown reads them as punctuation, so they do not break bold text
export const MARK_INS = "⸢";
export const MARK_DEL = "⸤";
export const MARK_CLOSE = "⸣";

// The look of new and removed text. The text colour stays, so a dark code block stays readable.
export const CHANGE_STYLES = {
  ins: "rounded-sm bg-green-500/25 text-inherit no-underline",
  del: "rounded-sm bg-red-500/25 text-inherit",
};
