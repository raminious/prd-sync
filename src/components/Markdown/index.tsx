import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
}

export function Markdown({ content }: Props) {
  return (
    <div className="prose prose-neutral max-w-none prose-code:before:content-none prose-code:after:content-none prose-table:block prose-table:overflow-x-auto">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
