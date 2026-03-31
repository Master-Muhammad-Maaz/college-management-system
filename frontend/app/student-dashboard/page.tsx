"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, Calendar, FileText, LayoutDashboard, LogOut, User, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function StudentDashboard() {
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    // FIX: Match the key 'studentData' with Login Page
    const data = localStorage.getItem("studentData")
    
    if (!data || data === "undefined") {
      router.push("/student-login")
    } else {
      try {
        const parsedData = JSON.parse(data)
        setStudent(parsedData)
      } catch (e) {
        console.error("Session Error:", e)
        localStorage.removeItem("studentData")
        router.push("/student-login")
      }
    }
    setIsVerifying(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("studentData")
    router.push("/student-login")
  }

  // Loading state while checking auth
  if (isVerifying || !student) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        Verifying Secure Session...
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP NAVIGATION */}
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
          <button 
            onClick={handleLogout} 
            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all shadow-sm border border-red-100 group"
            title="Logout Session"
          >
            <LogOut size={20} className="group-active:scale-90 transition-transform" />
          </button>
        </div>

        {/* PROFILE CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 rounded-[40px] p-8 md:p-12 border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-sm"
        >
          <div className="w-24 h-24 bg-white rounded-[30px] flex items-center justify-center border border-slate-200 shadow-sm text-blue-600">
            <User size={48} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-[#0f172a] uppercase tracking-tighter">
              {student.name || "Student Name"}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <span className="px-5 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200">
                {student.course || "General Student"}
              </span>
              <span className="px-5 py-2 bg-white text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                Contact: {student.mobile || student.contact || "N/A"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ACTION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <BookOpen size={24} />, title: "Assignments", desc: "Access shared resources.", color: "bg-blue-50 text-blue-600" },
            { icon: <Calendar size={24} />, title: "Attendance", desc: "Check monthly report.", color: "bg-emerald-50 text-emerald-600" },
            { icon: <FileText size={24} />, title: "Internal Marks", desc: "View assessment results.", color: "bg-orange-50 text-orange-600" }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100/50 group hover:border-blue-200 transition-all cursor-pointer"
            >
               <div className={`p-4 ${item.color} w-fit rounded-2xl mb-6 transition-all`}>
                 {item.icon}
               </div>
               <h3 className="text-sm font-black uppercase tracking-widest text-[#0f172a]">{item.title}</h3>
               <p className="text-xs text-slate-400 mt-2 font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* FOOTER INFO */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
            College Management System &copy; 2026
          </p>
        </div>

      </div>
    </div>
  )
}
