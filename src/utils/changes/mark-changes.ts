import { diffLines, diffWordsWithSpace } from "diff";
import { MARK_CLOSE, MARK_DEL, MARK_INS } from "@/lib/change-marks";

const FENCE = /^\s*(```|~~~)/;
// no text to mark: an empty line, a table delimiter row, a thematic break, a setext underline
const NO_TEXT = /^[\s|:=*_-]*$/;
const TABLE_ROW = /^(\s*\|\s*)(.*?)(\s*\|?\s*)$/;
// the block syntax at the start of a line (quote, list item, task box, heading) stays out of a mark
const TEXT_LINE = /^(\s*(?:(?:>|[-*+]|\d{1,9}[.)])\s+(?:\[[ xX]\]\s+)?|#{1,6}\s+)*)(.*?)(\s*)$/;
// a mark between these characters, or in a link address, can break the syntax of the line
const SYNTAX = /[*_`[\]<>|~\\]/;
const LINK = /\]\(|\]:|:\/\//;

function toLines(text: string) {
  return text.replace(/\n$/, "").split("\n");
}

function markLine(line: string, mark: string, isCode: boolean) {
  if (isCode) return line.trim() ? mark + line + MARK_CLOSE : line;
  if (FENCE.test(line) || NO_TEXT.test(line)) return line;
  const [, start, text, end] = line.match(/^\s*\|/.test(line) ? TABLE_ROW : TEXT_LINE)!;
  return text ? start + mark + text + MARK_CLOSE + end : line;
}

// one line with the changed words marked, or undefined when marks on the full lines are safer
function mergeLines(oldLine: string, newLine: string) {
  if ([oldLine, newLine].some((line) => FENCE.test(line) || NO_TEXT.test(line))) return undefined;
  const oldText = oldLine.match(TEXT_LINE)![2];
  const [, start, newText, end] = newLine.match(TEXT_LINE)!;
  if (LINK.test(oldText + newText)) return undefined;

  const parts = diffWordsWithSpace(oldText, newText);
  let sameLength = 0;
  for (const part of parts) {
    if (!part.added && !part.removed) sameLength += part.value.length;
    else if (SYNTAX.test(part.value)) return undefined;
  }
  // ponytail: below 50% same text, the words are a mix that is hard to read
  if (sameLength * 2 < Math.max(oldText.length, newText.length)) return undefined;

  const text = parts
    .map(({ added, removed, value }) =>
      added || removed ? (added ? MARK_INS : MARK_DEL) + value + MARK_CLOSE : value,
    )
    .join("");
  return start + text + end;
}

// The current Markdown, with the changes from the previous version marked. Removed text stays in.
export function markChanges(previous: string, current: string) {
  const marks = new RegExp(`[${MARK_INS}${MARK_DEL}${MARK_CLOSE}]`, "g");
  const parts = diffLines(previous.replace(marks, ""), current.replace(marks, ""));
  const lines: string[] = [];
  let isCode = false;
  const push = (line: string, mark?: string) => {
    lines.push(mark ? markLine(line, mark, isCode) : line);
    if (FENCE.test(line)) isCode = !isCode;
  };

  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];
    const next = parts[index + 1];
    const partLines = toLines(part.value);

    // removed lines, then added lines: try to mark only the changed words, line by line
    if (part.removed && next?.added && !isCode) {
      const nextLines = toLines(next.value);
      const count = Math.min(partLines.length, nextLines.length);
      const merged = partLines
        .slice(0, count)
        .map((line, lineIndex) => mergeLines(line, nextLines[lineIndex]));
      if (merged.every((line) => line !== undefined)) {
        merged.forEach((line) => push(line));
        partLines.slice(count).forEach((line) => push(line, MARK_DEL));
        nextLines.slice(count).forEach((line) => push(line, MARK_INS));
        index++;
        continue;
      }
    }

    const mark = part.added ? MARK_INS : part.removed ? MARK_DEL : undefined;
    partLines.forEach((line) => push(line, mark));
  }
  return lines.join("\n");
}
