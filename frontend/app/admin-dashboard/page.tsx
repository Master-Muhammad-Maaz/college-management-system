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
  // FINAL FIX: Yahan Render ka URL daal diya hai
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
      // API call with updated URL
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
      alert("Upload failed!")
    }
  }

  // --- JSX Content Base Structure ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1d] to-[#000000] text-white p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between mb-8 gap-6 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-500/20">
                  <LayoutDashboard size={28} />
              </div>
              <div>
                  <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                  <p className="text-gray-400 text-sm">Manage your files and students</p>
              </div>
          </div>
          <div className="flex gap-3">
              <Link href="/admin-dashboard/students" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-lg transition-all border border-white/10 text-sm font-medium">
                  <Users size={18} /> Students
              </Link>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-600/20 text-sm font-medium">
                  <FolderPlus size={18} /> New Folder
              </button>
          </div>
      </div>

      {/* Path Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 overflow-x-auto whitespace-nowrap pb-2">
          {path.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                  <button onClick={() => navigateTo(index)} className={`hover:text-white transition-colors ${index === path.length - 1 ? 'text-indigo-400 font-semibold' : ''}`}>
                      {step.name === "Root" ? <Home size={16} /> : step.name}
                  </button>
                  {index < path.length - 1 && <ChevronRight size={14} className="text-gray-600" />}
              </div>
          ))}
      </div>

      {/* Folders and Files Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {folders.map(folder => (
              <div key={folder._id} onDoubleClick={() => enterFolder(folder)} className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all cursor-pointer group">
                  <FolderOpen size={48} className="text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-center truncate w-full">{folder.name}</span>
              </div>
          ))}
          {files.map(file => (
              <div key={file._id} className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-pointer group">
                  <FileText size={48} className="text-indigo-400 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-center truncate w-full">{file.name}</span>
              </div>
          ))}
      </div>

      {/* Modal for Folder Creation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#151b2d] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FolderPlus className="text-indigo-400" /> Create New Folder
            </h2>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input 
                type="text" 
                placeholder="Folder Name" 
                value={folderName} 
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-900 border border-white/10 outline-none focus:border-indigo-500"
                autoFocus
              />
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors font-semibold">Create Folder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
