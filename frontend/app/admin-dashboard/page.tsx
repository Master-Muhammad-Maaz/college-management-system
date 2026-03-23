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

  // FIX: Added RepoItem type to folder
  const enterFolder = (folder: RepoItem) => {
    setPath([...path, { id: folder._id, name: folder.name }])
    setCurrentFolder(folder._id)
  }

  // FIX: Added number type to index
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

  const handleDelete = async () => {
    if (!selectedItem) return
    const url = selectedItem.type === 'folder' 
      ? `${API_BASE_URL}/api/delete-folder/${selectedItem._id}` 
      : `${API_BASE_URL}/api/delete-file/${selectedItem._id}`
    
    if (confirm(`Delete this ${selectedItem.type}?`)) {
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1d] to-[#000000] text-white p-6 md:p-10 font-sans" 
      onContextMenu={(e) => { 
        e.preventDefault(); 
        setMenuPos({ x: e.clientX, y: e.clientY, visible: true }); 
        setSelectedItem(null); 
      }}>
      
      {/* Rest of your JSX remains the same */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between mb-8 gap-6 border-b border-white/10 pb-6">
         {/* ... Your JSX Content ... */}
      </div>
      {/* ... and so on ... */}
    </div>
  )
}
