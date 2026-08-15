import { ChevronRightIcon, FileCodeIcon, FileTextIcon, FolderIcon, FolderOpenIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react'

function buildTree(paths){
    const root = [];
    for(const filePath of paths.sort()){
        const parts = filePath.split("/").filter(Boolean)
        let current = root;

        for (let i= 0; i< parts.length; i++){
            const name = parts[i];
            const isLast = i === parts.length - 1;
            const fullPath = "/" + parts.slice(0, i + 1).join("/");
            let existing = current.find((n) => n.name === name)
            if(!existing){
                existing = {
                    name,
                    path: fullPath,
                    isDir: !isLast,
                    children: [],
                } ;
                current.push(existing);
            }
            current = existing.children;
        }
    }
    return root;
}

function getFileIcon(name){
    if(name.endsWith(".css")) return <FileTextIcon size={14} className='text-sky-500 dark:text-sky-400'/>;
    if(name.endsWith(".jsx") || name.endsWith(".js")) return <FileCodeIcon size={14} className='text-amber-500 dark:text-amber-400'/>;
    if(name.endsWith(".json")) return <FileTextIcon size={14} className='text-emerald-500 dark:text-emerald-400'/>;
    return <FileTextIcon size={14} className='text-zinc-400 dark:text-zinc-500' />;
}

function TreeItem({node, activeFile, onFileSelect, depth = 0, index = 0}){
    const isActive = node.path === activeFile;
    const [isOpen, setIsOpen] = useState(true);

    if(node.isDir){
        return(
            <div className='animate-fade-in' style={{ animationDelay: `${index * 30}ms` }}>
                <button
                    onClick={() => setIsOpen((v) => !v)}
                    className='w-full flex items-center gap-1.5 py-1.5 px-2 text-xs font-medium
                    text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50 rounded-lg transition-all
                    duration-150 select-none cursor-pointer group'
                    style={{paddingLeft: `${depth * 14 + 6}px`}}>
                    <ChevronRightIcon
                        size={12}
                        className={`text-zinc-400 dark:text-zinc-500 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                    />
                    {isOpen ? (
                        <FolderOpenIcon size={14} className='text-amber-500 dark:text-amber-400 shrink-0'/>
                    ) : (
                        <FolderIcon size={14} className='text-amber-500/70 dark:text-amber-400/70 shrink-0'/>
                    )}
                    <span className='truncate font-semibold text-[12px]'>{node.name}</span>
                    <span className='ml-auto text-[9px] px-1.5 py-0.2 rounded bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity'>
                        {node.children.length}
                    </span>
                </button>
                <div
                    className='overflow-hidden transition-all duration-200 ease-out relative'
                    style={{ maxHeight: isOpen ? `${node.children.length * 50}px` : "0px" }}
                >
                    <div
                        className='absolute top-0 bottom-0 w-px bg-zinc-200/60 dark:bg-zinc-800/80'
                        style={{ left: `${depth * 14 + 13}px` }}
                    />
                    {node.children.map((child, i) =>(
                        <TreeItem key={child.path} node={child} activeFile={activeFile} 
                        onFileSelect={onFileSelect} depth={depth + 1} index={i}/>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <button onClick={() => onFileSelect(node.path)}
        className={`animate-fade-in group w-full flex items-center gap-2 py-1.5 px-2 my-0.5 text-xs
        transition-all duration-150 rounded-xl cursor-pointer ${
            isActive 
                ? "bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold shadow-xs" 
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 hover:translate-x-0.5 border border-transparent"
        }`}
            style={{paddingLeft: `${depth * 14 + 6}px`, animationDelay: `${index * 30}ms`}}>
                <span className={`transition-transform duration-150 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                    {getFileIcon(node.name)}
                </span>
                <span className='truncate'>{node.name}</span>
                {isActive && <span className='ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0' />}
        </button>
    )
}

const FileExplorer = ({files, activeFile, onFileSelect}) => {
    const tree = useMemo(() => buildTree(Object.keys(files)), [files])

  return (
    <div className='py-2.5 px-2 overflow-y-auto hide-scrollbar bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl h-full transition-colors duration-200 font-sans'>
        <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Files · {Object.keys(files).length}
        </p>
        <div className="space-y-0.5 mt-1">
            {tree.map((node, i) =>(
                <TreeItem key={node.path} node={node} activeFile={activeFile} onFileSelect={onFileSelect} index={i}/>
            ))}
        </div>
    </div>
  )
}

export default FileExplorer