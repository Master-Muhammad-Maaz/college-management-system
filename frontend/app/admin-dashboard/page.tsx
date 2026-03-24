"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FolderPlus, Upload, FolderOpen, Trash2, X, ChevronLeft, 
  Home, FileText, File as FileIcon, ChevronRight, Loader2, 
  Users, LayoutDashboard 
} from "lucide-react"
import axios from "axios"
import Link from "next/link"

export default function AdminDashboard() {
  // --- FINAL RENDER BACKEND URL ---
  const API_BASE_URL = "https://college-management-system-ae1l.onrender.com";

  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [currentFolder, setCurrentFolder] = useState("root")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [path, setPath] = useState([{ id: "root", name: "Root" }])
  const fileInputRef = useRef(null)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0, visible: false })
  const [selectedItem, setSelectedItem] = useState(null)

  // Fetching folders and files from Render
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

  useEffect(() => {
    fetchData()
    const closeMenu = () => setMenuPos(prev => ({ ...prev, visible: false }))
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

  const handleCreateFolder = async (e) => {
    e.preventDefault()
    if (!folderName) return
    const res = await fetch(`${API_BASE_URL}/api/create-folder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: folderName, parentId: currentFolder === "root" ? null : currentFolder })
    })
    const data = await res.json()
    if (data.success) { setFolderName(""); setIsModalOpen(false); fetchData() }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folderId", currentFolder)
    setIsUploading(true)
    setUploadProgress(0)
    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        onUploadProgress: (p) => setUploadProgress(Math.round((p.loaded * 100) / p.total)),
      })
      if (res.data.success) {
        fetchData()
        setTimeout(() => { setIsUploading(false); setUploadProgress(0) }, 1000)
      }
    } catch (err) {
      setIsUploading(false)
      alert("Upload failed!")
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    const url = selectedItem.type === 'folder' 
      ? `${API_BASE_URL}/api/delete-folder/${selectedItem._id}` 
      : `${API_BASE_URL}/api/delete-file/${selectedItem._id}`
    
    if (confirm(`Delete this ${selectedItem.type}?`)) {
      await fetch(url, { method: "DELETE" })
      fetchData()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-black text-white p-6 md:p-10 font-sans" onContextMenu={(e) => { e.preventDefault(); setMenuPos({ x: e.pageX, y: e.pageY, visible: true }); setSelectedItem(null); }}>
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between mb-8 gap-6 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FileText className="text-blue-400" /> Admin Repository
        </h1>

        <div className="flex items-center gap-4 bg-black/40 p-1.5 rounded-2xl border border-white/5">
          <Link href="/admin-dashboard">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
              <LayoutDashboard size={16} /> Repository
            </button>
          </Link>
          <Link href="/admin/students">
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-all">
              <Users size={16} /> Students & Attendance
            </button>
          </Link>
        </div>
      </div>

      {/* BREADCRUMBS */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/5 overflow-x-auto whitespace-nowrap">
        {path.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2">
            <button onClick={() => navigateTo(index)} className={`hover:text-blue-400 transition text-sm font-medium ${index === path.length - 1 ? "text-blue-400" : "text-gray-400"}`}>
                {step.name === "Root" ? <Home size={16} /> : step.name}
            </button>
            {index < path.length - 1 && <ChevronRight size={14} className="text-gray-600" />}
          </div>
        ))}
      </div>

      {/* UPLOAD PROGRESS BAR */}
      <AnimatePresence>
        {isUploading && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto mb-6 bg-gray-900/80 p-4 rounded-xl border border-blue-500/30">
            <div className="flex justify-between mb-2 text-xs font-bold uppercase tracking-widest text-blue-400">
              <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <motion.div className="bg-blue-500 h-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID AREA */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {folders.map((f) => (
          <motion.div key={f._id} 
            onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); setSelectedItem({ ...f, type: 'folder' }); setMenuPos({ x: e.pageX, y: e.pageY, visible: true }); }} 
            onDoubleClick={() => enterFolder(f)} 
            className="flex flex-col items-center group cursor-pointer" 
            whileHover={{ scale: 1.05 }}>
            <div className="bg-blue-800/20 p-6 rounded-xl group-hover:bg-blue-700/40 border border-white/5 transition-all shadow-lg"><FolderOpen size={50} className="text-sky-400" /></div>
            <span className="mt-2 text-sm font-medium truncate w-full text-center px-2">{f.name}</span>
          </motion.div>
        ))}
        {files.map((file) => (
          <motion.div key={file._id} 
            onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); setSelectedItem({ ...file, type: 'file' }); setMenuPos({ x: e.pageX, y: e.pageY, visible: true }); }} 
            className="flex flex-col items-center group cursor-pointer" 
            whileHover={{ scale: 1.05 }}>
            <div className="bg-gray-800/40 p-6 rounded-xl group-hover:bg-gray-700/60 border border-white/5 transition-all shadow-lg text-green-400"><FileIcon size={50} /></div>
            <span className="mt-2 text-xs text-center break-all w-24 line-clamp-2 px-1">{file.name}</span>
          </motion.div>
        ))}
      </div>

      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

      {/* CONTEXT MENU (RIGHT CLICK) */}
      <AnimatePresence>
        {menuPos.visible && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ top: menuPos.y, left: menuPos.x }} className="fixed bg-[#0f1117] border border-white/10 shadow-2xl rounded-lg py-2 w-52 z-50">
            {!selectedItem ? (
              <>
                <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center px-4 py-2 hover:bg-blue-600 transition text-sm"><FolderPlus size={16} className="mr-2" /> New Folder</button>
                <button onClick={() => fileInputRef.current.click()} className="w-full flex items-center px-4 py-2 hover:bg-blue-600 transition text-sm"><Upload size={16} className="mr-2" /> Upload File</button>
              </>
            ) : (
              <>
                <div className="px-4 py-2 text-[10px] text-gray-500 uppercase border-b border-white/5 mb-1 truncate font-bold">{selectedItem.name}</div>
                {selectedItem.type === 'folder' && <button onClick={() => enterFolder(selectedItem)} className="w-full flex items-center px-4 py-2 hover:bg-blue-600 transition text-sm"><FolderOpen size={16} className="mr-2" /> Open</button>}
                <button onClick={handleDelete} className="w-full flex items-center px-4 py-2 hover:bg-red-600 text-red-500 hover:text-white transition text-sm"><Trash2 size={16} className="mr-2" /> Delete {selectedItem.type}</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE FOLDER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12141c] p-8 rounded-2xl w-80 border border-blue-500/50 shadow-2xl">
              <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2"><FolderPlus size={20} /> New Folder</h2>
              <form onSubmit={handleCreateFolder}>
                <input className="w-full p-3 bg-gray-800 rounded-lg mb-4 outline-none border border-white/5 focus:border-blue-500" value={folderName} onChange={(e)=>setFolderName(e.target.value)} placeholder="Folder name..." autoFocus />
                <div className="flex justify-end gap-3 font-bold">
                    <button type="button" className="text-gray-400 hover:text-white" onClick={()=>setIsModalOpen(false)}>Back</button>
                    <button type="submit" className="bg-blue-600 px-6 py-2 rounded-lg shadow-lg active:scale-95">Add</button>
                </div>
              </form>
          </div>
        </div>
      )}
    </div>
  )
}
