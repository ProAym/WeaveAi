import React, { useEffect, useState } from 'react'
import {useAppContext} from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom';
import {Loading} from "../components/Loading"

const BuilderPage = () => {

  const  {id} = useParams()
  const navigate = useNavigate()
  const [leftTab, setLeftTab] = useState("chat");
  const [publishing, setPublishing] = useState(false);
  const [publishUrl, setPublishUrl] = useState(null);

  


  const {activeProjects,loadingActiveProjects, activeFile, showCode, 
    setActiveFile, setShowCode, loadProject, logout} = useAppContext();

  useEffect(()=>{
    if(!id) return;
    loadProject(id)
  }, [id, loadProject]);

  useEffect(()=>{
    if(!id || !activeProjects) return;
    if(activeProjects.status === "pending" || activeProjects.status === "generating"){
      const interval =  setInterval(() =>{
        loadProject(id, true)
      },1500)
      return () => clearInterval(interval)
    }
  }, [id, loadProject, activeProjects]);


  if(loadingActiveProjects || !activeProjects){
    return <Loading />
  }

  return (
    <div className='h-screen flex-col bg-white overflow-hidden text-zinc-900 relative' >
      {/*Top Bar Header */}

      {/*Main layout */}
     
    </div>
  )
}

export default BuilderPage
