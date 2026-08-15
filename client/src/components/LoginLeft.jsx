import React from 'react'
import { Sparkles, Code2, Cpu, Zap } from 'lucide-react'

const LoginLeft = () => {
  return (
    <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-12 shrink-0 select-none overflow-hidden bg-zinc-950">
      {/* Background Image Layer with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-[url('/bg-img.png')] bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-950/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/20 to-amber-950/30" />

      {/* Decorative Ambient Mesh Blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-red-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Section: Brand Header */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner">
          <img src="/logo.svg" alt="Builder AI Logo" className="size-7" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">Builder AI</span>
      </div>

      {/* Middle Section: Floating Feature Highlights Card */}
      <div className="relative z-10 my-auto py-8">
        <div className="p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-2xl space-y-4 max-w-md">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400">
            <Sparkles className="size-4 animate-pulse" />
            <span>Next-Gen Web Engine</span>
          </div>

          <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">
            Build your presence on web
          </h2>

          <p className="text-sm text-zinc-300/90 leading-relaxed">
            Create stunning full-stack React applications without writing complex boilerplate code. Describe your vision in natural language and watch your site build in real time.
          </p>

          {/* Micro Feature Tags */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-xs text-zinc-300">
              <Zap className="size-3.5 text-amber-400 shrink-0" />
              <span>Instant Generation</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-xs text-zinc-300">
              <Code2 className="size-3.5 text-indigo-400 shrink-0" />
              <span>Live Code Editing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Footer Copyright */}
      <div className="relative z-10 flex items-center justify-between text-xs text-zinc-500 border-t border-white/10 pt-6">
        <span>&copy; {new Date().getFullYear()} BuilderAI Inc. All rights reserved.</span>
        <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
          <Cpu className="size-3.5 text-amber-500" />
          <span>v2.4 Powered</span>
        </div>
      </div>
    </div>
  )
}

export default LoginLeft