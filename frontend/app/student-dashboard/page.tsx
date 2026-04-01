"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  BookOpen, 
  LayoutDashboard, 
  LogOut, 
  User, 
  Loader2, 
  FolderIcon 
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function StudentDashboard() {
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
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
      <div className="max-w-4xl mx-auto">
        
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
                Contact: {student.mobile || "N/A"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* CLEAN ACTION GRID - ONLY 2 CARDS NOW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[
            { 
              icon: <BookOpen size={28} />, 
              title: "Assignments", 
              desc: "Access shared resources.", 
              color: "bg-blue-50 text-blue-600",
              link: "/student/assignments" 
            },
            { 
              icon: <FolderIcon size={28} />, 
              title: "Digital Notes", 
              desc: "View study materials.", 
              color: "bg-indigo-50 text-indigo-600",
              link: "/student/notes" 
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => router.push(item.link)}
              className="bg-white p-10 rounded-[45px] border border-slate-100 shadow-2xl shadow-slate-200/40 group hover:border-blue-200 transition-all cursor-pointer flex flex-col items-center text-center"
            >
               <div className={`p-5 ${item.color} w-fit rounded-3xl mb-6 transition-all`}>
                 {item.icon}
               </div>
               <h3 className="text-lg font-black uppercase tracking-widest text-[#0f172a]">{item.title}</h3>
               <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-tight">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* FOOTER INFO */}
        <div className="mt-16 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">
            College Management System &copy; 2026
          </p>
        </div>

      </div>
    </div>
  )
}
