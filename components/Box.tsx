import { Quote ,MessagesSquare     , BookOpen , ShieldQuestion  ,Lightbulb ,Book, Flame, CheckCircle2, Flag,ShieldAlert , Info } from 'lucide-react'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import remarkMath from 'remark-math'

const Box = ({ text, type = 'default' }) => {
    const typeMapping = {
        warning: {
            color: 'bg-destructive/40',
            icon: ShieldAlert   ,
        },
        info: {
            color: 'bg-tertiary',
            icon: Info,
        },
        definition: {
            color: 'bg-zinc-900',
            icon: Book,
        },
        theorem: {
            color: 'bg-primary/25',
            icon: CheckCircle2,
        },
        flag: {
            color: 'bg-primary/25',
            icon: Flag,
        },
        default: {
            color: 'bg-secondary',
        },
        summary: {
            color: 'bg-rose-950/60',
            icon: BookOpen ,
        },
        tip: {
            color: 'bg-teal-950',
            icon:Lightbulb ,
        },
        caution: {
            color: 'bg-orange-900/50',
            icon: Flame,
        },
        quote: {
            color: 'bg-emerald-950',
            icon: Quote ,
        },
        comment: {
            color: 'bg-indigo-950/50',
            icon: MessagesSquare   ,
        },
        question: {
            color: 'bg-cyan-950',
            icon: ShieldQuestion   ,
        },
    }

    return (
        <div className={`my-6 rounded-lg p-4 ${typeMapping[type].color} text-center`}>
            {typeMapping[type].icon && (
                <span className="mb-1 mr-2 inline-flex items-center justify-center align-middle">
                    {React.createElement(typeMapping[type].icon, { size: 16 })}
                </span>
            )}
            <ReactMarkdown
                components={{ p: React.Fragment }}
                remarkPlugins={[remarkMath]}
                // @ts-ignore
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                skipHtml={false}
            >
                {text}
            </ReactMarkdown>
        </div>
    )
}

export default Box
