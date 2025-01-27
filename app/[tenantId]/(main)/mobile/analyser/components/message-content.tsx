import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MessageContentProps {
    content: string;
}

export function MessageContent({ content }: MessageContentProps) {
    return (
        <Card className="p-4 w-full">
            <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="prose prose-sm md:prose-base max-w-none w-full dark:prose-invert prose-headings:text-blue-900 dark:prose-headings:text-blue-100 prose-p:text-gray-600 dark:prose-p:text-gray-300">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            table: ({ node, ...props }) => (
                                <div className="overflow-y-auto my-4 rounded-lg border border-blue-200 dark:border-blue-900/50 shadow-sm">
                                    <table className="w-full divide-y divide-blue-200 dark:divide-blue-900/50 table-auto" {...props} />
                                </div>
                            ),
                            tr: ({ node, ...props }) => (
                                <tr className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors block md:table-row border-b md:border-b-0 last:border-b-0" {...props} />
                            ),
                            th: ({ node, ...props }) => (
                                <th className="px-4 py-2 bg-blue-50/50 dark:bg-blue-900/20 text-left text-xs font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wider block md:table-cell" {...props} />
                            ),
                            td: ({ node, ...props }) => (
                                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 block md:table-cell before:content-[attr(data-label)] before:text-xs before:font-medium before:text-blue-600 before:dark:text-blue-300 before:block md:before:hidden" {...props} />
                            ),
                            p: ({ node, ...props }) => (
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed my-3" {...props} />
                            ),
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </Card>
    );
}
