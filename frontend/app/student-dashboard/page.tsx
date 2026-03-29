"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Folder, FileText, File as FileIcon, ChevronRight, 
  Home, Download, MoreVertical, Eye, Bell, X, BookOpen 
} from "lucide-react"

interface RepoItem {
  _id: string;
  name: string;
  path: string;
  isAssignment?: boolean; 
  teacherName?: string;
  course?: string;
}

interface PathStep {
  id: string;
  name: string;
}

export default function StudentDashboard() {
  const API_BASE_URL = "https://college-management-system-ae1l.onrender.com";

  const [folders, setFolders] = useState<RepoItem[]>([])
  const [files, setFiles] = useState<RepoItem[]>([])
  const [currentFolder, setCurrentFolder] = useState<string>("root")
  const [path, setPath] = useState<PathStep[]>([{ id: "root", name: "Root" }])
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [latestAssignment, setLatestAssignment] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [viewMode, setViewMode] = useState<"repository" | "assignments">("repository");
  const [allAssignments, setAllAssignments] = useState<RepoItem[]>([]);

  const fetchData = async () => {
    try {
      if (viewMode === "repository") {
        const resF = await fetch(`${API_BASE_URL}/api/folders/${currentFolder}`)
        const dataF = await resF.json()
        if (dataF.success) setFolders(dataF.folders)

        const resFiles = await fetch(`${API_BASE_URL}/api/files/${currentFolder}`)
        const dataFiles = await resFiles.json()
        if (dataFiles.success) setFiles(dataFiles.files)
      } else {
        const res = await fetch(`${API_BASE_URL}/api/assignments/latest`);
        const data = await res.json();
        if (data.success) {
          const list = Array.isArray(data.assignment) ? data.assignment : [data.assignment];
          setAllAssignments(list.map((asgn: any) => ({
            _id: asgn._id,
            name: asgn.fileName,
            path: asgn.fileUrl || asgn.filePath || "",
            isAssignment: true,
            teacherName: asgn.teacherName,
            course: asgn.course
          })));
        }
      }
    } catch (err) {
      console.error("Fetch error:", err)
    }
  }

  useEffect(() => { fetchData() }, [currentFolder, viewMode])

  useEffect(() => {
    const res = fetch(`${API_BASE_URL}/api/assignments/latest`).then(r => r.json()).then(data => {
      if (data.success && data.assignment) {
        setLatestAssignment(data.assignment);
        setShowAlert(true);
      }
    });
    const closeMenu = () => setActiveMenu(null)
    window.addEventListener("click", closeMenu)
    return () => window.removeEventListener("click", closeMenu)
  }, [])

  const enterFolder = (folder: RepoItem) => {
    setPath([...path, { id: folder._id, name: folder.name }])
    setCurrentFolder(folder._id)
  }

  const navigateTo = (index: number) => {
    const newPath = path.slice(0, index + 1)
    setPath(newPath)
    setCurrentFolder(newPath[newPath.length - 1].id)
    setViewMode("repository")
  }

  const handleView = (file: RepoItem) => {
    if (!file.path) return;
    const cleanFileName = file.path.split(/[\\/]/).pop(); 
    window.open(`${API_BASE_URL}/uploads/${cleanFileName}`, "_blank");
  }

  const handleDownload = (file: RepoItem) => {
    window.open(`${API_BASE_URL}/api/download/${file._id}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-10 font-sans">
      
      {/* ⚡ CLEAN NOTIFICATION */}
      <AnimatePresence>
        {showAlert && latestAssignment && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto mb-10">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-3xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-md">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">New Assignment: <span className="text-blue-600">{latestAssignment.fileName}</span></p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Teacher: {latestAssignment.teacherName}</p>
                </div>
              </div>
              <button onClick={() => setShowAlert(false)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400"><X size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER & SWITCHER */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-12 border-b border-slate-100 pb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-slate-900">
            <FileText className="text-blue-600" /> Student Repository
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Digital Academic Hub</p>
        </div>

        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => { setViewMode("repository"); navigateTo(0); }}
            className={`px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${viewMode === "repository" ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:text-slate-800"}`}
          >
            <Home size={14} /> Files
          </button>
          <button 
            onClick={() => setViewMode("assignments")}
            className={`px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${viewMode === "assignments" ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:text-slate-800"}`}
          >
            <BookOpen size={14} /> Tasks
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {viewMode === "repository" ? (
          <>
            {/* CLEAN BREADCRUMBS */}
            <div className="mb-12 flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 overflow-x-auto">
              {path.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3 whitespace-nowrap">
                  <button onClick={() => navigateTo(index)} className={`hover:text-blue-600 transition text-[11px] font-black uppercase tracking-widest ${index === path.length - 1 ? "text-blue-600" : "text-slate-400"}`}>
                    {step.name === "Root" ? <Home size={16} /> : step.name}
                  </button>
                  {index < path.length - 1 && <ChevronRight size={14} className="text-slate-300" />}
                </div>
              ))}
            </div>

            {/* REPOSITORY GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {folders.map((f) => (
                <motion.div key={f._id} onDoubleClick={() => enterFolder(f)} className="flex flex-col items-center group cursor-pointer" whileHover={{ y: -5 }}>
                  <div className="w-24 h-24 bg-blue-50 rounded-[30px] flex items-center justify-center transition-all group-hover:bg-blue-600 group-hover:shadow-xl group-hover:shadow-blue-200">
                    <Folder size={40} className="text-blue-600 group-hover:text-white" fill="currentColor" fillOpacity={0.1} />
                  </div>
                  <span className="mt-4 text-[11px] font-bold text-slate-600 uppercase tracking-tight text-center group-hover:text-blue-600 transition-colors">{f.name}</span>
                </motion.div>
              ))}

              {files.map((file) => (
                <motion.div key={file._id} className="flex flex-col items-center group relative" whileHover={{ y: -5 }}>
                  <div onClick={() => handleView(file)} className="w-24 h-24 bg-white border border-slate-100 rounded-[30px] flex items-center justify-center transition-all shadow-sm group-hover:shadow-md cursor-pointer relative">
                    <FileIcon size={36} className="text-slate-400 group-hover:text-blue-600" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={(e) => { e.stopPropagation(); handleDownload(file); }} className="p-1.5 bg-blue-600 text-white rounded-full shadow-lg">
                          <Download size={12} />
                       </button>
                    </div>
                  </div>
                  <span className="mt-4 text-[10px] font-semibold text-slate-500 text-center break-all line-clamp-2 w-full px-2">{file.name}</span>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          /* ASSIGNMENT VIEW */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allAssignments.map((asgn) => (
              <motion.div key={asgn._id} whileHover={{ y: -5 }} className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-blue-50 rounded-2xl text-blue-600"><BookOpen size={24} /></div>
                  <span className="text-[9px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase">{asgn.course}</span>
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-1 truncate">{asgn.name}</h3>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-8">From: {asgn.teacherName}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleView(asgn)} className="flex-1 bg-slate-100 hover:bg-slate-200 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 transition-all">View Task</button>
                  <button onClick={() => handleDownload(asgn)} className="px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all shadow-lg shadow-blue-200"><Download size={18} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
