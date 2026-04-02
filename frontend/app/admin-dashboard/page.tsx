"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FolderPlus, Upload, Folder, Trash2, Home, File as FileIcon, ChevronRight, Loader2, LayoutDashboard, Plus } from "lucide-react"
import axios from "axios"
import Link from "next/link"

export default function AdminDashboard() {
  const API_BASE_URL = "https://college-management-system-ae1l.onrender.com";
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [folderName, setFolderName] = useState("")
  // COURSE STATE REMOVED
  const [currentFolder, setCurrentFolder] = useState("root")
  const [isUploading, setIsUploading] = useState(false)
  const [path, setPath] = useState([{ id: "root", name: "Root" }])
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => { fetchData() }, [currentFolder])

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!folderName.trim()) return
    const res = await fetch(`${API_BASE_URL}/api/create-folder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name: folderName, 
        parentId: currentFolder === "root" ? null : currentFolder
        // COURSE DATA REMOVED FROM PAYLOAD
      })
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
      const res = await axios.post(`${API_BASE_URL}/api/upload`, formData)
      if (res.data.success) { fetchData(); setIsUploading(false); }
    } catch (err) { setIsUploading(false); alert("Upload failed!") }
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-2xl"><LayoutDashboard className="text-blue-600" size={28} /></div>
          <div>
            <h1 className="text-3xl font-black text-[#0f172a] uppercase tracking-tight">Admin Repository</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Control Center</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button className="px-6 py-2 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">Files</button>
          <Link href="/admin/students"><button className="px-6 py-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">Users</button></Link>
        </div>
      </div>

      {/* Path & Buttons Section */}
      <div className="max-w-7xl mx-auto mb-12 flex justify-between items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 overflow-x-auto">
          {path.map((step, i) => (
            <button key={step.id} onClick={() => { setPath(path.slice(0, i + 1)); setCurrentFolder(step.id); }} className="text-[11px] font-black uppercase tracking-widest text-blue-600 shrink-0">{step.name}</button>
          ))}
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsModalOpen(true)} className="h-14 px-8 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase flex items-center gap-3 shadow-lg shadow-blue-100 active:scale-95 transition-all"><Plus size={18}/> New Folder</button>
          <button onClick={() => fileInputRef.current?.click()} className="h-14 px-8 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3 shadow-sm hover:bg-slate-50 active:scale-95 transition-all"><Upload size={18}/> Upload</button>
        </div>
      </div>

      {/* Grid Display */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-10">
        {folders.map((f: any) => (
          <div key={f._id} onDoubleClick={() => { setPath([...path, { id: f._id, name: f.name }]); setCurrentFolder(f._id); }} className="flex flex-col items-center group cursor-pointer">
            <div className="w-28 h-28 bg-slate-100 rounded-[40px] flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300 shadow-sm"><Folder size={44} className="text-blue-600 group-hover:text-white" /></div>
            <span className="mt-4 text-[11px] font-black text-slate-600 uppercase text-center">{f.name}</span>
          </div>
        ))}
        {files.map((file: any) => (
          <div key={file._id} className="flex flex-col items-center group cursor-pointer">
            <div className="w-28 h-28 bg-white border border-slate-100 rounded-[40px] flex items-center justify-center group-hover:border-blue-400 transition-all shadow-sm"><FileIcon size={40} className="text-slate-300 group-hover:text-blue-400" /></div>
            <span className="mt-4 text-[10px] font-bold text-slate-400 text-center line-clamp-1">{file.name}</span>
          </div>
        ))}
      </div>

      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

      {/* Clean Modal - No Course Reference */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] bg-slate-900/20 backdrop-blur-sm p-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white p-12 rounded-[50px] w-full max-w-sm shadow-2xl">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 text-slate-900">Create Folder</h2>
              <form onSubmit={handleCreateFolder}>
                <input 
                  className="w-full p-6 bg-slate-50 rounded-2xl mb-10 outline-none border border-slate-200 font-bold text-slate-700 placeholder:text-slate-300 focus:border-blue-500 transition-all shadow-inner" 
                  value={folderName} 
                  onChange={(e)=>setFolderName(e.target.value)} 
                  placeholder="Enter folder name..." 
                  autoFocus
                />
                
                <div className="flex gap-4">
                  <button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 text-[11px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-blue-600 px-8 py-5 rounded-2xl text-[11px] font-black uppercase text-white shadow-xl shadow-blue-100 active:scale-95 transition-all">Create</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {isUploading && (
        <div className="fixed bottom-10 right-10 bg-slate-900 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl">
          <Loader2 className="animate-spin" size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Uploading File...</span>
        </div>
      )}
    </div>
  )
}
