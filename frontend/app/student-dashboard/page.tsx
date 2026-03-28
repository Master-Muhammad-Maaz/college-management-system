"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Folder, FileText, File as FileIcon, ChevronRight, 
  Home, Download, MoreVertical, Eye, Bell, X, BookOpen 
} from "lucide-react"

interface RepoItem {
  _id: string;
  name: string;
  path: string;
  isAssignment?: boolean; 
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
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [latestAssignment, setLatestAssignment] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);

  const fetchData = async () => {
    try {
      // 1. Fetch normal folders
      const resF = await fetch(`${API_BASE_URL}/api/folders/${currentFolder}`)
      const dataF = await resF.json()
      if (dataF.success) setFolders(dataF.folders)

      // 2. Fetch normal files
      const resFiles = await fetch(`${API_BASE_URL}/api/files/${currentFolder}`)
      const dataFiles = await resFiles.json()
      let combinedFiles: RepoItem[] = []
      if (dataFiles.success) combinedFiles = [...dataFiles.files]

      // 3. 🚀 Fetch assignments specific to THIS BATCH/FOLDER
      if (currentFolder !== "root") {
        const resAsgn = await fetch(`${API_BASE_URL}/api/assignments/folder/${currentFolder}`)
        const dataAsgn = await resAsgn.json()
        
        if (dataAsgn.success && dataAsgn.assignments) {
          const assignmentItems = dataAsgn.assignments.map((asgn: any) => ({
            _id: asgn._id,
            name: asgn.fileName,
            path: asgn.fileUrl || asgn.filePath || "",
            isAssignment: true // Separate identification for different icon
          }))
          combinedFiles = [...combinedFiles, ...assignmentItems]
        }
      }
      setFiles(combinedFiles)
    } catch (err) {
      console.error("Fetch error:", err)
    }
  }

  const fetchLatestAlert = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/assignments/latest`);
      const data = await res.json();
      if (data.success && data.assignment) {
        setLatestAssignment(data.assignment);
        setShowAlert(true); // Alert box automatically appears
      }
    } catch (err) {
      console.error("Alert fetch error:", err);
    }
  }

  useEffect(() => {
    fetchData()
    fetchLatestAlert()
  }, [currentFolder])

  useEffect(() => {
    const closeMenu = () => setActiveMenu(null)
    window.addEventListener("click", closeMenu)
    return () => window.removeEventListener("click", closeMenu)
  }, [])

  const enterFolder = (folder: RepoItem) => {
    setPath([...path, { id: folder._id, name: folder.name }])
    setCurrentFolder(folder._id)
  }

  const navigateTo = (index: number) => {
    const newPath = path.slice(0, index + 1)
    setPath(newPath)
    setCurrentFolder(newPath[newPath.length - 1].id)
  }

  const handleView = (file: RepoItem) => {
    if (!file.path) return;
    const cleanFileName = file.path.split(/[\\/]/).pop(); 
    window.open(`${API_BASE_URL}/uploads/${cleanFileName}`, "_blank");
  }

  const handleDownload = (file: RepoItem) => {
    window.open(`${API_BASE_URL}/api/download/${file._id}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6 md:p-10 font-sans">
      
      {/* ⚡ NEW ASSIGNMENT ALERT BOX */}
      <AnimatePresence>
        {showAlert && latestAssignment && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-7xl mx-auto mb-10 relative">
            <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-transparent border border-blue-500/30 p-5 rounded-[30px] backdrop-blur-xl flex items-center justify-between shadow-2xl shadow-blue-500/10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 animate-pulse">
                  <Bell size={24} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black bg-blue-500 px-2 py-0.5 rounded text-white uppercase tracking-tighter">New Assignment</span>
                  </div>
                  <p className="text-sm md:text-base font-medium text-gray-200">
                    <span className="text-blue-400 font-black uppercase italic mr-1">{latestAssignment.teacherName}</span> 
                    ne <span className="text-white font-bold underline decoration-blue-500/30">"{latestAssignment.fileName}"</span> upload kiya hai
                  </p>
                </div>
              </div>
              <button onClick={() => setShowAlert(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X size={20} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-8 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3 text-blue-500">
            <FileText /> Student Repository
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 italic underline decoration-blue-500/20">Digital Learning Hub</p>
        </div>
        <button onClick={() => navigateTo(0)} className="bg-white/5 px-6 py-2 rounded-xl hover:bg-white/10 transition flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-lg active:scale-95">
          <Home size={14} className="text-blue-500" /> Home
        </button>
      </div>

      {/* REPOSITORY GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12">
        {/* FOLDERS (M.SC II, B.SC, MCA) */}
        {folders.map((f) => (
          <motion.div key={f._id} onDoubleClick={() => enterFolder(f)} className="flex flex-col items-center group cursor-pointer" whileHover={{ y: -5 }}>
            <div className="w-24 h-24 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center justify-center transition-all group-hover:bg-blue-600/20 group-hover:border-blue-500/40 shadow-xl shadow-blue-500/5">
              <Folder size={44} className="text-blue-500" fill="currentColor" fillOpacity={0.15} />
            </div>
            <span className="mt-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] text-center w-full px-2 group-hover:text-blue-400 transition-colors">{f.name}</span>
          </motion.div>
        ))}

        {/* BATCH-WISE ASSIGNMENTS (Different Icon/Color) */}
        {files.map((file) => (
          <motion.div key={file._id} className="flex flex-col items-center group relative" whileHover={{ y: -5 }}>
            <div onClick={() => handleView(file)} className={`w-24 h-24 border rounded-3xl flex items-center justify-center transition-all shadow-lg relative cursor-pointer ${file.isAssignment ? "bg-indigo-600/10 border-indigo-500/30 group-hover:bg-indigo-600/20" : "bg-white/5 border-white/10 group-hover:bg-white/10"}`}>
              {file.isAssignment ? <BookOpen size={40} className="text-indigo-400" /> : <FileIcon size={40} className="text-blue-400" />}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600/20 rounded-3xl backdrop-blur-[2px]">
                <Eye size={20} className="text-white" />
              </div>
            </div>

            <span className={`mt-4 text-[10px] font-bold uppercase tracking-widest text-center break-all line-clamp-2 w-full px-2 transition-colors ${file.isAssignment ? "text-indigo-400 group-hover:text-indigo-200" : "text-gray-500 group-hover:text-white"}`}>
              {file.name}
              {file.isAssignment && <div className="text-[8px] opacity-60 mt-1 italic text-white underline decoration-indigo-500/50">Assignment</div>}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
