"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Folder, FileText, File as FileIcon, ChevronRight, 
  Home, Download, MoreVertical, Eye, Bell, X, BookOpen, Layers 
} from "lucide-react"

interface RepoItem {
  _id: string;
  name: string;
  path: string;
  isAssignment?: boolean;
  teacherName?: string;
  batchName?: string;
}

interface PathStep {
  id: string;
  name: string;
}

export default function StudentDashboard() {
  const API_BASE_URL = "https://college-management-system-ae1l.onrender.com";

  const [folders, setFolders] = useState<RepoItem[]>([])
  const [files, setFiles] = useState<RepoItem[]>([])
  const [currentFolder, setCurrentFolder] = useState<string>("root")
  const [path, setPath] = useState<PathStep[]>([{ id: "root", name: "Root" }])
  
  // 🚀 New States for Independent Assignment Module
  const [viewMode, setViewMode] = useState<"repo" | "assignments">("repo");
  const [allAssignments, setAllAssignments] = useState<RepoItem[]>([]);
  
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [latestAssignment, setLatestAssignment] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);

  // 1. Fetch Repository Data (Folders & Files Only)
  const fetchRepoData = async () => {
    try {
      const resF = await fetch(`${API_BASE_URL}/api/folders/${currentFolder}`)
      const dataF = await resF.json()
      if (dataF.success) setFolders(dataF.folders)

      const resFiles = await fetch(`${API_BASE_URL}/api/files/${currentFolder}`)
      const dataFiles = await resFiles.json()
      if (dataFiles.success) setFiles(dataFiles.files)
    } catch (err) {
      console.error("Repo fetch error:", err)
    }
  }

  // 2. 🚀 Fetch All Assignments (Independent Module)
  const fetchAllAssignments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/assignments/latest`); // Fetching latest collection
      const data = await res.json();
      if (data.success) {
        // Checking if API returns a single object or array
        const list = Array.isArray(data.assignment) ? data.assignment : [data.assignment];
        setAllAssignments(list.map((asgn: any) => ({
          _id: asgn._id,
          name: asgn.fileName,
          path: asgn.fileUrl || asgn.filePath || "",
          isAssignment: true,
          teacherName: asgn.teacherName,
          batchName: asgn.course // Using course/batch for identification
        })));
      }
    } catch (err) {
      console.error("Assignment module fetch error:", err);
    }
  }

  useEffect(() => {
    if (viewMode === "repo") fetchRepoData();
    else fetchAllAssignments();
    
    // Always check for latest alert
    const fetchLatestAlert = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/assignments/latest`);
        const data = await res.json();
        if (data.success && data.assignment) {
          setLatestAssignment(data.assignment);
          setShowAlert(true);
        }
      } catch (err) { console.error(err); }
    }
    fetchLatestAlert();
  }, [currentFolder, viewMode])

  // ... (enterFolder, navigateTo, handleView, handleDownload remain same)

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6 md:p-10 font-sans">
      
      {/* ⚡ NOTIFICATION ALERT */}
      <AnimatePresence>
        {showAlert && latestAssignment && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-7xl mx-auto mb-10 relative">
            <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-transparent border border-blue-500/30 p-5 rounded-[30px] backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 animate-pulse">
                  <Bell size={24} className="text-white" />
                </div>
                <p className="text-sm md:text-base font-medium text-gray-200">
                  <span className="text-blue-400 font-black uppercase italic mr-1">{latestAssignment.teacherName}</span> 
                  ne <span className="text-white font-bold underline">"{latestAssignment.fileName}"</span> upload kiya hai
                </p>
              </div>
              <button onClick={() => setShowAlert(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X size={20} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER & MODULE SWITCHER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-8 border-b border-white/5 pb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3 text-blue-500">
            <FileText /> Student Dashboard
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 italic">Digital Learning Hub</p>
        </div>

        <div className="flex gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setViewMode("repo")}
            className={`px-6 py-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${viewMode === "repo" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-white"}`}
          >
            <Home size={14} /> Repository
          </button>
          <button 
            onClick={() => setViewMode("assignments")}
            className={`px-6 py-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${viewMode === "assignments" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-gray-400 hover:text-white"}`}
          >
            <BookOpen size={14} /> Assignments
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {viewMode === "repo" ? (
          /* --- REPOSITORY VIEW (Folders Only) --- */
          <>
            <div className="mb-12 flex items-center gap-2 bg-white/5 p-4 rounded-2xl border border-white/5 overflow-x-auto">
              {path.map((step, index) => (
                <button key={step.id} onClick={() => navigateTo(index)} className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${index === path.length - 1 ? "text-blue-400" : "text-gray-500"}`}>
                  {step.name === "Root" ? <Home size={16} /> : step.name}
                  {index < path.length - 1 && <ChevronRight size={14} />}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12">
              {folders.map((f) => (
                <motion.div key={f._id} onDoubleClick={() => enterFolder(f)} className="flex flex-col items-center group cursor-pointer" whileHover={{ y: -5 }}>
                  <div className="w-24 h-24 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center justify-center transition-all group-hover:bg-blue-600/20 group-hover:border-blue-500/40">
                    <Folder size={44} className="text-blue-500" fillOpacity={0.15} />
                  </div>
                  <span className="mt-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">{f.name}</span>
                </motion.div>
              ))}
              {files.map((file) => (
                <motion.div key={file._id} onClick={() => handleView(file)} className="flex flex-col items-center group cursor-pointer" whileHover={{ y: -5 }}>
                  <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center transition-all group-hover:bg-white/10">
                    <FileIcon size={40} className="text-blue-400" />
                  </div>
                  <span className="mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center line-clamp-2">{file.name}</span>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          /* --- 🚀 INDEPENDENT ASSIGNMENTS MODULE --- */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allAssignments.map((asgn) => (
              <motion.div 
                key={asgn._id} 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0a0c14] border border-white/10 p-6 rounded-[35px] hover:border-indigo-500/50 transition-all relative overflow-hidden group shadow-xl"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BookOpen size={80} className="text-indigo-500" />
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black bg-indigo-600 px-3 py-1 rounded-lg text-white uppercase tracking-tighter">
                      {asgn.batchName || "Batch Wise"}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-white mb-2 line-clamp-1">{asgn.name}</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-8">
                  By: {asgn.teacherName || "Faculty"}
                </p>

                <div className="flex gap-3">
                  <button onClick={() => handleView(asgn)} className="flex-1 bg-white/5 hover:bg-white/10 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
                    View Task
                  </button>
                  <button onClick={() => handleDownload(asgn)} className="w-14 bg-indigo-600 hover:bg-indigo-500 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-indigo-600/20">
                    <Download size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
