"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FolderPlus, Upload, Folder, Trash2, 
  Home, File as FileIcon, ChevronRight, Loader2, 
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

  // FIXED: Compilation error fix from your build logs
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
      if (res.data.success) { fetchData(); setIsUploading(false); setUploadProgress(0); }
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
    <div className="min-h-screen bg-white text-[#1e293b] p-6 md:p-12 font-sans">
      
      {/* HEADER: Matches Student Repository Typography */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-2xl">
            <LayoutDashboard className="text-blue-600" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">Admin Repository</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Digital Academic Control</p>
          </div>
        </div>

        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200">
          <button className="px-6 py-2.5 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100">
            Files
          </button>
          <Link href="/admin/students">
            <button className="px-6 py-2.5 text-slate-400 hover:text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              Users
            </button>
          </Link>
        </div>
      </div>

      <hr className="max-w-7xl mx-auto border-slate-100 mb-10" />

      {/* BREADCRUMBS: Matches the light pill design */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 bg-[#f8fafc] px-6 py-4 rounded-2xl border border-slate-100 w-full md:w-auto overflow-x-auto">
          {path.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2 whitespace-nowrap">
              <button 
                onClick={() => navigateTo(index)} 
                className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${index === path.length - 1 ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
              >
                {step.name === "Root" ? <Home size={16} className="text-blue-600" /> : step.name}
              </button>
              {index < path.length - 1 && <ChevronRight size={14} className="text-slate-300" />}
            </div>
          ))}
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
           <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none h-14 px-8 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all font-bold text-[11px] uppercase tracking-widest">
             <Plus size={18} /> New Folder
           </button>
           <button onClick={() => fileInputRef.current?.click()} className="flex-1 md:flex-none h-14 px-8 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
             <Upload size={18} /> Upload
           </button>
        </div>
      </div>

      {/* UPLOAD PROGRESS */}
      <AnimatePresence>
        {isUploading && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto mb-10 bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <div className="flex justify-between mb-3 text-[10px] font-black uppercase text-blue-600 tracking-widest">
              <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> Processing File...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
              <motion.div className="bg-blue-600 h-full" animate={{ width: `${uploadProgress}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REPO GRID: Soft light icons matching Student view */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-10">
        {folders.map((f) => (
          <motion.div 
            key={f._id} 
            onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); setSelectedItem({ ...f, type: 'folder' }); setMenuPos({ x: e.pageX, y: e.pageY, visible: true }); }} 
            onDoubleClick={() => enterFolder(f)} 
            className="flex flex-col items-center group cursor-pointer" 
            whileHover={{ y: -5 }}
          >
            <div className="w-28 h-28 bg-[#f1f5f9] rounded-[38px] flex items-center justify-center transition-all group-hover:bg-blue-600 group-hover:shadow-2xl group-hover:shadow-blue-200">
                <Folder size={44} className="text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <span className="mt-5 text-[11px] font-black text-slate-600 uppercase tracking-tight text-center group-hover:text-blue-600 transition-colors">{f.name}</span>
          </motion.div>
        ))}

        {files.map((file) => (
          <motion.div 
            key={file._id} 
            onContextMenu={(e) => { e.stopPropagation(); e.preventDefault(); setSelectedItem({ ...file, type: 'file' }); setMenuPos({ x: e.pageX, y: e.pageY, visible: true }); }} 
            className="flex flex-col items-center group cursor-pointer" 
            whileHover={{ y: -5 }}
          >
            <div className="w-28 h-28 bg-white border border-slate-100 rounded-[38px] flex items-center justify-center transition-all group-hover:border-blue-400 shadow-sm">
                <FileIcon size={40} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <span className="mt-5 text-[10px] font-bold text-slate-400 text-center break-all line-clamp-2 w-full px-2 group-hover:text-slate-600">{file.name}</span>
          </motion.div>
        ))}
      </div>

      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

      {/* LIGHT CONTEXT MENU */}
      <AnimatePresence>
        {menuPos.visible && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ top: menuPos.y, left: menuPos.x }} className="fixed bg-white border border-slate-200 shadow-2xl rounded-3xl py-3 w-60 z-50">
            {!selectedItem ? (
              <div className="px-2 space-y-1">
                <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center px-5 py-3 hover:bg-blue-50 rounded-xl transition text-[11px] font-bold uppercase tracking-widest text-slate-700"><FolderPlus size={16} className="mr-3 text-blue-600" /> New Folder</button>
                <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center px-5 py-3 hover:bg-slate-50 rounded-xl transition text-[11px] font-bold uppercase tracking-widest text-slate-500"><Upload size={16} className="mr-3" /> Upload File</button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <div className="px-5 py-2 text-[9px] text-slate-400 uppercase font-black border-b border-slate-50 mb-2 truncate">{selectedItem.name}</div>
                <button onClick={handleDelete} className="w-full flex items-center px-5 py-3 hover:bg-red-50 rounded-xl text-red-600 transition text-[11px] font-bold uppercase tracking-widest"><Trash2 size={16} className="mr-3" /> Delete Item</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] bg-slate-900/20 backdrop-blur-sm p-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-[50px] w-full max-w-sm shadow-2xl border border-slate-100">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 text-[#0f172a]">Create Folder</h2>
                <form onSubmit={handleCreateFolder}>
                  <input className="w-full p-6 bg-slate-50 rounded-2xl mb-8 outline-none border border-slate-200 focus:border-blue-600 transition-all font-bold text-slate-800 placeholder:text-slate-300" value={folderName} onChange={(e)=>setFolderName(e.target.value)} autoFocus placeholder="e.g. Assignments" />
                  <div className="flex justify-between items-center gap-4">
                      <button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                      <button type="submit" className="flex-1 bg-blue-600 px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Create</button>
                  </div>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
