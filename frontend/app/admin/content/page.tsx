//testing
"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { 
  Folder, 
  File, 
  Download, 
  Eye, 
  ArrowLeft, 
  Loader2, 
  Search,
  ArrowUpDown
} from "lucide-react"
import { motion } from "framer-motion"

function ContentLayout() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const course = searchParams.get("course")
  const category = searchParams.get("category") // 'notes' or 'assignments'
  
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [parentId, setParentId] = useState<string | null>(null)
  const [stack, setStack] = useState<any[]>([])
  const [sortOrder, setSortOrder] = useState("asc")

  // API se data fetch karna
  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await fetch(`https://college-management-system-ae1l.onrender.com/api/content/list?course=${course}&category=${category}&parentId=${parentId || ""}`)
      const data = await res.json()
      if (data.success) {
        setItems(data.items)
      }
    } catch (err) {
      console.error("Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [parentId, course, category])

  // Navigation Logic
  const handleOpenFolder = (item: any) => {
    if (item.type === 'folder') {
      setStack([...stack, item])
      setParentId(item._id)
    }
  }

  const goBack = () => {
    const newStack = [...stack]
    newStack.pop()
    setStack(newStack)
    setParentId(newStack.length > 0 ? newStack[newStack.length - 1]._id : null)
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-5">
            <button 
              onClick={parentId ? goBack : () => router.back()}
              className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter text-[#0f172a]">
                {category === 'notes' ? 'Digital Notes' : 'Assignments'}
              </h1>
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                {course} Portal {parentId ? `/ ${stack[stack.length-1]?.name}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT DRIVE TABLE */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 p-6 bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
            <div className="col-span-8 flex items-center gap-2 cursor-pointer" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
              Name <ArrowUpDown size={12} />
            </div>
            <div className="col-span-4 text-right">Options</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-50 min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Loading Files...</p>
              </div>
            ) : items.length > 0 ? (
              items.map((item) => (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  key={item._id}
                  onDoubleClick={() => handleOpenFolder(item)}
                  className="grid grid-cols-12 p-6 items-center hover:bg-blue-50/40 transition-all group cursor-pointer border-l-4 border-transparent hover:border-blue-500"
                >
                  {/* Name & Icon */}
                  <div className="col-span-8 flex items-center gap-4">
                    {item.type === 'folder' ? (
                      <Folder className="text-blue-500 fill-blue-50" size={24} />
                    ) : (
                      <File className="text-slate-400" size={24} />
                    )}
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{item.name}</span>
                      <span className="text-[8px] font-bold text-slate-300 uppercase">Modified: {new Date(item.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-span-4 flex justify-end gap-3">
                    {item.type === 'folder' ? (
                      <button 
                        onClick={() => handleOpenFolder(item)}
                        className="px-4 py-2 bg-slate-100 text-[9px] font-black uppercase rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                      >
                        Open Folder
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => window.open(item.fileUrl, "_blank")}
                          className="p-2.5 bg-white border border-slate-100 text-blue-600 rounded-xl hover:shadow-md transition-all"
                          title="View File"
                        >
                          <Eye size={16} />
                        </button>
                        <a 
                          href={item.fileUrl} 
                          download={item.name}
                          className="p-2.5 bg-white border border-slate-100 text-emerald-600 rounded-xl hover:shadow-md transition-all"
                          title="Download File"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                <Folder className="text-slate-100" size={64} />
                <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">No content available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
            CODEMATRIX SECURE CLOUD &copy; 2026
          </p>
        </div>
      </div>
    </div>
  )
}

// Suspense wrapper for searchParams
export default function StudentContentView() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>}>
      <ContentLayout />
    </Suspense>
  )
}
