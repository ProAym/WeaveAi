import { BotIcon, BotMessageSquareIcon, UserIcon, SparklesIcon } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import PromptInput from './PromptInput'

const ChatPanel = ({ messages = [], onSend, loading }) => {

    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, loading])

  return (
    <div className='flex flex-col h-full bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl transition-colors duration-200 font-sans'>
        {/* Messages Container */}
        <div className='flex-1 overflow-y-auto p-3.5 space-y-4 hide-scrollbar'>
            {messages.length === 0 && (
                <div className='flex flex-col items-center justify-center h-full gap-2.5 text-center p-4'>
                    <div className='p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500'>
                        <SparklesIcon size={20} className='animate-pulse' />
                    </div>
                    <div>
                        <p className='text-xs font-bold text-zinc-800 dark:text-zinc-200'>AI Assistant Ready</p>
                        <p className='text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 max-w-[200px]'>
                            Ask AI to modify your layout, add new components, or fix styling.
                        </p>
                    </div>
                </div>
            )}

            {messages.map((msg, i) => (
                <div key={i} className='animate-fade-in'>
                    <div className={`flex gap-3 items-start rounded-2xl p-3 border transition-all duration-200 ${
                        msg.role === "user" 
                            ? "bg-zinc-100/70 dark:bg-zinc-900/70 border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-md" 
                            : "bg-white/40 dark:bg-zinc-900/40 border-transparent"
                    }`}>
                        {/* Avatar */}
                        <div className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center shadow-xs ${
                            msg.role === "user" 
                                ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300/50 dark:border-zinc-700/50" 
                                : "bg-gradient-to-br from-red-600 via-amber-600 to-amber-500 text-white shadow-md shadow-amber-600/20"
                        }`}>
                            {msg.role === "user" ? (
                                <UserIcon size={14} /> 
                            ) : (
                                <BotMessageSquareIcon size={14} />
                            )}
                        </div>

                        {/* Content */}
                        <div className='flex min-w-0 flex-col flex-1'>
                            <div className='flex items-center gap-1.5 mb-1'>
                                <p className='text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider'>
                                    {msg.role === "user" ? "You" : "Builder AI"}
                                </p>
                            </div>
                            
                            <p className='text-[13px] text-zinc-800 dark:text-zinc-200 leading-relaxed tracking-wide whitespace-pre-wrap wrap-break-word'>
                                {msg.content.split("- `/").map((text, index) => (
                                    <span key={index} className='block mt-2 first:mt-0'>
                                        <span className={index === 0 ? "hidden" : ""}>- `/</span>
                                        {text}
                                    </span>
                                ))}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
                <div className='flex gap-3 items-start p-3 rounded-2xl bg-white/40 dark:bg-zinc-900/40 animate-fade-in'>
                    <div className='shrink-0 w-7 h-7 rounded-xl flex items-center justify-center bg-gradient-to-br from-red-600 via-amber-600 to-amber-500 text-white shadow-md shadow-amber-600/20'>
                        <BotIcon size={14} className="animate-spin" />
                    </div>
                    <div className='flex-1'>
                        <p className='text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider'>Builder AI</p>
                        <div className='dot-loader flex items-center gap-1'>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={bottomRef} />
        </div>

        {/* Input Footer Wrapper */}
        <div className='p-3 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-colors duration-200'>
            <PromptInput onSubmit={onSend} loading={loading} placeholder='Ask AI to modify...' autoFocus />
        </div>
    </div>
  )
}

export default ChatPanel