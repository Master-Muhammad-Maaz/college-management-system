"use client"
import { useState, useEffect } from "react"
import { 
  Folder, File, MoreVertical, Trash2, Edit3, 
  ArrowLeft, Plus, Upload, ArrowUpDown, Loader2, Search
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminDrive() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentCourse, setCurrentCourse] = useState("B.Sc-I")
  const [currentCategory, setCurrentCategory] = useState("notes")
  const [parentId, setParentId] = useState<string | null>(null)
  const [stack, setStack] = useState<any[]>([])
  const [sortOrder, setSortOrder] = useState("asc")

  const API_BASE = "https://college-management-system-ae1l.onrender.com"

  // --- FETCH DATA ---
  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/content/list?course=${currentCourse}&category=${currentCategory}&parentId=${parentId || ""}`)
      const data = await res.json()
      if(data.success) setItems(data.items)
    } catch (err) {
      console.error("Fetch Error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [currentCourse, currentCategory, parentId])

  // --- CREATE FOLDER ---
  const handleCreateFolder = async () => {
    const name = prompt("Enter Folder Name:")
    if (!name) return
    try {
      const res = await fetch(`${API_BASE}/api/content/create-folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, course: currentCourse, category: currentCategory, parentId })
      })
      if (await res.json()) fetchItems()
    } catch (err) { alert("Error creating folder") }
  }

  // --- DELETE ITEM ---
  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure?")) return
    try {
      await fetch(`${API_BASE}/api/content/delete/${id}`, { method: "DELETE" })
      fetchItems()
    } catch (err) { alert("Delete failed") }
  }

  // --- NAVIGATION ---
  const openFolder = (item: any) => {
    if (item.type === "folder") {
      setStack([...stack, item])
      setParentId(item._id)
    }
  }

  const goBack = () => {
    const newStack = [...stack]; newStack.pop()
    setStack(newStack)
    setParentId(newStack.length > 0 ? newStack[newStack.length - 1]._id : null)
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-6 md:p-10 text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER & CONTROLS */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            {parentId && (
              <button onClick={goBack} className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50">
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter">Drive Manager</h1>
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">
                {currentCourse} / {currentCategory} {parentId ? `/ ${stack[stack.length-1]?.name}` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 bg-white p-2 rounded-[25px] shadow-sm border border-slate-100 w-full lg:w-auto">
            <select 
              className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase outline-none border-none cursor-pointer"
              onChange={(e) => { setCurrentCourse(e.target.value); setParentId(null); setStack([]); }}
            >
              {["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            
            <select 
              className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase outline-none border-none cursor-pointer"
              onChange={(e) => { setCurrentCategory(e.target.value); setParentId(null); setStack([]); }}
            >
              <option value="notes">Digital Notes</option>
              <option value="assignments">Assignments</option>
            </select>

            <button onClick={handleCreateFolder} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-blue-600 transition-all">
              <Plus size={14} /> Folder
            </button>
            
            <label className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-slate-900 transition-all cursor-pointer">
              <Upload size={14} /> Upload
              <input type="file" className="hidden" />
            </label>
          </div>
        </div>

        {/* DRIVE TABLE */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-12 p-6 bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
            <div className="col-span-7 flex items-center gap-2 cursor-pointer" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
              Name <ArrowUpDown size={12} />
            </div>
            <div className="col-span-3 text-center">Date</div>
            <div className="col-span-2 text-right">Options</div>
          </div>

          <div className="divide-y divide-slate-50 min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="animate-spin text-blue-600" size={32} />
              </div>
            ) : items.length > 0 ? (
              items.map((item) => (
                <div 
                  key={item._id}
                  onDoubleClick={() => openFolder(item)}
                  className="grid grid-cols-12 p-6 items-center hover:bg-blue-50/30 transition-all group cursor-pointer border-l-4 border-transparent hover:border-blue-500"
                >
                  <div className="col-span-7 flex items-center gap-4">
                    {item.type === "folder" ? <Folder className="text-blue-500 fill-blue-50" size={22} /> : <File className="text-slate-400" size={22} />}
                    <span className="text-xs font-bold text-slate-700">{item.name}</span>
                  </div>
                  <div className="col-span-3 text-center text-[10px] font-bold text-slate-300 uppercase italic">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleDelete(item._id)} className="p-2 bg-white rounded-lg text-red-400 hover:text-red-600 shadow-sm border border-slate-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                <Folder className="text-slate-100" size={64} />
                <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">No Items Found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
