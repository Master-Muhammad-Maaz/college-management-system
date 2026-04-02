"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  LogOut, 
  User, 
  FolderIcon 
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function StudentDashboard() {
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)

  useEffect(() => {
    const data = localStorage.getItem("studentData")
    if (!data || data === "undefined") {
      router.push("/student-login")
    } else {
      try {
        setStudent(JSON.parse(data))
      } catch (e) {
        localStorage.removeItem("studentData")
        router.push("/student-login")
      }
    }
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    router.push("/student-login")
  }

  if (!student) return null

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm border border-blue-100">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#0f172a] tracking-tight uppercase">Dashboard</h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Portal</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all shadow-sm border border-red-100">
            <LogOut size={20} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-50 rounded-[40px] p-8 md:p-12 border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="w-24 h-24 bg-white rounded-[30px] flex items-center justify-center border border-slate-200 shadow-sm text-blue-600">
            <User size={48} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-[#0f172a] uppercase tracking-tighter">{student.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <span className="px-5 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200">
                {student.course}
              </span>
              <span className="px-5 py-2 bg-white text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                Roll No: {student.rollNo || student.srNo}
              </span>
            </div>
          </div>
        </div>

        {/* Action Grid - Only Digital Notes Remaining */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => router.push("/student/notes")}
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100/50 group hover:border-indigo-200 transition-all cursor-pointer"
          >
             <div className="p-4 bg-indigo-50 text-indigo-600 w-fit rounded-2xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
               <FolderIcon size={24} />
             </div>
             <h3 className="text-sm font-black uppercase tracking-widest text-[#0f172a]">Digital Notes</h3>
             <p className="text-xs text-slate-400 mt-2 font-medium italic">View study materials & folders.</p>
          </motion.div>

        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
            College Management System &copy; 2026
          </p>
        </div>

      </div>
    </div>
  )
}
