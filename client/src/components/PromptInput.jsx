import React, { useEffect, useRef, useState } from 'react'
import { ArrowRightIcon, CloudUploadIcon, Loader2Icon, MicIcon } from 'lucide-react'

const PromptInput = ({ onSubmit, loading = false, placeholder = "Describe the website you want to build ...", large = false,
     autoFocus = false, variant = "default" }) => {

    const [value, setValue] = useState("");
    const textareaRef = useRef(null);

    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus()
        }
    }, [autoFocus])

    const handleSubmit = (e) => {
        if (e) e.preventDefault()
        const trimmed = value.trim()
        if (!trimmed || loading) return;
        onSubmit(trimmed)
        setValue("")
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit()
        }
    }

    if (variant === "glass") {
        return (
            <form onSubmit={handleSubmit} className='max-w-2xl w-full bg-white/10 dark:bg-zinc-900/40 backdrop-blur-xl rounded-xl 
            ring-1 ring-white/25 dark:ring-zinc-700/50 focus-within:ring-2 focus-within:ring-white/30 dark:focus-within:ring-indigo-500/50
            overflow-hidden mt-6 transition-colors duration-200'>

                <textarea ref={textareaRef} value={value} 
                onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown}
                placeholder={placeholder} disabled={loading}
                rows={3} className='w-full p-4 pb-2 resize-none placeholder:text-white/60 dark:placeholder:text-zinc-400
                outline-none bg-transparent text-white dark:text-zinc-100 text-base'/>

                <div className='flex items-center justify-between pb-3 px-3 gap-2'>
                    <label htmlFor="file" className='border border-white/20 dark:border-zinc-700 text-white/80 dark:text-zinc-300
                    hover:text-white hover:border-white/30 dark:hover:border-zinc-600 p-1.5 rounded-md cursor-pointer flex
                    items-center justify-center'>
                        <input type="file" id='file' hidden/>
                        <CloudUploadIcon size={18}/>
                    </label>
                    <div className='flex items-center justify-end gap-2'>
                        <button type='button' className='flex items-center justify-center p-1
                        text-white/70 dark:text-zinc-400 hover:text-white dark:hover:text-zinc-200 cursor-pointer'>
                            <MicIcon size={18}/>
                        </button>

                        <button type='submit' 
                        disabled={!value.trim() || loading}
                        className='flex items-center justify-center p-1.5
                        rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-40
                        cursor-pointer'>
                            {loading ? <Loader2Icon size={18} className='animate-spin'/> : <ArrowRightIcon size={18}/>}
                        </button>
                    </div>
                </div>
            </form>
        )
    }

    return (
        <div className={`bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/70 rounded-xl flex items-end gap-2
        focus-within:ring-1 focus-within:ring-zinc-300 dark:focus-within:ring-zinc-600 transition-colors duration-200 ${large ? "p-4" : "p-3"}`}>
          
            <textarea ref={textareaRef} 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
                onKeyDown={handleKeyDown}
                placeholder={placeholder} 
                disabled={loading}
                rows={large ? 5 : 1} 
                className={`flex-1 bg-transparent border-none outline-none resize-none text-zinc-900 dark:text-zinc-100
                placeholder:text-zinc-400 dark:placeholder:text-zinc-500 ${large ? "text-base" : "text-sm"}`} />

            <button
                onClick={() => handleSubmit()}
                disabled={!value.trim() || loading}
                className='inline-flex items-center justify-center bg-zinc-950 dark:bg-indigo-600
                text-white hover:bg-zinc-800 dark:hover:bg-indigo-500 disabled:opacity-40 cursor-pointer rounded-full shrink-0 transition-colors'
                style={{
                    width: large ? 36 : 24,
                    height: large ? 36 : 24,
                }}>
                {loading ? <Loader2Icon size={large ? 20 : 15} className='animate-spin'/> : <ArrowRightIcon size={large ? 20 : 15}/>}
            </button>
        </div>
    )
}

export default PromptInput