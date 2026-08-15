import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SandpackCodeEditor, SandpackLayout, SandpackPreview, SandpackProvider, useSandpack } from '@codesandbox/sandpack-react'
import { detectDependencies } from '../utils/sandpackUtils';
import { useAppContext } from '../context/AppContext';
import SandpackErrorMonitor from './SandpackErrorMonitor';

// Watches for file edits inside sandpack editor and saves changes to DB & live state
function SandpackFileWatcher({ onLiveFilesChange }){
    const { sandpack } = useSandpack();
    const { files } = sandpack;
    const { activeProjects, updateProjectFiles } = useAppContext();

    const activeProjectRef = useRef(activeProjects)

    useEffect(() => {
        activeProjectRef.current = activeProjects
    }, [activeProjects])

    useEffect(() => {
        const project = activeProjectRef.current;
        if (!project) return;
        const updatedFiles = {};
        let hasChanges = false;

        for (const [path, fileObj] of Object.entries(files)) {
            const fileCode = fileObj.code;
            updatedFiles[path] = fileCode;
            const originalContent = typeof project.files[path] === "string" 
                ? project.files[path]
                : project.files[path]?.content;
            if (originalContent !== undefined && originalContent !== fileCode) {
                hasChanges = true;
            }
        }

        // Sync live files to parent
        onLiveFilesChange(updatedFiles);
        if (hasChanges) {
            updateProjectFiles(updatedFiles)
        }
    }, [files])

    return null;
}

// Syncs Sandpack's internal tab clicks back to the app's activeFile state
function SandpackActiveFileSync() {
    const { sandpack } = useSandpack();
    const { setActiveFile } = useAppContext();

    useEffect(() => {
        if (sandpack.activeFile) {
            setActiveFile(sandpack.activeFile);
        }
    }, [sandpack.activeFile, setActiveFile]);

    return null;
}

const PreviewPanel = ({ project, activeFile, showCode }) => {
    const { darkMode } = useAppContext();
    const [showErrorOverlay, setShowErrorOverlay] = useState(true);
    
    // Keep local state of files that updates as user types
    const [liveFile, setLiveFile] = useState(project.files);
    const [prevProjectKey, setPrevProjectKey] = useState(`${project._id}-${project.version}`)

    const currentKey = `${project._id}-${project.version}`;
    if (prevProjectKey !== currentKey) {
        setPrevProjectKey(currentKey);
        setLiveFile(project.files);
    }

    const handleLiveFilesChange = (newFiles) => {
        setLiveFile((prev) => {
            let changed = false;
            for (const [p, code] of Object.entries(newFiles)) {
                if (prev[p] !== code) {
                    changed = true;
                    break;
                }
            }
            return changed ? newFiles : prev;
        })
    }

    // Convert LiveFiles to sandpack format
    const sandpackFiles = useMemo(() => {
        const spFiles = {};
        for (const [path, content] of Object.entries(liveFile)) {
            const fileCode = typeof content === "string" ? content : content?.content || "";
            spFiles[path] = {
                code: fileCode,
            }
        }
        return spFiles;
    }, [liveFile])

    // Detect dependencies from import statements using liveFiles
    const dependencies = useMemo(() => {
        return detectDependencies(liveFile)
    }, [liveFile])

    // Dynamic Sandpack themes matching app design token palette
    const sandpackTheme = useMemo(() => ({
        colors: darkMode ? {
            surface1: "#09090b",      // zinc-950 code editor background
            surface2: "#18181b",      // zinc-900 tab bar background
            surface3: "#27272a",      // zinc-800 borders / hover states
            clickable: "#a1a1aa",     // zinc-400 secondary text
            base: "#f4f4f5",          // zinc-100 main code text
            disabled: "#52525b",      // zinc-600 disabled
            hover: "#ffffff",         // hover active text
            accent: "#f59e0b",        // amber-500 active tab indicator & cursor
            error: "#f87171",         // red-400 error accent
            errorSurface: "#450a0a",  // red-950 error box
        } : {
            surface1: "#ffffff",
            surface2: "#f4f4f5",
            surface3: "#e4e4e7",
            clickable: "#71717a",
            base: "#09090b",
            disabled: "#a1a1aa",
            hover: "#18181b",
            accent: "#ea580c",        // amber-600 accent
            error: "#ef4444",
            errorSurface: "#fef2f2",
        },
        font: {
            body: "'Urbanist', system-ui, -apple-system, sans-serif",
            mono: "'Geist Mono', ui-monospace, monospace",
            size: "13px",
            lineHeight: "1.6",
        }
    }), [darkMode]);

    return (
        <div className='h-full w-full bg-zinc-50/50 dark:bg-zinc-950/50 p-2 transition-colors duration-200 font-sans'>
            <div className="h-full w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl overflow-hidden shadow-xl shadow-zinc-200/30 dark:shadow-none">
                <SandpackProvider 
                    key={project._id} 
                    template='react' 
                    files={sandpackFiles} 
                    customSetup={{ dependencies }}
                    options={{
                        activeFile: activeFile,
                        externalResources: [
                            "https://cdn.tailwindcss.com",
                            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
                        ],
                        classes: {
                            "sp-wrapper": "sp-wrapper h-full",
                            "sp-layout" : "sp-layout h-full border-0 bg-transparent",
                            "sp-preview": "sp-preview h-full bg-white dark:bg-zinc-950",
                        },
                        logLevel: 0,
                    }} 
                    theme={sandpackTheme}
                >
                    <SandpackFileWatcher onLiveFilesChange={handleLiveFilesChange} />
                    <SandpackErrorMonitor onErrorChange={setShowErrorOverlay} />
                    <SandpackActiveFileSync />

                    <SandpackLayout 
                        style={{
                            height: "100%",
                            border: "none",
                            borderRadius: 0,
                            background: "transparent",
                        }}
                    >
                        {showCode && (
                            <SandpackCodeEditor 
                                showTabs 
                                showLineNumbers 
                                showInlineErrors
                                wrapContent 
                                style={{ height: "100%", flex: 1, minWidth: 0 }}
                            />
                        )}

                        <SandpackPreview 
                            showNavigator={false} 
                            showRefreshButton 
                            showOpenInCodeSandbox={false}
                            showSandpackErrorOverlay={showErrorOverlay}
                            style={{ height: "100%", flex: showCode ? 1 : 2, minWidth: 0 }}
                        />
                    </SandpackLayout>
                </SandpackProvider>
            </div>
        </div>
    )
}

export default PreviewPanel