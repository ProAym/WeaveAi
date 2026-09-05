import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import PromptInput from '../components/PromptInput'
import { homeTags } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRightIcon, ClockIcon, TrashIcon, SparklesIcon, FolderCodeIcon, LogOutIcon, UserIcon, MenuIcon, XIcon } from 'lucide-react'
import moment from "moment";

const HomePage = () => {

  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user, projects, loadingProjects, generatingProjects, loadProjects, handleGenerate, handleDelete, logout } = useAppContext()

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Shared project row, reused in both the desktop inline list and the mobile drawer
  const ProjectRow = ({ p }) => (
    <div 
      key={p._id} 
      className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 flex items-center justify-between group hover:border-white/25 hover:bg-white/[0.07] cursor-pointer backdrop-blur-xl transition-all duration-200"
      onClick={() => {
        setDrawerOpen(false);
        navigate(`/builder/${p._id}`);
      }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-100 group-hover:text-white truncate transition-colors">
          {p.name}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <ClockIcon size={11} className="text-zinc-500" />
            {moment(p.updatedAt || p.createdAt).fromNow()}
          </span>
          <span className="text-[10px] text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 font-semibold px-1.5 py-0.2 rounded">
            v{p.version}
          </span>
        </div> 
      </div>

      <div className="flex items-center gap-2">
        <button 
          aria-label="Delete project"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(p._id);
          }}
        >
          <TrashIcon size={15} />
        </button>
        <ArrowRightIcon size={15} className="text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );

  return (
    <div className="h-screen overflow-y-auto text-zinc-100 font-sans bg-zinc-950 relative transition-colors duration-200">
      {/* Background Ambient Mesh Blobs */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 via-red-600/15 to-amber-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-zinc-950/60 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <img 
            src="/weave_logo_mark.svg" 
            alt="Weave" 
            className="h-7 -mr-1.5 translate-y-[1px]" 
          />
          <span className="text-2xl font-black tracking-tight text-white">eave</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium text-zinc-300">
          {/* Hamburger — mobile only, opens the drawer (profile + sign out + projects) */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="md:hidden flex items-center gap-1.5 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <MenuIcon size={15} className="text-zinc-200" />
          </button>

          {/* Profile + Sign out — desktop only, moved into the drawer on mobile */}
          <button
            onClick={() => navigate("/profile")}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <UserIcon size={13} className="text-amber-400" />
            <span className="text-zinc-200">{user?.name}</span>
          </button>

          <button 
            onClick={logout} 
            className="hidden md:inline-flex items-center gap-1.5 py-1.5 px-3 border border-white/15 text-zinc-300 hover:text-white hover:bg-white/10 text-xs font-medium rounded-lg cursor-pointer bg-white/5 transition-all duration-150 active:scale-95"
          >
            <LogOutIcon size={13} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20 mt-4 md:mt-8 xl:mt-20">
        <div className="w-full max-w-2xl flex flex-col items-center">
          
          {/* Promo Badge */}
          <div className="inline-flex items-center gap-2 p-1 pr-3.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/15 text-xs text-zinc-300 shadow-xl mb-4 md:mb-6">
            <span className="px-2.5 py-0.5 text-[10px] bg-gradient-to-r from-red-600 to-amber-600 rounded-full font-bold uppercase tracking-wider text-white shadow-sm">
              PROMO
            </span>
            <span className="flex items-center gap-1">
              <SparklesIcon size={12} className="text-amber-400" />
              Create your first project for free
            </span>
          </div>

          {/* Title & Description */}
          <h1 className="text-center text-3xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Let's build your app <span className="bg-gradient-to-r from-red-500 via-amber-400 to-amber-200 bg-clip-text text-transparent">together</span>
          </h1>
          <p className="text-center text-sm md:text-base max-w-xl mt-4 text-zinc-400 leading-relaxed">
            Describe your idea and watch AI design, structure, and launch your website instantly. No coding required.
          </p>

          {/* Glassmorphic Prompt Input */}
          <div className="w-full mt-8">
            <PromptInput 
              onSubmit={handleGenerate}
              loading={generatingProjects}
              placeholder="Create a portfolio website with dark mode and smooth animations..."
              variant="glass"
              autoFocus
            />
          </div>

          {/* Scrolling Marquee Tags — desktop/tablet only */}
          <div className="hidden md:block masked-marquee w-full mt-6 max-w-2xl overflow-hidden py-1">
            <div className="animate-marquee gap-2.5">
              {homeTags.map((tag, i) => (
                <button 
                  key={i}
                  onClick={() => handleGenerate(tag)}
                  disabled={generatingProjects}
                  className="px-3.5 py-1.5 border rounded-full text-xs text-zinc-300 bg-white/5 border-white/15 hover:bg-white/15 hover:border-white/30 hover:text-white transition-all cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Projects List — desktop/tablet inline, hidden on mobile (drawer instead) */}
          {!loadingProjects && projects.length > 0 && (
            <div className="hidden md:block mt-14 w-full">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <FolderCodeIcon size={14} className="text-indigo-400" />
                  <p className="text-xs font-semibold uppercase text-zinc-300 tracking-wider">All projects</p>
                </div>
                <span className="text-xs text-zinc-400 font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                  {projects.length} {projects.length === 1 ? "project" : "projects"}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1 hide-scrollbar">
                {projects.map((p) => <ProjectRow key={p._id} p={p} />)}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Projects Drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-[85%] max-w-sm h-full bg-zinc-950 border-l border-white/10 flex flex-col animate-slide-in-side">
            {/* Drawer Header: close button */}
            <div className="flex items-center justify-end px-4 py-3 border-b border-white/10">
              <button 
                onClick={() => setDrawerOpen(false)} 
                aria-label="Close menu"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <XIcon size={16} />
              </button>
            </div>

            {/* Profile + Sign out */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/profile");
                }}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <UserIcon size={14} className="text-amber-400" />
                </div>
                <span className="text-sm font-semibold text-zinc-100 truncate">{user?.name}</span>
              </button>

              <button 
                onClick={logout} 
                aria-label="Sign out"
                className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-all duration-150 active:scale-95 shrink-0"
              >
                <LogOutIcon size={15} />
              </button>
            </div>

            {/* Projects Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <FolderCodeIcon size={14} className="text-indigo-400" />
              <p className="text-xs font-semibold uppercase text-zinc-300 tracking-wider">All projects</p>
              <span className="text-xs text-zinc-400 font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                {projects.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 hide-scrollbar">
              {loadingProjects ? (
                <p className="text-xs text-zinc-500 text-center mt-6">Loading projects...</p>
              ) : projects.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center mt-6">No projects yet.</p>
              ) : (
                projects.map((p) => <ProjectRow key={p._id} p={p} />)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
