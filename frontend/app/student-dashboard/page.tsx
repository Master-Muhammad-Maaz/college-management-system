"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FolderOpen, FileText, File as FileIcon, ChevronRight, Home, Download, MoreVertical, Eye } from "lucide-react"

export default function StudentDashboard() {
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [currentFolder, setCurrentFolder] = useState("root")
  const [path, setPath] = useState([{ id: "root", name: "Root" }])
  const [activeMenu, setActiveMenu] = useState(null)

  const fetchData = async () => {
    try {
      const resF = await fetch(`http://localhost:5000/api/folders/${currentFolder}`)
      const dataF = await resF.json()
      if (dataF.success) setFolders(dataF.folders)

      const resFiles = await fetch(`http://localhost:5000/api/files/${currentFolder}`)
      const dataFiles = await resFiles.json()
      if (dataFiles.success) setFiles(dataFiles.files)
    } catch (err) {
      console.error("Fetch error:", err)
    }
  }

  useEffect(() => {
    fetchData()
    const closeMenu = () => setActiveMenu(null)
    window.addEventListener("click", closeMenu)
    return () => window.removeEventListener("click", closeMenu)
  }, [currentFolder])

  const enterFolder = (folder) => {
    setPath([...path, { id: folder._id, name: folder.name }])
    setCurrentFolder(folder._id)
  }

  const navigateTo = (index) => {
    const newPath = path.slice(0, index + 1)
    setPath(newPath)
    setCurrentFolder(newPath[newPath.length - 1].id)
  }

  // --- VIEW LOGIC (PATH FIX) ---
  const handleView = (file) => {
    // Agar database path mein 'uploads/' shamil hai, toh use clean karte hain
    const cleanFileName = file.path.split(/[\\/]/).pop(); 
    window.open(`http://localhost:5000/uploads/${cleanFileName}`, "_blank");
  }

  const handleDownload = (file) => {
    window.open(`http://localhost:5000/api/download/${file._id}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-[#0a0c14] text-white p-10">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
            <FileText className="text-sky-400" /> Student Repository
          </h1>
          <p className="text-gray-500 text-sm mt-1 italic">Click to view, use menu to download</p>
        </div>
        <button onClick={() => navigateTo(0)} className="bg-white/5 px-5 py-2 rounded-full hover:bg-white/10 transition flex items-center gap-2 text-xs font-bold uppercase border border-white/10">
          <Home size={16} /> Home
        </button>
      </div>

      {/* BREADCRUMBS */}
      <div className="max-w-6xl mx-auto mb-10 flex items-center gap-2 bg-blue-900/10 p-4 rounded-xl border border-blue-500/10">
        {path.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2">
            <button 
              onClick={() => navigateTo(index)} 
              className={`hover:text-sky-400 transition text-sm font-semibold ${index === path.length - 1 ? "text-sky-400" : "text-gray-500"}`}
            >
              {step.name}
            </button>
            {index < path.length - 1 && <ChevronRight size={14} className="text-gray-700" />}
          </div>
        ))}
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {folders.map((f) => (
          <motion.div key={f._id} onDoubleClick={() => enterFolder(f)} className="flex flex-col items-center group cursor-pointer" whileHover={{ y: -5 }}>
            <div className="bg-sky-900/10 p-6 rounded-2xl group-hover:bg-sky-800/20 border border-white/5 transition-all shadow-xl">
              <FolderOpen size={45} className="text-sky-500" />
            </div>
            <span className="mt-3 text-sm font-medium text-gray-300 text-center">{f.name}</span>
          </motion.div>
        ))}

        {files.map((file) => (
          <motion.div key={file._id} className="flex flex-col items-center group relative" whileHover={{ y: -5 }}>
            
            {/* Clickable Icon for Viewing */}
            <div 
              onClick={() => handleView(file)}
              className="bg-emerald-900/10 p-6 rounded-2xl group-hover:bg-emerald-800/20 border border-white/5 transition-all shadow-xl text-emerald-500 cursor-pointer relative"
            >
              <FileIcon size={45} />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-2xl">
                <Eye size={20} className="text-white" />
              </div>
            </div>

            {/* Meatball Menu (...) Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(activeMenu === file._id ? null : file._id);
              }}
              className="absolute top-1 right-2 p-1 text-gray-500 hover:text-white transition-colors"
            >
              <MoreVertical size={18} />
            </button>

            {/* Download Menu */}
            <AnimatePresence>
              {activeMenu === file._id && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-10 right-0 z-50 bg-[#161b22] border border-white/10 shadow-2xl rounded-lg py-1 w-32 overflow-hidden"
                >
                  <button 
                    onClick={() => handleDownload(file)}
                    className="w-full flex items-center px-4 py-2 hover:bg-blue-600 transition text-xs font-bold text-white"
                  >
                    <Download size={14} className="mr-2" /> Download
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <span className="mt-3 text-xs text-center text-gray-400 break-all w-24 line-clamp-2">{file.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}