import React from 'react'
import { 
  ArrowLeftIcon, 
  Code2Icon, 
  DownloadIcon, 
  ExternalLinkIcon, 
  EyeIcon, 
  GlobeIcon, 
  Loader2Icon, 
  LogOutIcon, 
  MoonIcon, 
  SunIcon,
  SparklesIcon
} from 'lucide-react'

const BuilderHeader = ({
    projectName,
    version,
    showCode,
    publishing,
    darkMode,
    onToggleShowCode,
    onOpenPreview,
    onPublish,
    onDownload,
    onBack,
    onLogout,
    onToggleDarkMode,
}) => {
  return (
    <header className='h-13 shrink-0 flex items-center justify-between px-4 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl z-20 transition-colors duration-200 font-sans'>
      
      {/* Left Group: Back, Logo, Project Name, Version Badge */}
      <div className='flex items-center gap-2.5'>
        <button 
          onClick={onBack} 
          aria-label="Go back" 
          className='p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 active:scale-95 transition-all duration-150 cursor-pointer'
        >
          <ArrowLeftIcon size={16} />
        </button>

          <img src="/weave_logo_mark.svg" alt="Logo" className='invert dark:invert-0 h-6' />
        

        <span className='text-sm font-bold tracking-tight truncate max-w-38 md:max-w-56 text-zinc-900 dark:text-zinc-100'>
          {projectName}
        </span>

        {version && (
          <span className='inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold'>
            <SparklesIcon size={10} />
            <span>v{version}</span>
          </span>
        )}
      </div>

      {/* Right Group: Toggle Mode, Action Buttons, Publish, Logout */}
      <div className='flex items-center gap-1.5'>
        
        {/* Toggle Code / Preview */}
        <button 
          onClick={onToggleShowCode}
          className={`inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold rounded-xl cursor-pointer transition-all duration-150 active:scale-95 ${
            showCode 
              ? "bg-zinc-900 dark:bg-zinc-800 text-white dark:text-white border-transparent" 
              : "bg-white/50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          {showCode ? (
            <>
              <EyeIcon size={13} className="text-amber-400" /> 
              <span>Preview</span>
            </>
          ) : (
            <>
              <Code2Icon size={13} className="text-indigo-400" /> 
              <span>Code</span>
            </>
          )}
        </button>

        {/* External Preview Link */}
        <button 
          onClick={onOpenPreview} 
          className='inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white text-xs font-medium rounded-xl cursor-pointer bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md transition-all duration-150 active:scale-95'
        >
          <ExternalLinkIcon size={13}/>
          <span className="hidden sm:inline">Open Preview</span>
        </button>

        {/* Export ZIP Button */}
        <button 
          onClick={onDownload}
          className='inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white text-xs font-medium rounded-xl cursor-pointer bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md transition-all duration-150 active:scale-95'
        >
          <DownloadIcon size={13} />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Dark Mode Toggle */}
        <button 
          onClick={onToggleDarkMode} 
          aria-label="Toggle dark mode"
          className='p-1.5 rounded-lg text-zinc-400 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 active:scale-95 transition-all duration-150 cursor-pointer ml-0.5'
        >
          {darkMode ? <SunIcon size={15} /> : <MoonIcon size={15} />}
        </button>

        <div className='w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1' />

        {/* Publish Action Button */}
        <button 
          onClick={onPublish} 
          disabled={publishing}
          className='inline-flex items-center justify-center gap-1.5 py-1.5 px-3.5 text-white text-xs font-semibold rounded-xl cursor-pointer bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 active:scale-95 transition-all duration-150 shadow-md shadow-amber-600/20 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {publishing ? <Loader2Icon size={13} className="animate-spin" /> : <GlobeIcon size={13}/>}
          <span>Publish</span>
        </button>

        {/* Sign Out Button */}
        <button 
          onClick={onLogout} 
          aria-label="Sign out"
          className='p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 active:scale-95 transition-all duration-150 cursor-pointer ml-0.5'
        >
          <LogOutIcon size={14} />
        </button>
      </div>

    </header>
  )
}

export default BuilderHeader