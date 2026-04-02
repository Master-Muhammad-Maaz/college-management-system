"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Folder, File, Download, Eye, ArrowLeft } from "lucide-react"

export default function StudentContentView() {
  const searchParams = useSearchParams()
  const course = searchParams.get("course")
  const category = searchParams.get("category") // 'notes' or 'assignments'
  
  const [items, setItems] = useState([])
  const [parentId, setParentId] = useState(null)
  const [stack, setStack] = useState([])

  const fetchContent = async () => {
    const res = await fetch(`/api/content/list?course=${course}&category=${category}&parentId=${parentId || ""}`)
    const data = await res.json()
    setItems(data.items)
  }

  useEffect(() => { fetchContent() }, [parentId])

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Navigation Header */}
      <div className="flex items-center gap-4 mb-8">
        {parentId && (
          <button onClick={() => {
            const newStack = [...stack]; newStack.pop();
            setStack(newStack); setParentId(newStack.length > 0 ? newStack[newStack.length-1]._id : null);
          }} className="p-2 bg-slate-100 rounded-full"><ArrowLeft size={20}/></button>
        )}
        <h1 className="text-xl font-black uppercase">{category} for {course}</h1>
      </div>

      <div className="bg-slate-50 rounded-[35px] border border-slate-100 overflow-hidden">
        {items.map((item: any) => (
          <div key={item._id} className="grid grid-cols-12 p-6 items-center border-b border-white hover:bg-blue-50/50 transition-all">
            <div className="col-span-8 flex items-center gap-4" 
                 onDoubleClick={() => item.type === 'folder' && (setParentId(item._id), setStack([...stack, item]))}>
              {item.type === 'folder' ? <Folder className="text-blue-500" /> : <File className="text-slate-400" />}
              <span className="text-xs font-bold">{item.name}</span>
            </div>
            
            <div className="col-span-4 flex justify-end gap-3">
              {item.type === 'file' && (
                <>
                  <button onClick={() => window.open(item.fileUrl, "_blank")} className="p-2 bg-white rounded-lg text-blue-600 shadow-sm"><Eye size={14}/></button>
                  <a href={item.fileUrl} download={item.name} className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm"><Download size={14}/></a>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
