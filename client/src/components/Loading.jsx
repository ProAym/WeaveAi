import React from 'react'
import { Loader2Icon, SparklesIcon } from 'lucide-react'

const Loading = () => {
  return (
    <div 
      role="status" 
      aria-label="loading" 
      className="h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 relative overflow-hidden transition-colors duration-200 font-sans"
    >
      {/* Background Ambient Mesh Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-indigo-500/10 via-red-500/15 to-amber-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      {/* Glassmorphic Loader Card */}
      <div className="relative z-10 flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xl shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all">
        
        {/* Animated Icon Ring */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-xl bg-amber-500/20 blur-md animate-pulse" />
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 via-amber-600 to-amber-500 flex items-center justify-center shadow-md shadow-amber-600/20">
            <Loader2Icon size={22} className="animate-spin text-white" />
          </div>
        </div>

        {/* Text Details */}
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            <SparklesIcon size={12} className="text-amber-500 animate-pulse" />
            <span>BuilderAI</span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium tracking-wide">
            Preparing your workspace...
          </p>
        </div>

      </div>
    </div>
  )
}

export default Loading