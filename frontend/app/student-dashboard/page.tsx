"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Folder, FileText, File as FileIcon, ChevronRight, 
  Home, Download, MoreVertical, Eye, Bell, X 
} from "lucide-react"

interface RepoItem {
  _id: string;
  name: string;
  path: string;
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
  
  // New States for Latest Assignment Alert
  const [latestAssignment, setLatestAssignment] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);

  // Fetch Repository Data
  const fetchData = async () => {
    try {
      const resF = await fetch(`${API_BASE_URL}/api/folders/${currentFolder}`)
      const dataF = await resF.json()
      if (dataF.success) setFolders(dataF.folders)

      const resFiles = await fetch(`${API_BASE_URL}/api/files/${currentFolder}`)
      const dataFiles = await resFiles.json()
      if (dataFiles.success) setFiles(dataFiles.files)
    } catch (err) {
      console.error("Fetch error:", err)
    }
  }

  // Fetch Latest Assignment Alert
  const fetchLatestAlert = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/assignments/latest`);
      const data = await res.json();
      if (data.success && data.assignment) {
        setLatestAssignment(data.assignment);
        setShowAlert(true);
      }
    } catch (err) {
      console.error("Alert fetch error:", err);
    }
  }

  useEffect(() => {
    fetchData()
    fetchLatestAlert() // Notification check on load
    const closeMenu = () => setActiveMenu(null)
    window.addEventListener("click", closeMenu)
    return () => window.removeEventListener("click", closeMenu)
  }, [currentFolder])

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
    const cleanFileName = file.path.split(/[\\/]/).pop(); 
    window.open(`${API_BASE_URL}/uploads/${cleanFileName}`, "_blank");
  }

  const handleDownload = (file: RepoItem) => {
    window.open(`${API_BASE_URL}/api/download/${file._id}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6 md:p-10 font-sans">
      
      {/* ⚡ LATEST ASSIGNMENT BREAKING ALERT */}
      <AnimatePresence>
        {showAlert && latestAssignment && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-7xl mx-auto mb-10 relative"
          >
            <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-transparent border border-blue-500/30 p-5 rounded-[30px] backdrop-blur-xl flex items-center justify-between shadow-2xl shadow-blue-500/10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 animate-pulse">
                  <Bell size={24} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black bg-blue-500 px-2 py-0.5 rounded text-white uppercase tracking-tighter">New Assignment</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Just Now</span>
                  </div>
                  <p className="text-sm md:text-base font-medium text-gray-200">
                    <span className="text-blue-400 font-black uppercase italic mr-1">{latestAssignment.teacherName}</span> 
                    ne <span className="text-white font-bold underline decoration-blue-500/30">"{latestAssignment.fileName}"</span> upload kiya hai 
                    for <span className="text-indigo-400 font-bold">{latestAssignment.course} ({latestAssignment.semester})</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowAlert(false)}
                className="p-3 hover:bg-white/10 rounded-2xl transition-all text-gray-500 hover:text-white border border-white/5"
              >
                <X size={20} />
              </button>
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
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 italic">Access study materials and notes</p>
        </div>
        <button onClick={() => navigateTo(0)} className="bg-white/5 px-6 py-2 rounded-xl hover:bg-white/10 transition flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-lg active:scale-95">
          <Home size={14} className="text-blue-500" /> Home
        </button>
      </div>

      {/* BREADCRUMBS */}
      <div className="max-w-7xl mx-auto mb-12 flex items-center gap-2 bg-white/5 p-4 rounded-2xl border border-white/5 overflow-x-auto backdrop-blur-md">
        {path.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2 whitespace-nowrap">
            <button 
              onClick={() => navigateTo(index)} 
              className={`hover:text-blue-400 transition text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${index === path.length - 1 ? "text-blue-400" : "text-gray-500"}`}
            >
              {step.name === "Root" ? <Home size={16} className="text-blue-500" /> : step.name}
            </button>
            {index < path.length - 1 && <ChevronRight size={14} className="text-gray-700" />}
          </div>
        ))}
      </div>

      {/* REPOSITORY GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12">
        {folders.length === 0 && files.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-700 font-bold uppercase tracking-widest text-xs">
              Repository is empty
          </div>
        )}

        {/* FOLDERS */}
        {folders.map((f) => (
          <motion.div key={f._id} onDoubleClick={() => enterFolder(f)} className="flex flex-col items-center group cursor-pointer" whileHover={{ y: -5 }}>
            <div className="w-24 h-24 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center justify-center transition-all group-hover:bg-blue-600/20 group-hover:border-blue-500/40 shadow-xl shadow-blue-500/5">
              <Folder size={44} className="text-blue-500" fill="currentColor" fillOpacity={0.15} />
            </div>
            <span className="mt-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] text-center w-full px-2 group-hover:text-blue-400 transition-colors">
              {f.name}
            </span>
          </motion.div>
        ))}

        {/* FILES */}
        {files.map((file) => (
          <motion.div key={file._id} className="flex flex-col items-center group relative" whileHover={{ y: -5 }}>
            <div 
              onClick={() => handleView(file)}
              className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center transition-all group-hover:bg-white/10 group-hover:border-white/20 shadow-lg relative cursor-pointer"
            >
              <FileIcon size={40} className="text-indigo-400" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600/20 rounded-3xl backdrop-blur-[2px]">
                <Eye size={20} className="text-white" />
              </div>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(activeMenu === file._id ? null : file._id);
              }}
              className="absolute top-1 right-1 p-1.5 text-gray-600 hover:text-white transition-colors bg-black/40 rounded-full md:opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={14} />
            </button>

            <AnimatePresence>
              {activeMenu === file._id && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-14 right-0 z-50 bg-[#0a0c14] border border-white/10 shadow-2xl rounded-2xl py-2 w-36 backdrop-blur-xl"
                >
                  <button 
                    onClick={() => handleDownload(file)}
                    className="w-full flex items-center px-4 py-3 hover:bg-blue-600 transition text-[10px] font-black uppercase tracking-widest text-white"
                  >
                    <Download size={14} className="mr-3 text-blue-400" /> Download
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <span className="mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center break-all line-clamp-2 w-full px-2 group-hover:text-white transition-colors">
              {file.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
