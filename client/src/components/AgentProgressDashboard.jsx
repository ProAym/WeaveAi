import { CheckCircle2Icon, CircleIcon, FileCodeIcon, Loader2Icon, SparklesIcon, XCircleIcon, CpuIcon } from "lucide-react";

export default function AgentProgressDashboard({ project }) {
    const planned = project.filesPlanned || [];
    const completed = project.filesGenerated || [];
    const current = project.currentFile;
    const isFailed = project.status === "failed";
    const percent = planned.length > 0 ? Math.round((completed.length / planned.length) * 100) : 0;
    const activeFile = planned.find((f) => f.path === current);

    return (
        <div className="h-full w-full bg-zinc-50/50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 md:p-10 overflow-y-auto relative transition-colors duration-200 font-sans">
            {/* Background Ambient Mesh Glows */}
            {!isFailed && (
                <>
                    <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
                </>
            )}

            <div className="max-w-3xl w-full z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative shrink-0">
                        {isFailed ? (
                            <div className="w-11 h-11 rounded-xl bg-red-500/10 dark:bg-red-950/50 border border-red-500/20 flex items-center justify-center">
                                <XCircleIcon size={22} className="text-red-500" />
                            </div>
                        ) : (
                            <>
                                <div className="absolute inset-0 rounded-xl bg-amber-500/20 animate-ping" />
                                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-amber-600 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-600/20">
                                    <Loader2Icon size={20} className="text-white animate-spin" />
                                </div>
                            </>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                {isFailed ? "Generation Failed" : project.status === "pending" ? "Planning Architecture..." : "AI Agent is Building..."}
                            </h2>
                            {!isFailed && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                                    <CpuIcon size={11} />
                                    <span>Engine Active</span>
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {isFailed ? "An error occurred during build execution" : "Writing production-ready React codebase with automated structure"}
                        </p>
                    </div>
                </div>

                {/* Failure Error Box */}
                {isFailed && project.error && (
                    <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl text-xs text-red-600 dark:text-red-400 font-medium backdrop-blur-md flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        <span>Error: {project.error}</span>
                    </div>
                )}

                {/* Progress Card */}
                {planned.length > 0 && !isFailed && (
                    <div className="mb-6 bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-xl shadow-zinc-200/50 dark:shadow-none backdrop-blur-xl transition-colors duration-200">
                        <div className="flex justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5">
                            <span className="flex items-center gap-1.5">
                                <SparklesIcon size={13} className="text-amber-500" />
                                <span>Build Progress</span>
                            </span>
                            <span className="text-amber-600 dark:text-amber-400 font-bold tabular-nums">
                                {percent}% · {completed.length}/{planned.length} files
                            </span>
                        </div>
                        <div className="w-full h-2.5 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-full overflow-hidden relative p-0.5">
                            <div
                                className="h-full bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 transition-all duration-700 ease-out relative overflow-hidden rounded-full shadow-sm"
                                style={{ width: `${percent}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Layout */}
                {planned.length > 0 ? (
                    <div className="flex flex-col md:flex-row gap-5 items-start">
                        {/* File Tree List */}
                        <div className="w-full md:w-64 shrink-0 bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-2.5 space-y-1 max-h-96 overflow-y-auto backdrop-blur-xl shadow-lg shadow-zinc-200/30 dark:shadow-none transition-colors duration-200 hide-scrollbar">
                            <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                                Planned Artifacts
                            </p>
                            {planned.map((file) => {
                                const isCompleted = completed.includes(file.path);
                                const isGenerating = current === file.path;
                                const name = file.path.split("/").pop();

                                return (
                                    <div
                                        key={file.path}
                                        className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs transition-all duration-300 ${
                                            isGenerating
                                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold translate-x-1"
                                                : isCompleted
                                                  ? "text-zinc-600 dark:text-zinc-300"
                                                  : "text-zinc-400 dark:text-zinc-600"
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2Icon size={14} className="text-emerald-500 shrink-0 animate-pop" />
                                        ) : isGenerating ? (
                                            <Loader2Icon size={14} className="animate-spin text-amber-500 shrink-0" />
                                        ) : (
                                            <CircleIcon size={14} className="text-zinc-300 dark:text-zinc-700 shrink-0" />
                                        )}
                                        <span className="truncate">{name}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* File Spotlight Card */}
                        <div className="flex-1 min-h-60 relative w-full">
                            {activeFile ? (
                                <div
                                    key={activeFile.path}
                                    className="animate-slide-in-side bg-white/80 dark:bg-zinc-900/80 border border-amber-500/30 dark:border-amber-500/20 rounded-2xl p-6 shadow-xl shadow-amber-500/5 dark:shadow-none backdrop-blur-xl relative overflow-hidden transition-colors duration-200"
                                >
                                    <div className="absolute -top-8 -right-8 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl" />
                                    
                                    <div className="flex items-center gap-2 mb-4">
                                        <SparklesIcon size={14} className="text-amber-500 animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                                            Currently Generating
                                        </span>
                                    </div>

                                    <div className="flex items-start gap-3 mb-5">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-amber-600 to-amber-500 flex items-center justify-center shrink-0 shadow-md shadow-amber-600/20">
                                            <FileCodeIcon size={18} className="text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{activeFile.path}</p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{activeFile.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-1.5 items-center mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                                        <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 ml-1">compiling code...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-60 flex flex-col items-center justify-center bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl text-zinc-400 dark:text-zinc-600 backdrop-blur-xl transition-colors duration-200">
                                    <CheckCircle2Icon size={32} className="mb-2 text-emerald-500" />
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                        {completed.length === planned.length ? "All files generated successfully" : "Waiting for next generation step..."}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    !isFailed && (
                        <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-500 bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl backdrop-blur-xl transition-colors duration-200">
                            <div className="flex gap-1.5 mb-3">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Analyzing requirements and designing project structure...</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}