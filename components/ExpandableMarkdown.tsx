import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

type Props = { text: string; accent: 'emerald' | 'slate' }

export default function ExpandableMarkdown({ text, accent }: Props) {
  const [open, setOpen] = useState(false)
  const border = accent === 'emerald' ? 'border-emerald-200' : 'border-slate-200'
  const bg     = accent === 'emerald' ? 'bg-emerald-50'   : 'bg-slate-50'
  const txt    = accent === 'emerald' ? 'text-emerald-900' : 'text-slate-800'

  const MAX_LINES = 8               // visible lines before truncation
  const shouldClip = text.split('\n').length > MAX_LINES && !open

  return (
    <div className={`rounded-lg border ${border} ${bg} p-3 text-sm ${txt}`}>
      <div className={shouldClip ? 'line-clamp-8' : ''}>
        <ReactMarkdown
          components={{
            h1: (props) => <h3 className="text-sm font-semibold mt-2 mb-1" {...props} />,
            h2: (props) => <h4 className="text-sm font-semibold mt-2 mb-1" {...props} />,
            p:  (props) => <p className="mb-2 leading-relaxed" {...props} />,
            ul: (props) => <ul className="list-disc pl-5 space-y-1" {...props} />,
            li: (props) => <li className="marker:text-slate-400" {...props} />,
          }}
        >
          {text}
        </ReactMarkdown>
      </div>

      {shouldClip && (
        <button
          onClick={() => setOpen(true)}
          className="mt-2 text-xs font-medium text-emerald-700 hover:underline"
        >
          Show full →
        </button>
      )}
      {open && (
        <button
          onClick={() => setOpen(false)}
          className="mt-2 text-xs font-medium text-emerald-700 hover:underline"
        >
          Collapse ▲
        </button>
      )}
    </div>
  )
}
