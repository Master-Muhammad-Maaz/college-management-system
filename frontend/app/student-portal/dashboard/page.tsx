"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  BookOpen, 
  LayoutDashboard, 
  LogOut, 
  User, 
  Loader2, 
  FolderIcon,
  ShieldCheck
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function StudentPortalDashboard() {
  const router = useRouter()
  const [student, setStudent] = useState<any>(null)
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    // NAYA SESSION CHECK (studentAuth)
    const data = localStorage.getItem("studentAuth")
    
    if (!data || data === "undefined") {
      router.push("/student-portal/login")
    } else {
      try {
        const parsedData = JSON.parse(data)
        setStudent(parsedData)
      } catch (e) {
        localStorage.removeItem("studentAuth")
        router.push("/student-portal/login")
      }
    }
    setIsVerifying(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("studentAuth")
    router.push("/student-portal/login")
  }

  if (isVerifying || !student) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        Accessing Secure Course Data...
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white text-blue-600 rounded-[22px] shadow-sm border border-slate-100">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#0f172a] tracking-tight uppercase italic">My Portal</h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Personalized Dashboard</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="p-3 bg-white text-red-500 rounded-xl hover:bg-red-50 transition-all shadow-sm border border-slate-100 group"
          >
            <LogOut size={20} className="group-active:scale-90 transition-transform" />
          </button>
        </div>

        {/* DYNAMIC PROFILE CARD (WITH PHOTO) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[45px] p-8 border border-slate-100 mb-10 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-slate-200/50"
        >
          <div className="w-28 h-28 bg-slate-100 rounded-[35px] border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
            {student.profilePic ? (
              <img src={student.profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-slate-300" />
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-black text-[#0f172a] uppercase tracking-tighter italic">
              {student.name}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <span className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-slate-200">
                Course: {student.course}
              </span>
              <span className="px-6 py-2.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">
                Email: {student.email}
              </span>
            </div>
          </div>
        </motion.div>

        {/* COURSE-WISE CONTENT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[
            { 
              icon: <BookOpen size={28} />, 
              title: "Assignments", 
              desc: `View ${student.course} tasks.`, 
              color: "bg-blue-50 text-blue-600",
              link: `/student-portal/content/assignments?course=${student.course}` 
            },
            { 
              icon: <FolderIcon size={28} />, 
              title: "Digital Notes", 
              desc: `Browse ${student.course} notes.`, 
              color: "bg-indigo-50 text-indigo-600",
              link: `/student-portal/content/notes?course=${student.course}` 
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => router.push(item.link)}
              className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-2xl shadow-slate-200/40 group hover:border-blue-300 transition-all cursor-pointer flex flex-col items-center text-center"
            >
               <div className={`p-6 ${item.color} w-fit rounded-[25px] mb-6 transition-all shadow-inner`}>
                 {item.icon}
               </div>
               <h3 className="text-lg font-black uppercase tracking-widest text-[#0f172a]">{item.title}</h3>
               <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tight">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-16 text-center">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.5em]">
            CODEMATRIX SECURE SYSTEM &copy; 2026
          </p>
        </div>

      </div>
    </div>
  )
}
