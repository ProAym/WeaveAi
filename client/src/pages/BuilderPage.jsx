import React, { useEffect, useState } from 'react'
import {useAppContext} from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom';
import Loading from "../components/Loading"
import BuilderHeader from '../components/BuilderHeader';
import { FolderTreeIcon, MessageSquareIcon } from 'lucide-react';
import ChatPanel from "../components/ChatPanel"
import FileExplorer from '../components/FileExplorer';
import PreviewPanel from '../components/PreviewPanel';
import AgentProgressDashboard from '../components/AgentProgressDashboard';
import PublishModel from '../components/PublishModel';
import api from '../api/api';
import toast from 'react-hot-toast';
import { exportProjectZip } from '../utils/exportProject';


const BuilderPage = () => {

  const  {id} = useParams()
  const navigate = useNavigate()
  const [leftTab, setLeftTab] = useState("chat");
  const [publishing, setPublishing] = useState(false);
  const [publishUrl, setPublishUrl] = useState(null);

  const {activeProjects,loadingActiveProjects, activeFile, showCode, 
    setActiveFile, setShowCode, loadProject, logout, chatLoading, handleChat} = useAppContext();

  
  useEffect(()=>{
    if(!id) return;
    loadProject(id)
  }, [id, loadProject]);

  const handleOpenPreview = () =>{
    if(!id) return;
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
  const handleDownload = async() =>{
    if(!activeProjects) return;
    exportProjectZip(activeProjectse)

  }

  if(loadingActiveProjects || !activeProjects){
    return <Loading />
  }

  return (
    <div className='h-screen flex  flex-col bg-white overflow-hidden text-zinc-900 relative' >
      {/*Top Bar Header */}
      <BuilderHeader 
      projectName={activeProjects.name}
      version={activeProjects.version}
      showCode={showCode}
      publishing={publishing}
      onToggleShowCode={() => setShowCode(!showCode)}
      onOpenPreview={handleOpenPreview}
      onPublish={handlePublish}
      onDownload={handleDownload}
      onBack={() => navigate("/")}
      onLogout={logout}/>


      {/*Main layout */}

      <div className='flex-1 flex overflow-hidden'>
        {/*Left Side Bar */}
        <div className="w-[320px] shrink-0 flex flex-col border-r border-zinc-200 bg-white">
          {/*Sidebar tabs */}
          <div className='flex border-b border-zinc-100'>
            <button className={`flex-1 flex item-center justify-center gap-1.5 py-2.5 text-xs
              font-medium cursor-pointer ${leftTab === "chat" ? "text-zinc-900 border-b-2 border-zinc-900" : "text-zinc-400 hover:text-zinc-700"}`}
              onClick={() => setLeftTab("chat")}>
              <MessageSquareIcon size={13}/> Chat
            </button>

            <button className={`flex-1 flex item-center justify-center gap-1.5 py-2.5 text-xs
              font-medium cursor-pointer ${leftTab === "files" ? "text-zinc-900 border-b-2 border-zinc-900" : "text-zinc-400 hover:text-zinc-700"}`}
              onClick={() => setLeftTab("files")}>
              <FolderTreeIcon size={13}/> Files
            </button>
          </div>


          {/*Sidebar Content*/}

          <div className='flex-1 overflow-hidden '>
            {
              leftTab === 'chat' ? (
                <ChatPanel messages = {activeProjects.messages} onSend ={handleChat} loading = {chatLoading}/>
              ) : (
                <FileExplorer  files = {activeProjects.files} activeFile={activeFile}
                onFileSelect={(path) =>{
                  setActiveFile(path);
                  setShowCode(true);
                }}/>
              )
            }

          </div>
        </div>


        {/*Preview / Code area */}

        <div className='flex-1 overflow-hidden'>
          {activeProjects.status === "pending" || 
          activeProjects.status ==="generating" || 
          activeProjects.status === "failed" ? (
            <AgentProgressDashboard  project={activeProjects}/>
          ): (
            <PreviewPanel project={activeProjects} activeFile={activeFile} showCode={showCode}/>
          )}

        </div>

      </div>

      {publishUrl && <PublishModel publishUrl={publishUrl} onClose={() =>setPublishUrl(null)}/>}
     
    </div>
  )
}

export default BuilderPage  
