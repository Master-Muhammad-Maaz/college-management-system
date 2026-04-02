"use client"
import { useState, useEffect } from "react"
import { 
  Folder, File, MoreVertical, Trash2, Edit3, 
  ChevronRight, Plus, Search, ArrowUpDown, Download, Eye 
} from "lucide-react"
import { motion } from "framer-motion"

export default function AdminDrive() {
  const [items, setItems] = useState<any[]>([])
  const [currentCourse, setCurrentCourse] = useState("B.Sc-I")
  const [currentCategory, setCurrentCategory] = useState("notes") // or assignments
  const [viewMode, setViewMode] = useState("list")
  const [sortOrder, setSortOrder] = useState("asc")

  // --- LOGIC: CREATE FOLDER ---
  const createFolder = async () => {
    const name = prompt("Enter Folder Name:")
    if (!name) return
    // API Call logic goes here (Coming in next step)
    const newItem = { id: Date.now(), name, type: "folder", date: new Date().toLocaleDateString() }
    setItems([...items, newItem])
  }

  // --- LOGIC: DELETE ITEM ---
  const deleteItem = (id: any) => {
    if(confirm("Are you sure?")) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP BAR: COURSE & CATEGORY SELECTOR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Content Manager</h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Managing {currentCourse} / {currentCategory}</p>
          </div>
          
          <div className="flex gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <select 
              className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase outline-none"
              onChange={(e) => setCurrentCourse(e.target.value)}
            >
              {["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button 
              onClick={createFolder}
              className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-blue-600 transition-all"
            >
              <Plus size={14} /> New Folder
            </button>
          </div>
        </div>

        {/* DRIVE TABLE LAYOUT */}
        <div className="bg-white rounded-[35px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 p-6 bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
            <div className="col-span-6 flex items-center gap-2 cursor-pointer hover:text-slate-900" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
              Name <ArrowUpDown size={12} />
            </div>
            <div className="col-span-4 text-center">Date Modified</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Table Body (Folders/Files) */}
          <div className="divide-y divide-slate-50">
            {items.map((item) => (
              <div 
                key={item.id}
                onDoubleClick={() => alert(`Opening ${item.name}`)}
                className="grid grid-cols-12 p-6 items-center hover:bg-blue-50/30 transition-all group cursor-pointer"
              >
                {/* Name Column */}
                <div className="col-span-6 flex items-center gap-4">
                  {item.type === "folder" ? <Folder className="text-blue-500 fill-blue-50" size={22} /> : <File className="text-slate-400" size={22} />}
                  <span className="text-xs font-bold text-slate-700">{item.name}</span>
                </div>

                {/* Date Column */}
                <div className="col-span-4 text-center text-[10px] font-bold text-slate-400">
                  {item.date || "Apr 02, 2026"}
                </div>

                {/* Actions (3-Dot Menu) */}
                <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => alert("Rename Logic")} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-slate-100">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 shadow-sm border border-transparent hover:border-slate-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                <Folder className="text-slate-100" size={64} />
                <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Folder is Empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
