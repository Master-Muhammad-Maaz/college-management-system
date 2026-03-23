"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FolderPlus, Upload, FolderOpen, Trash2, X, Home, 
  FileText, File as FileIcon, ChevronRight, Loader2, 
  Users, LayoutDashboard 
} from "lucide-react"
import axios from "axios"
import Link from "next/link"

// Define Types for better stability
interface RepoItem {
  _id: string;
  name: string;
  type: 'folder' | 'file';
}

interface PathStep {
  id: string;
  name: string;
}

export default function AdminDashboard() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [folders, setFolders] = useState<RepoItem[]>([])
  const [files, setFiles] = useState<RepoItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [currentFolder, setCurrentFolder] = useState("root")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [path, setPath] = useState<PathStep[]>([{ id: "root", name: "Root" }])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0, visible: false })
  const [selectedItem, setSelectedItem] = useState<RepoItem | null>(null)

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

  const enterFolder = (folder: RepoItem) => {
    setPath([...path, { id: folder._id, name: folder.name }])
    setCurrentFolder(folder._id)
  }

  const navigateTo = (index: number) => {
    const newPath = path.slice(0, index + 1)
    setPath(newPath)
    setCurrentFolder(newPath[newPath.length - 1].id)
  }

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!folderName.trim()) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/create-folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: folderName, parentId: currentFolder === "root" ? null : currentFolder })
      })
      const data = await res.json()
      if (data.success) { 
        setFolderName(""); 
        setIsModalOpen(false); 
        fetchData(); 
      }
    } catch (err) {
      console.error("Create folder error:", err);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folderId", currentFolder)
    
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        onUploadProgress: (p) => {
            if (p.total) setUploadProgress(Math.round((p.loaded * 100) / p.total))
        },
      })
      if (res.data.success) {
        fetchData()
        setTimeout(() => { setIsUploading(false); setUploadProgress(0) }, 1000)
      }
    } catch (err) {
      setIsUploading(false)
      console.error("Upload error:", err)
      alert("Upload failed! Check console for details.")
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    const url = selectedItem.type === 'folder' 
      ? `${API_BASE_URL}/api/delete-folder/${selectedItem._id}` 
      : `${API_BASE_URL}/api/delete-file/${selectedItem._id}`
    
    if (confirm(`Are you sure you want to delete this ${selectedItem.type}?`)) {
      try {
        const res = await fetch(url, { method: "DELETE" })
        const data = await res.json()
        if (data.success) fetchData()
      } catch (err) {
        console.error("Delete error:", err)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1d] to-[#000000] text-white p-6 md:p-10 font-sans selection:bg-blue-500/30" 
      onContextMenu={(e) => { 
        e.preventDefault(); 
        setMenuPos({ x: e.clientX, y: e.clientY, visible: true }); 
        setSelectedItem(null); 
      }}>
      
      {/* Header Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between mb-8 gap-6 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
          <div className="bg-blue-600 p-2 rounded-lg"><FileText size={24} /></div> Admin Repository
        </h1>

        <div className="flex items-center gap-4 bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
          <Link href="/admin-dashboard">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-transform active:scale-95">
              <LayoutDashboard size={16} /> Repository
            </button>
          </Link>
          <Link href="/admin/students">
            <button className="flex items-center gap-2 px-5 py-2.5 hover:bg-white/10 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-all">
              <Users size={16} /> Students
            </button>
          </Link>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5 overflow-x-auto whitespace-nowrap">
        <Home size={16} className="text-gray-500 ml-2" />
        {path.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2">
            <button 
                onClick={() => navigateTo(index)} 
                className={`hover:text-blue-400 transition text-sm font-medium ${index === path.length - 1 ? "text-blue-400" : "text-gray-400"}`}
            >
                {step.name}
            </button>
            {index < path.length - 1 && <ChevronRight size={14} className="text-gray-600" />}
          </div>
        ))}
      </div>

      {/* Upload Progress Overlay */}
      <AnimatePresence>
        {isUploading && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto mb-6 bg-blue-900/20 p-4 rounded-xl border border-blue-500/30 backdrop-blur-md">
            <div className="flex justify-between mb-2 text-xs font-bold uppercase tracking-widest text-blue-400">
              <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <motion.div className="bg-blue-500 h-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {folders.map((f) => (
          <motion.div 
            key={f._id} 
            onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); setSelectedItem({ ...f, type: 'folder' }); setMenuPos({ x: e.clientX, y: e.clientY, visible: true }); }} 
            onDoubleClick={() => enterFolder(f)} 
            className="flex flex-col items-center group cursor-pointer" 
            whileHover={{ y: -5 }}
          >
            <div className="bg-blue-800/10 p-6 rounded-2xl group-hover:bg-blue-700/30 border border-white/5 transition-all shadow-xl flex items-center justify-center aspect-square w-full">
                <FolderOpen size={48} className="text-sky-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="mt-3 text-sm font-medium text-gray-200 text-center truncate w-full px-2">{f.name}</span>
          </motion.div>
        ))}

        {files.map((file) => (
          <motion.div 
            key={file._id} 
            onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); setSelectedItem({ ...file, type: 'file' }); setMenuPos({ x: e.clientX, y: e.clientY, visible: true }); }} 
            className="flex flex-col items-center group cursor-pointer" 
            whileHover={{ y: -5 }}
          >
            <div className="bg-gray-800/30 p-6 rounded-2xl group-hover:bg-gray-700/50 border border-white/5 transition-all shadow-xl flex items-center justify-center aspect-square w-full">
                <FileIcon size={48} className="text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="mt-3 text-xs text-center break-all w-full line-clamp-2 text-gray-300">{file.name}</span>
          </motion.div>
        ))}
      </div>

      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

      {/* Context Menu */}
      <AnimatePresence>
        {menuPos.visible && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            style={{ top: menuPos.y, left: menuPos.x }} 
            className="fixed bg-[#161b22] border border-white/10 shadow-2xl rounded-xl py-2 w-56 z-50 backdrop-blur-xl"
          >
            {!selectedItem ? (
              <>
                <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center px-4 py-2.5 hover:bg-blue-600 transition text-sm"><FolderPlus size(16} className="mr-3" /> New Folder</button>
                <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center px-4 py-2.5 hover:bg-blue-600 transition text-sm"><Upload size={16} className="mr-3" /> Upload File</button>
              </>
            ) : (
              <>
                <div className="px-4 py-2 text-[10px] text-gray-500 uppercase border-b border-white/5 mb-1 truncate font-bold tracking-widest">{selectedItem.name}</div>
                {selectedItem.type === 'folder' && <button onClick={() => enterFolder(selectedItem)} className="w-full flex items-center px-4 py-2.5 hover:bg-blue-600 transition text-sm"><FolderOpen size={16} className="mr-3" /> Open</button>}
                <button onClick={handleDelete} className="w-full flex items-center px-4 py-2.5 hover:bg-red-600/20 text-red-500 transition text-sm"><Trash2 size={16} className="mr-3" /> Delete {selectedItem.type}</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#0d1117] p-8 rounded-2xl w-full max-w-sm border border-white/10 shadow-2xl relative">
              <button onClick={()=>setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
              <h2 className="text-xl font-bold mb-6 text-blue-400">Create New Folder</h2>
              <form onSubmit={handleCreateFolder}>
                <input 
                  className="w-full p-4 bg-gray-900 rounded-xl mb-6 outline-none border border-white/5 focus:border-blue-500 transition-colors" 
                  placeholder="Folder name..."
                  value={folderName} 
                  onChange={(e)=>setFolderName(e.target.value)} 
                  autoFocus 
                />
                <div className="flex justify-end gap-3">
                  <button type="button" className="px-5 py-2 text-gray-400 hover:text-white" onClick={()=>setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="bg-blue-600 px-8 py-2 rounded-xl shadow-lg hover:bg-blue-500 active:scale-95 transition-all">Create</button>
                </div>
              </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
