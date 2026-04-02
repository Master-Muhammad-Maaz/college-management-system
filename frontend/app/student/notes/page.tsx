"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Folder, File as FileIcon, Home, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function StudentNotesView() {
  const router = useRouter()
  const API_BASE_URL = "https://college-management-system-ae1l.onrender.com";
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [currentFolder, setCurrentFolder] = useState("root")
  const [path, setPath] = useState([{ id: "root", name: "Library" }])

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

  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 mb-8">
          <ArrowLeft size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-indigo-600 text-white rounded-[25px] shadow-lg"><Folder size={28} /></div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Academic Library</h1>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-12">
          {path.map((step, i) => (
            <button key={step.id} onClick={() => { setPath(path.slice(0, i + 1)); setCurrentFolder(step.id); }} className="text-[11px] font-black uppercase text-indigo-600">{step.name}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {folders.map((f: any) => (
            <motion.div key={f._id} whileHover={{ y: -5 }} onDoubleClick={() => { setPath([...path, { id: f._id, name: f.name }]); setCurrentFolder(f._id); }} className="flex flex-col items-center group cursor-pointer">
              <div className="w-28 h-28 bg-slate-50 rounded-[40px] flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                <Folder size={44} className="text-indigo-600 group-hover:text-white" />
              </div>
              <span className="mt-4 text-[11px] font-black text-slate-600 uppercase text-center">{f.name}</span>
            </motion.div>
          ))}
          {files.map((file: any) => (
            <motion.a key={file._id} href={`${API_BASE_URL}${file.path}`} target="_blank" whileHover={{ y: -5 }} className="flex flex-col items-center group cursor-pointer">
              <div className="w-28 h-28 bg-white border border-slate-50 rounded-[40px] flex items-center justify-center group-hover:border-indigo-400">
                <FileIcon size={40} className="text-slate-300 group-hover:text-indigo-500" />
              </div>
              <span className="mt-4 text-[10px] font-bold text-slate-400 text-center line-clamp-2 px-2">{file.name}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  )
}
