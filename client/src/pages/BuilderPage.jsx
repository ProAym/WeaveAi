import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom';
import Loading from "../components/Loading"
import BuilderHeader from '../components/BuilderHeader';
import { FolderTreeIcon, MessageSquareIcon, SparklesIcon, EyeIcon, Code2Icon } from 'lucide-react';
import ChatPanel from "../components/ChatPanel"
import FileExplorer from '../components/FileExplorer';
import PreviewPanel from '../components/PreviewPanel';
import AgentProgressDashboard from '../components/AgentProgressDashboard';
import PublishModel from '../components/PublishModel';
import api from '../api/api';
import toast from 'react-hot-toast';
import { exportProjectZip } from '../utils/exportProject';

const BuilderPage = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  // Single source of truth for mobile view: "chat" | "files" | "preview" | "code"
  const [mobileTab, setMobileTab] = useState("chat");
  const [publishing, setPublishing] = useState(false);
  const [publishUrl, setPublishUrl] = useState(null);

  const {
    activeProjects, 
    loadingActiveProjects, 
    activeFile, 
    showCode, 
    setActiveFile, 
    setShowCode, 
    loadProject, 
    logout, 
    chatLoading, 
    handleChat,
    darkMode, 
    toggleDarkMode
  } = useAppContext();

  useEffect(() => {
    if (!id) return;
    loadProject(id)
  }, [id, loadProject]);

  // Keep showCode in sync when user taps Preview/Code on mobile
  const handleMobileTabChange = (tab) => {
    setMobileTab(tab);
    if (tab === "preview") setShowCode(false);
    if (tab === "code") setShowCode(true);
  }

  const handleOpenPreview = () => {
    if (!id) return;
    window.open(`/preview/${id}`, "_blank")
  }

  const handlePublish = async () => {
    if (!id) return;
    setPublishing(true)
    try {
      await api.post(`/api/projects/${id}/publish`);
      const url = `${window.location.origin}/publish/${id}`;
      setPublishUrl(url);
      toast.success("Website published successfully!")
    } catch (err) {
      console.error("Publish failed: ", err);
      toast.error(err?.response?.data?.error || "Publish failed!");  
    } finally {
      setPublishing(false)
    }
  }

  const handleDownload = async () => {
    if (!activeProjects) return;
    exportProjectZip(activeProjects)
  }

  if (loadingActiveProjects || !activeProjects) {
    return <Loading />
  }

  // On desktop, sidebar always shows chat/files internal tabs.
  // On mobile, the bottom nav drives everything, so we derive a "leftTab"
  // for the sidebar's internal state from mobileTab when relevant.
  const isSidebarView = mobileTab === "chat" || mobileTab === "files";
  const leftTab = isSidebarView ? mobileTab : "chat";

  const isBuilding = activeProjects.status === "pending" ||
    activeProjects.status === "generating" ||
    activeProjects.status === "failed";

  return (
    <div className='h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-100 relative transition-colors duration-200 font-sans'>
      {/* Background Ambient Mesh Glows */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation Header */}
      <BuilderHeader 
        projectName={activeProjects.name}
        version={activeProjects.version}
        showCode={showCode}
        publishing={publishing}
        darkMode={darkMode}
        onToggleShowCode={() => setShowCode(!showCode)}
        onOpenPreview={handleOpenPreview}
        onPublish={handlePublish}
        onDownload={handleDownload}
        onBack={() => navigate("/")}
        onLogout={logout}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Builder Area */}
      <div className='flex-1 flex overflow-hidden z-10'>
        {/* Left Side Bar Container */}
        <div className={`
          w-full md:w-[320px] shrink-0 flex-col border-r border-zinc-200/80 dark:border-zinc-800/80 
          bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl shadow-zinc-200/50 dark:shadow-none 
          transition-colors duration-200
          ${isSidebarView ? "flex" : "hidden md:flex"}
        `}>
          
          {/* Sidebar Tabs Header — desktop only, mobile uses bottom nav instead */}
          <div className='hidden md:flex relative border-b border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 p-1 gap-1'>
            <button 
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                leftTab === "chat" 
                  ? "text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 shadow-xs" 
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
              onClick={() => setMobileTab("chat")}
            >
              <MessageSquareIcon size={13} className={leftTab === "chat" ? "text-amber-500 dark:text-amber-400" : ""} />
              <span>Chat</span>
            </button>

            <button 
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                leftTab === "files" 
                  ? "text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 shadow-xs" 
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
              onClick={() => setMobileTab("files")}
            >
              <FolderTreeIcon size={13} className={leftTab === "files" ? "text-indigo-500 dark:text-indigo-400" : ""} />
              <span>Files</span>
            </button>
          </div>

          {/* Sidebar Body */}
          <div className='flex-1 overflow-hidden relative'>
            {leftTab === 'chat' ? (
              <ChatPanel messages={activeProjects.messages} onSend={handleChat} loading={chatLoading} />
            ) : (
              <FileExplorer 
                files={activeProjects.files} 
                activeFile={activeFile}
                onFileSelect={(path) => {
                  setActiveFile(path);
                  setShowCode(true);
                  setMobileTab("code");
                }}
              />
            )}
          </div>
        </div>

        {/* Right Preview / Code Area */}
        <div
          key={activeProjects.status}
          className={`
            flex-1 overflow-hidden animate-fade-in bg-zinc-100/50 dark:bg-zinc-950/50
            ${!isSidebarView ? "flex" : "hidden md:flex"}
          `}
        >
          {isBuilding ? (
            <AgentProgressDashboard project={activeProjects} />
          ) : (
            <PreviewPanel project={activeProjects} activeFile={activeFile} showCode={showCode} />
          )}
        </div>
      </div>

      {/* Mobile Bottom Tab Bar — hidden on desktop */}
      <nav className='md:hidden flex items-stretch border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] z-20'>
        {[
          { key: "chat", label: "Chat", icon: MessageSquareIcon, accent: "text-amber-500 dark:text-amber-400" },
          { key: "files", label: "Files", icon: FolderTreeIcon, accent: "text-indigo-500 dark:text-indigo-400" },
          { key: "preview", label: "Preview", icon: EyeIcon, accent: "text-amber-500 dark:text-amber-400" },
          { key: "code", label: "Code", icon: Code2Icon, accent: "text-indigo-500 dark:text-indigo-400" },
        ].map(({ key, label, icon: Icon, accent }) => {
          const isActive = mobileTab === key;
          return (
            <button
              key={key}
              onClick={() => handleMobileTabChange(key)}
              className='flex-1 flex flex-col items-center justify-center gap-1 py-2 cursor-pointer transition-colors duration-150 active:scale-95'
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={20} className={isActive ? accent : "text-zinc-400 dark:text-zinc-500"} />
              <span className={`text-[10px] font-semibold ${isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500"}`}>
                {label}
              </span>
              {isActive && <span className={`absolute -mt-[26px] w-1 h-1 rounded-full ${accent.replace("text-", "bg-")}`} />}
            </button>
          );
        })}
      </nav>

      {/* Publish Modal */}
      {publishUrl && <PublishModel publishUrl={publishUrl} onClose={() => setPublishUrl(null)} />}
    </div>
  )
}

export default BuilderPage
