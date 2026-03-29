"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FolderPlus, Upload, Folder, Trash2, X, 
  Home, FileText, File as FileIcon, ChevronRight, Loader2, 
  LayoutDashboard, Plus
} from "lucide-react"
import axios from "axios"
import Link from "next/link"

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
    } catch (err) { console.error(err) }
  }

  // FIXED: Corrected navigateTo logic to prevent compilation errors
  const navigateTo = (index: number) => {
    const newPath = path.slice(0, index + 1)
    setPath(newPath)
    setCurrentFolder(newPath[newPath.length - 1].id)
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

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!folderName.trim()) return
    const res = await fetch(`${API_BASE_URL}/api/create-folder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: folderName, parentId: currentFolder === "root" ? null : currentFolder })
    })
    if ((await res.json()).success) { setFolderName(""); setIsModalOpen(false); fetchData() }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folderId", currentFolder === "root" ? "" : currentFolder)
    
    setIsUploading(true)
    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        onUploadProgress: (p) => { if (p.total) setUploadProgress(Math.round((p.loaded * 100) / p.total)) },
      })
      if (res.data.success) { fetchData(); setIsUploading(false); }
    } catch (err) { setIsUploading(false); alert("Upload failed!") }
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
    <div className="min-h-screen bg-[#050a18] text-white p-6 md:p-10 font-sans">
      
      {/* HEADER SECTION (Dark Theme) */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-12 gap-6 border-b border-white/5 pb-8">
        <h1 className="text-3xl font-black italic tracking-tighter flex items-center gap-3 text-blue-500 uppercase">
          <LayoutDashboard className="text-white" /> Admin Console
        </h1>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">
            Repository
          </button>
          <Link href="/admin/students">
            <button className="px-6 py-2.5 text-white/40 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              Management
            </button>
          </Link>
        </div>
      </div>

      {/* BREADCRUMBS (Glassmorphism Style) */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-3xl border border-white/5 overflow-x-auto w-full md:w-auto">
          {path.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3 whitespace-nowrap">
              <button onClick={() => navigateTo(index)} className={`text-[11px] font-black uppercase tracking-widest transition-colors ${index === path.length - 1 ? "text-blue-500" : "text-white/30 hover:text-white"}`}>
                {step.name === "Root" ? <Home size={16} /> : step.name}
              </button>
              {index < path.length - 1 && <ChevronRight size={14} className="text-white/10" />}
            </div>
          ))}
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
           <button onClick={() => setIsModalOpen(true)} className="flex-1 md:w-14 md:h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20 hover:scale-105 transition-transform">
             <Plus size={24} />
           </button>
           <button onClick={() => fileInputRef.current?.click()} className="flex-[2] md:flex-none px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all">
             <Upload size={16} /> Bulk Upload
           </button>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <AnimatePresence>
        {isUploading && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto mb-8 bg-blue-600/10 p-5 rounded-3xl border border-blue-500/20">
            <div className="flex justify-between mb-3 text-[10px] font-black uppercase text-blue-400">
              <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> Syncing Data...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <motion.div className="bg-blue-500 h-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" animate={{ width: `${uploadProgress}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REPOSITORY GRID (Dark Variant) */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8">
        {folders.map((f) => (
          <motion.div key={f._id} 
            onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); setSelectedItem({ ...f, type: 'folder' }); setMenuPos({ x: e.pageX, y: e.pageY, visible: true }); }} 
            onDoubleClick={() => enterFolder(f)} 
            className="flex flex-col items-center group cursor-pointer" whileHover={{ y: -8 }}>
            <div className="w-28 h-28 bg-[#0c1633] border border-white/5 rounded-[40px] flex items-center justify-center transition-all group-hover:bg-blue-600 group-hover:shadow-[0_20px_40px_rgba(37,99,235,0.25)]">
                <Folder size={44} className="text-blue-500 group-hover:text-white" fill="currentColor" fillOpacity={0.1} />
            </div>
            <span className="mt-5 text-[11px] font-black text-white/60 uppercase tracking-tight text-center group-hover:text-white transition-colors">{f.name}</span>
          </motion.div>
        ))}

        {files.map((file) => (
          <motion.div key={file._id} 
            onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); setSelectedItem({ ...file, type: 'file' }); setMenuPos({ x: e.pageX, y: e.pageY, visible: true }); }} 
            className="flex flex-col items-center group cursor-pointer" whileHover={{ y: -8 }}>
            <div className="w-28 h-28 bg-white/5 border border-white/5 rounded-[40px] flex items-center justify-center transition-all group-hover:border-blue-500 shadow-sm">
                <FileIcon size={40} className="text-white/20 group-hover:text-blue-500 transition-colors" />
            </div>
            <span className="mt-5 text-[10px] font-bold text-white/30 text-center break-all line-clamp-2 w-full px-2 group-hover:text-white/60 transition-colors">{file.name}</span>
          </motion.div>
        ))}
      </div>

      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

      {/* CONTEXT MENU (Dark Glassmorphism) */}
      <AnimatePresence>
        {menuPos.visible && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ top: menuPos.y, left: menuPos.x }} className="fixed bg-[#0c1633]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[30px] py-4 w-60 z-50">
            {!selectedItem ? (
              <div className="px-2 space-y-1">
                <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center px-6 py-3 hover:bg-blue-600 rounded-2xl transition text-[11px] font-bold uppercase tracking-widest text-white"><FolderPlus size={16} className="mr-3 text-blue-400" /> New Folder</button>
                <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center px-6 py-3 hover:bg-white/10 rounded-2xl transition text-[11px] font-bold uppercase tracking-widest text-white/60"><Upload size={16} className="mr-3" /> Upload File</button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <div className="px-6 py-2 text-[9px] text-white/30 uppercase font-black border-b border-white/5 mb-2 truncate">{selectedItem.name}</div>
                <button onClick={handleDelete} className="w-full flex items-center px-6 py-3 hover:bg-red-600 rounded-2xl text-white transition text-[11px] font-bold uppercase tracking-widest group"><Trash2 size={16} className="mr-3 text-red-500 group-hover:text-white" /> Delete Item</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL (Dark Theme) */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-[#050a18]/80 backdrop-blur-md p-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0c1633] p-12 rounded-[50px] w-full max-w-sm shadow-2xl border border-white/10">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 text-white">New Folder</h2>
              <form onSubmit={handleCreateFolder}>
                <input className="w-full p-6 bg-white/5 rounded-2xl mb-8 outline-none border border-white/10 focus:border-blue-500 transition-all font-bold text-white placeholder:text-white/20" value={folderName} onChange={(e)=>setFolderName(e.target.value)} autoFocus placeholder="Name of directory" />
                <div className="flex justify-between items-center">
                    <button type="button" onClick={()=>setIsModalOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Cancel</button>
                    <button type="submit" className="bg-blue-600 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20">Create</button>
                </div>
              </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
