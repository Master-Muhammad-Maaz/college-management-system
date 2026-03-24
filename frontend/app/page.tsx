"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ShieldCheck, GraduationCap, ChevronRight, Award, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-sky-100 selection:text-sky-600 relative overflow-hidden">
      
      {/* SOFT DYNAMIC GRADIENT BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-sky-100 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* ACADEMIC HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16 md:mt-24"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 mb-8 shadow-sm"
          >
            <Award size={14} className="text-sky-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              NAAC Reaccredited <span className="text-sky-600 font-black">"A++"</span> Grade (CGPA 3.58)
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-slate-900">
            Computer Science <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">
              Department Portal
            </span>
          </h1>

          <div className="mt-6 flex items-center justify-center gap-4">
             <div className="h-[2px] w-8 bg-sky-200"></div>
             <h2 className="text-lg md:text-xl font-black tracking-[0.3em] text-slate-400 uppercase italic">
               E - Repository
             </h2>
             <div className="h-[2px] w-8 bg-sky-200"></div>
          </div>

          <p className="mt-8 text-sm md:text-base text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Shri Shivaji Education Society, Amravati <br/>
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">Shri Shivaji College of Arts, Commerce & Science, Akola</span>
          </p>
        </motion.div>

        {/* CLEAN CARDS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 w-full max-w-4xl">
          
          {/* ADMIN CARD */}
          <motion.div
            whileHover={{ 
              y: -8, 
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" 
            }}
            className="group bg-white border border-slate-200 p-10 rounded-[40px] shadow-sm flex flex-col items-center text-center transition-all cursor-default"
          >
            <div className="w-16 h-16 bg-sky-50 rounded-3xl flex items-center justify-center mb-6 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Admin Portal</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-8 tracking-widest">Authorized Faculty Access</p>
            
            <Link href="/admin-login" className="w-full">
              <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-sky-600 transition-all uppercase text-xs tracking-widest shadow-lg shadow-slate-200">
                Enter Admin <ChevronRight size={16} />
              </button>
            </Link>
          </motion.div>

          {/* STUDENT CARD */}
          <motion.div
            whileHover={{ 
              y: -8, 
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" 
            }}
            className="group bg-white border border-slate-200 p-10 rounded-[40px] shadow-sm flex flex-col items-center text-center transition-all cursor-default"
          >
            <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <GraduationCap size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Student Hub</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mb-8 tracking-widest">Resource & Marks Access</p>
            
            <Link href="/student-login" className="w-full">
              <button className="w-full bg-white border-2 border-slate-900 text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all uppercase text-xs tracking-widest">
                Student Login <ChevronRight size={16} />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* FACULTY SECTION */}
        <div className="mt-32 w-full max-w-5xl bg-white border border-slate-100 rounded-[30px] p-10 shadow-sm mb-20">
          <div className="text-center mb-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Department Faculty</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { name: "Mrs. R. S. Kale", role: "HOD" },
              { name: "Dr. A. B. Dube", role: "Assistant Professor" },
              { name: "Dr. S. M. Chavan", role: "Assistant Professor" },
              { name: "Mrs. M. R. Gudade", role: "Assistant Professor" }
            ].map((fac, i) => (
              <div key={i}>
                <p className="text-xs font-black text-slate-800">{fac.name}</p>
                <p className="text-[9px] font-bold text-sky-500 uppercase tracking-widest mt-1">{fac.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MINIMAL FOOTER */}
        <footer className="w-full py-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
          <p className="text-[10px] font-bold uppercase tracking-widest">
            Developed by <span className="text-slate-900 font-black italic">Mohammed Maaz</span>
          </p>
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-sky-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest italic">Under Guidance of Mr. A. S. Jadhon</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
