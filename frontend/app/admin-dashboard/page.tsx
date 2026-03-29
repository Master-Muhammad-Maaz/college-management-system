"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FolderPlus, Upload, Folder, Trash2, X, 
  Home, FileText, File as FileIcon, ChevronRight, Loader2, 
  Users, LayoutDashboard, Plus 
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
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-10 font-sans" onContextMenu={(e) => { e.preventDefault(); setMenuPos({ x: e.pageX, y: e.pageY, visible: true }); setSelectedItem(null); }}>
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <h1 className="text-3xl font-black italic tracking-tight flex items-center gap-3">
          <LayoutDashboard className="text-blue-600" /> Admin Console
        </h1>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
          <button className="px-6 py-2.5 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
            Repository
          </button>
          <Link href="/admin/students">
            <button className="px-6 py-2.5 text-slate-400 hover:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              User Management
            </button>
          </Link>
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-full border border-slate-100 overflow-x-auto max-w-2xl">
          {path.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3">
              <button onClick={() => navigateTo(index)} className={`text-[11px] font-black uppercase tracking-widest ${index === path.length - 1 ? "text-blue-600" : "text-slate-400"}`}>
                {step.name === "Root" ? <Home size={16} /> : step.name}
              </button>
              {index < path.length - 1 && <ChevronRight size={14} className="text-slate-200" />}
            </div>
          ))}
        </div>
        
        <div className="flex gap-4">
           <button onClick={() => setIsModalOpen(true)} className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-200 hover:scale-110 transition-transform">
             <Plus size={24} />
           </button>
           <button onClick={() => fileInputRef.current?.click()} className="px-6 py-3 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-colors">
             <Upload size={16} /> Bulk Upload
           </button>
        </div>
      </div>

      {/* PROGRESS */}
      <AnimatePresence>
        {isUploading && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto mb-8 bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <div className="flex justify-between mb-2 text-[10px] font-black uppercase text-blue-600">
              <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> Syncing Data...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-blue-200/30 rounded-full h-1.5 overflow-hidden">
              <motion.div className="bg-blue-600 h-full" animate={{ width: `${uploadProgress}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8">
        {folders.map((f) => (
          <motion.div key={f._id} 
            onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); setSelectedItem({ ...f, type: 'folder' }); setMenuPos({ x: e.pageX, y: e.pageY, visible: true }); }} 
            onDoubleClick={() => enterFolder(f)} 
            className="flex flex-col items-center group cursor-pointer" whileHover={{ y: -5 }}>
            <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[35px] flex items-center justify-center transition-all group-hover:bg-blue-600 group-hover:shadow-xl group-hover:shadow-blue-100">
                <Folder size={40} className="text-blue-600 group-hover:text-white" fill="currentColor" fillOpacity={0.1} />
            </div>
            <span className="mt-4 text-[11px] font-black text-slate-800 uppercase tracking-tight text-center">{f.name}</span>
          </motion.div>
        ))}

        {files.map((file) => (
          <motion.div key={file._id} 
            onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); setSelectedItem({ ...file, type: 'file' }); setMenuPos({ x: e.pageX, y: e.pageY, visible: true }); }} 
            className="flex flex-col items-center group cursor-pointer" whileHover={{ y: -5 }}>
            <div className="w-24 h-24 bg-white border border-slate-200 rounded-[35px] flex items-center justify-center transition-all group-hover:border-blue-500 shadow-sm">
                <FileIcon size={36} className="text-slate-400 group-hover:text-blue-600" />
            </div>
            <span className="mt-4 text-[10px] font-bold text-slate-400 text-center break-all line-clamp-2 w-full px-2">{file.name}</span>
          </motion.div>
        ))}
      </div>

      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

      {/* CONTEXT MENU */}
      <AnimatePresence>
        {menuPos.visible && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ top: menuPos.y, left: menuPos.x }} className="fixed bg-white border border-slate-200 shadow-2xl rounded-3xl py-3 w-56 z-50">
            {!selectedItem ? (
              <>
                <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center px-6 py-3 hover:bg-slate-50 transition text-[11px] font-bold uppercase tracking-widest text-slate-800"><FolderPlus size={16} className="mr-3 text-blue-600" /> Create Directory</button>
                <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center px-6 py-3 hover:bg-slate-50 transition text-[11px] font-bold uppercase tracking-widest text-slate-800"><Upload size={16} className="mr-3 text-slate-400" /> Import File</button>
              </>
            ) : (
              <>
                <div className="px-6 py-2 text-[9px] text-slate-400 uppercase font-black border-b border-slate-50 mb-2 truncate">{selectedItem.name}</div>
                <button onClick={handleDelete} className="w-full flex items-center px-6 py-3 hover:bg-red-50 text-red-600 transition text-[11px] font-bold uppercase tracking-widest"><Trash2 size={16} className="mr-3" /> Remove Item</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-slate-900/40 backdrop-blur-sm p-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-[50px] w-full max-w-sm shadow-2xl border border-slate-100">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 text-slate-900">New Folder</h2>
              <form onSubmit={handleCreateFolder}>
                <input className="w-full p-5 bg-slate-50 rounded-2xl mb-8 outline-none border border-slate-200 focus:border-blue-600 transition-all font-bold text-slate-900" value={folderName} onChange={(e)=>setFolderName(e.target.value)} autoFocus placeholder="Name of directory" />
                <div className="flex justify-between items-center">
                    <button type="button" onClick={()=>setIsModalOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cancel</button>
                    <button type="submit" className="bg-blue-600 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-200">Create</button>
                </div>
              </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
