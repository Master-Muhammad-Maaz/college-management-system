//testing
"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Folder, File as FileIcon } from "lucide-react"

export default function StudentNotesView() {
  const API_BASE_URL = "https://college-management-system-ae1l.onrender.com";
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])

  const fetchData = async () => {
    try {
      // Sirf root level ka data fetch hoga bina kisi navigation ke
      const resF = await fetch(`${API_BASE_URL}/api/folders/root`)
      const dataF = await resF.json()
      if (dataF.success) setFolders(dataF.folders)

      const resFiles = await fetch(`${API_BASE_URL}/api/files/root`)
      const dataFiles = await resFiles.json()
      if (dataFiles.success) setFiles(dataFiles.files)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Simple Header - No Back Button */}
        <div className="flex items-center gap-4 mb-16">
          <div className="p-4 bg-indigo-600 text-white rounded-[25px] shadow-lg shadow-indigo-100">
            <Folder size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Academic Library</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">View Only Mode</p>
          </div>
        </div>

        {/* Content Grid - All Click/Navigation Logic Removed */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Static Folders */}
          {folders.map((f: any) => (
            <div key={f._id} className="flex flex-col items-center opacity-80">
              <div className="w-28 h-28 bg-slate-50 rounded-[40px] flex items-center justify-center border border-slate-100">
                <Folder size={44} className="text-indigo-600" />
              </div>
              <span className="mt-4 text-[11px] font-black text-slate-600 uppercase text-center">{f.name}</span>
            </div>
          ))}

          {/* Static Files */}
          {files.map((file: any) => (
            <div key={file._id} className="flex flex-col items-center">
              <div className="w-28 h-28 bg-white border-2 border-slate-50 rounded-[40px] flex items-center justify-center">
                <FileIcon size={40} className="text-slate-300" />
              </div>
              <span className="mt-4 text-[10px] font-bold text-slate-400 text-center line-clamp-2 px-2">{file.name}</span>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {folders.length === 0 && files.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">No Content Available</p>
          </div>
        )}
      </div>
    </div>
  )
}
