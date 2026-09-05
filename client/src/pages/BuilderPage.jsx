import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom';
import Loading from "../components/Loading"
import BuilderHeader from '../components/BuilderHeader';
import { FolderTreeIcon, MessageSquareIcon, SparklesIcon } from 'lucide-react';
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
  const [leftTab, setLeftTab] = useState("chat");
  const [publishing, setPublishing] = useState(false);
  const [publishUrl, setPublishUrl] = useState(null);
  const [mobileView, setMobileView] = useState("sidebar"); // "sidebar" | "preview"


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
    bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl
    ${mobileView === "sidebar" ? "flex" : "hidden md:flex"}
  `}>
          
          {/* Sidebar Tabs Header */}
          <div className='relative flex border-b border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 p-1 gap-1'>
            <button 
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                leftTab === "chat" 
                  ? "text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 shadow-xs" 
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
              onClick={() => setLeftTab("chat")}
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
              onClick={() => setLeftTab("files")}
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
                }}
              />
            )}
          </div>
        </div>

        {/* Right Preview / Code Area */}
        <div key={activeProjects.status} className={`
    flex-1 overflow-hidden animate-fade-in bg-zinc-100/50 dark:bg-zinc-950/50
    ${mobileView === "preview" ? "block" : "hidden md:block"}
  `}>
          {activeProjects.status === "pending" || 
          activeProjects.status === "generating" || 
          activeProjects.status === "failed" ? (
            <AgentProgressDashboard project={activeProjects} />
          ) : (
            <PreviewPanel project={activeProjects} activeFile={activeFile} showCode={showCode} />
          )}
        </div>
      </div>
      {/* Mobile-only view switcher, e.g. in the header or as a floating toggle */}
      <div className="md:hidden flex border-t border-zinc-200 dark:border-zinc-800">
        <button onClick={() => setMobileView("sidebar")} className={mobileView === "sidebar" ? "font-bold" : ""}>Chat/Files</button>
        <button onClick={() => setMobileView("preview")} className={mobileView === "preview" ? "font-bold" : ""}>Preview</button>
      </div>

      {/* Publish Modal */}
      {publishUrl && <PublishModel publishUrl={publishUrl} onClose={() => setPublishUrl(null)} />}
    </div>
  )
}

export default BuilderPage
