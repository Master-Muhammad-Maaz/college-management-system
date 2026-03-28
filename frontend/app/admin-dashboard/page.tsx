"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FolderPlus, Upload, Folder, Trash2, X, ChevronLeft, 
  Home, FileText, File as FileIcon, ChevronRight, Loader2, 
  Users, LayoutDashboard 
} from "lucide-react"
import axios from "axios"
import Link from "next/link"

// Types to prevent Vercel Build Errors
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
  const API_BASE_URL = "https://college-management-system-ae1l.onrender.com";

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
    const res = await fetch(`${API_BASE_URL}/api/create-folder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name: folderName, 
        parentId: currentFolder === "root" ? null : currentFolder 
      })
    })
    const data = await res.json()
    if (data.success) { setFolderName(""); setIsModalOpen(false); fetchData() }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folderId", currentFolder === "root" ? "" : currentFolder)
    
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
    <div className="min-h-screen bg-[#030712] text-white p-6 md:p-10" onContextMenu={(e) => { e.preventDefault(); setMenuPos({ x: e.pageX, y: e.pageY, visible: true }); setSelectedItem(null); }}>
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <h1 className="text-3xl font-black italic uppercase tracking-tight flex items-center gap-3">
          <FileText className="text-blue-500" /> Admin Repository
        </h1>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          <Link href="/admin-dashboard">
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-transform active:scale-95">
              <LayoutDashboard size={14} /> Repository
            </button>
          </Link>
          <Link href="/admin/students">
            <button className="flex items-center gap-2 px-6 py-2 hover:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">
              <Users size={14} /> Students
            </button>
          </Link>
        </div>
      </div>

      {/* BREADCRUMB NAVIGATION (Matches image_9b2554.jpg) */}
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

      {/* UPLOAD PROGRESS NOTIFICATION */}
      <AnimatePresence>
        {isUploading && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto mb-8 bg-blue-600/10 p-4 rounded-2xl border border-blue-500/20">
            <div className="flex justify-between mb-2 text-[10px] font-black uppercase tracking-widest text-blue-400">
              <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> Sycing...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
              <motion.div className="bg-blue-500 h-full" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} transition={{ duration: 0.3 }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREMIUM REPOSITORY GRID (Matches image_9b2554.jpg) */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12">
        {folders.map((f) => (
          <motion.div key={f._id} 
            onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); setSelectedItem({ ...f, type: 'folder' }); setMenuPos({ x: e.pageX, y: e.pageY, visible: true }); }} 
            onDoubleClick={() => enterFolder(f)} 
            className="flex flex-col items-center group cursor-pointer" 
            whileHover={{ y: -5 }}>
            
            {/* Folder Shape Container */}
            <div className="w-24 h-24 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center justify-center transition-all group-hover:bg-blue-600/20 group-hover:border-blue-500/40 shadow-xl shadow-blue-500/5">
                <Folder size={44} className="text-blue-500" fill="currentColor" fillOpacity={0.15} />
            </div>
            
            {/* Label - Centered & Bold */}
            <span className="mt-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] text-center w-full px-2 group-hover:text-blue-400 transition-colors">
              {f.name}
            </span>
          </motion.div>
        ))}

        {files.map((file) => (
          <motion.div key={file._id} 
            onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); setSelectedItem({ ...file, type: 'file' }); setMenuPos({ x: e.pageX, y: e.pageY, visible: true }); }} 
            className="flex flex-col items-center group cursor-pointer" 
            whileHover={{ y: -5 }}>
            
            {/* File Shape Container */}
            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center transition-all group-hover:bg-white/10 group-hover:border-white/20 shadow-lg">
                <FileIcon size={40} className="text-indigo-400" />
            </div>
            
            <span className="mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center break-all line-clamp-2 w-full px-2 group-hover:text-white transition-colors">
              {file.name}
            </span>
          </motion.div>
        ))}
      </div>

      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

      {/* PREMIUM CONTEXT MENU */}
      <AnimatePresence>
        {menuPos.visible && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ top: menuPos.y, left: menuPos.x }} className="fixed bg-[#0a0c14] border border-white/10 shadow-2xl rounded-2xl py-2 w-56 z-50 backdrop-blur-xl">
            {!selectedItem ? (
              <>
                <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center px-5 py-3 hover:bg-blue-600 transition text-[11px] font-black uppercase tracking-widest"><FolderPlus size={16} className="mr-3 text-blue-400" /> New Folder</button>
                <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center px-5 py-3 hover:bg-blue-600 transition text-[11px] font-black uppercase tracking-widest"><Upload size={16} className="mr-3 text-sky-400" /> Upload File</button>
              </>
            ) : (
              <>
                <div className="px-5 py-2 text-[9px] text-gray-500 uppercase border-b border-white/5 mb-1 truncate font-black tracking-widest">{selectedItem.name}</div>
                {selectedItem.type === 'folder' && <button onClick={() => enterFolder(selectedItem)} className="w-full flex items-center px-5 py-3 hover:bg-blue-600 transition text-[11px] font-black uppercase tracking-widest"><Folder size={16} className="mr-3 text-blue-400" /> Open</button>}
                <button onClick={handleDelete} className="w-full flex items-center px-5 py-3 hover:bg-red-600/20 text-red-500 transition text-[11px] font-black uppercase tracking-widest"><Trash2 size={16} className="mr-3" /> Delete</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW FOLDER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/90 backdrop-blur-md p-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0a0c14] p-10 rounded-[40px] w-full max-w-sm border border-white/10 shadow-2xl">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6 text-blue-500">New Directory</h2>
              <form onSubmit={handleCreateFolder}>
                <input className="w-full p-4 bg-white/5 rounded-2xl mb-6 outline-none border border-white/10 focus:border-blue-500/50 transition-all text-sm font-medium" value={folderName} onChange={(e)=>setFolderName(e.target.value)} autoFocus placeholder="Enter folder name..." />
                <div className="flex justify-end gap-6 items-center">
                    <button type="button" onClick={()=>setIsModalOpen(false)} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors">Cancel</button>
                    <button type="submit" className="bg-blue-600 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">Create</button>
                </div>
              </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
