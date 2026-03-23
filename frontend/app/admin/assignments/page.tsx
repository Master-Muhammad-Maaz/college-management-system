"use client"
import { useState, ChangeEvent, FormEvent } from "react"
import { BookOpen, Upload, PenTool, Calendar, User, FileText, Send, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Define the structure of your semester mapping
type CourseType = "B.Sc-I" | "B.Sc-II" | "B.Sc-III" | "M.Sc-I" | "M.Sc-II";

export default function AssignmentManagement() {
  const [type, setType] = useState<"text" | "file">("text")
  const [course, setCourse] = useState<CourseType>("B.Sc-I")
  const [formData, setFormData] = useState({
    fileName: "",
    semester: "Sem-1",
    content: "",
    teacherName: "",
    deadline: ""
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const semesterMap: Record<CourseType, string[]> = {
    "B.Sc-I": ["Sem-1", "Sem-2"],
    "B.Sc-II": ["Sem-3", "Sem-4"],
    "B.Sc-III": ["Sem-5", "Sem-6"],
    "M.Sc-I": ["Sem-1", "Sem-2"],
    "M.Sc-II": ["Sem-3", "Sem-4"]
  }

  // FIXED: Added TypeScript event typing
  const handleCourseChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedCourse = e.target.value as CourseType;
    setCourse(selectedCourse);
    setFormData({ ...formData, semester: semesterMap[selectedCourse][0] });
  }

  // FIXED: Added FormEvent typing
  const handleUpload = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const data = new FormData()
    data.append("fileName", formData.fileName)
    data.append("course", course)
    data.append("semester", formData.semester)
    data.append("type", type)
    data.append("teacherName", formData.teacherName.toLowerCase())
    data.append("deadline", formData.deadline)
    
    if (type === "text") data.append("content", formData.content)
    if (type === "file" && file) data.append("file", file)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/assignments/add`, {
        method: "POST",
        body: data
      })
      const resData = await res.json()
      if (resData.success) {
        alert("Success: Assignment published successfully!");
        setFormData({ fileName: "", semester: semesterMap[course][0], content: "", teacherName: "", deadline: "" })
        setFile(null)
      }
    } catch (err) { 
      alert("Error: Assignment upload failed. Check server connection.") 
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0c14] text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <Link href="/admin" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                    <ArrowLeft size={20} className="text-gray-400" />
                </Link>
                <h1 className="text-2xl font-black flex items-center gap-3">
                    <BookOpen className="text-sky-400" /> ASSIGNMENT PANEL
                </h1>
            </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/10 blur-[100px] rounded-full"></div>

          {/* Mode Switcher */}
          <div className="flex bg-black/40 p-1.5 rounded-2xl mb-10 w-fit border border-white/5 mx-auto md:mx-0">
            <button 
              type="button"
              onClick={() => setType("text")} 
              className={`px-8 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-2 transition-all ${type === "text" ? "bg-sky-600 shadow-lg shadow-sky-600/30" : "text-gray-500 hover:text-white"}`}
            >
              <PenTool size={14}/> Write Mode
            </button>
            <button 
              type="button"
              onClick={() => setType("file")} 
              className={`px-8 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-2 transition-all ${type === "file" ? "bg-sky-600 shadow-lg shadow-sky-600/30" : "text-gray-500 hover:text-white"}`}
            >
              <Upload size={14}/> File Upload
            </button>
          </div>

          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase ml-2">Assignment Name *</label>
              <input required value={formData.fileName} onChange={(e)=>setFormData({...formData, fileName: e.target.value})} className="w-full bg-white/5 border border-white/5 p-5 rounded-[25px] outline-none focus:border-sky-500/50 transition-all font-bold" placeholder="e.g. Quantum Physics Quiz" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase ml-2">Teacher Name *</label>
              <input required value={formData.teacherName} onChange={(e)=>setFormData({...formData, teacherName: e.target.value})} className="w-full bg-white/5 border border-white/5 p-5 rounded-[25px] outline-none focus:border-sky-500/50 text-sm italic font-medium" placeholder="e.g. Prof. Maaz" />
            </div>

            <div className="space-y-2 relative">
              <label className="text-[10px] font-black text-gray-500 uppercase ml-2">Target Course</label>
              <select value={course} onChange={handleCourseChange} className="w-full bg-white/5 border border-white/5 p-5 rounded-[25px] outline-none appearance-none font-bold cursor-pointer focus:border-sky-500/50 transition-all">
                {Object.keys(semesterMap).map(c => <option key={c} value={c} className="bg-[#11141d]">{c}</option>)}
              </select>
            </div>

            <div className="space-y-2 relative">
              <label className="text-[10px] font-black text-gray-500 uppercase ml-2">Specific Semester</label>
              <select value={formData.semester} onChange={(e)=>setFormData({...formData, semester: e.target.value})} className="w-full bg-white/5 border border-white/5 p-5 rounded-[25px] outline-none appearance-none font-bold cursor-pointer focus:border-sky-500/50 transition-all">
                {semesterMap[course].map(s => <option key={s} value={s} className="bg-[#11141d]">{s}</option>)}
              </select>
            </div>

            {/* Added: Deadline Picker */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase ml-2">Submission Deadline *</label>
              <div className="relative">
                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-sky-400" size={18} />
                <input required type="date" value={formData.deadline} onChange={(e)=>setFormData({...formData, deadline: e.target.value})} className="w-full bg-white/5 border border-white/5 p-5 pl-14 rounded-[25px] outline-none focus:border-sky-500/50 transition-all font-bold cursor-pointer" />
              </div>
            </div>

            {/* Conditional Input */}
            <div className="md:col-span-2 mt-4">
              {type === "text" ? (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase ml-2">Assignment Questions</label>
                  <textarea required={type === "text"} value={formData.content} onChange={(e)=>setFormData({...formData, content: e.target.value})} className="w-full bg-white/5 border border-white/5 p-6 rounded-[30px] min-h-[250px] outline-none focus:border-sky-500/50 transition-all font-medium leading-relaxed" placeholder="Write your questions here..." />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase ml-2">Attachment (PDF/DOC)</label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 p-12 rounded-[40px] cursor-pointer hover:bg-white/5 hover:border-sky-500/30 transition-all group">
                    <div className="w-16 h-16 bg-sky-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="text-sky-400" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 tracking-wide uppercase">{file ? file.name : "Select Assignment File"}</span>
                    <input type="file" required={type === "file"} className="hidden" onChange={(e)=>setFile(e.target.files ? e.target.files[0] : null)} />
                  </label>
                </div>
              )}
            </div>

            <div className="md:col-span-2 pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-sky-600 hover:bg-sky-500 py-5 rounded-[25px] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-sky-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Publishing..." : <><Send size={16}/> Publish Assignment</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
