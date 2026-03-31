"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ShieldCheck, GraduationCap, ChevronRight, Award } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden relative font-sans">
      
      {/* PROFESSIONAL SOFT BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[5%] right-[-5%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* TOP ACCREDITATION BADGE */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-50 border border-slate-200 shadow-sm"
        >
          <Award size={16} className="text-blue-600" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
            NAAC Reaccredited <span className="text-blue-600 font-black">"A++"</span> Grade (CGPA 3.58)
          </span>
        </motion.div>

        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-12 mb-16"
        >
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none text-slate-900 mb-6">
            Computer Science <br />
            <span className="text-blue-600">Department</span>
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[2px] w-8 bg-blue-600 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-medium tracking-[0.3em] text-slate-400 uppercase">
              E-Repository
            </h2>
            <div className="h-[2px] w-8 bg-blue-600 rounded-full"></div>
          </div>

          <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto font-semibold leading-relaxed uppercase tracking-wider">
            Shri Shivaji Education Society, Amravati <br/>
            <span className="text-slate-900 font-bold">Shri Shivaji College of Arts, Commerce & Science, Akola</span>
          </p>
        </motion.div>

        {/* ACCESS PORTALS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
          
          {/* STUDENT HUB CARD */}
          <Link href="/student-login" className="group">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 h-full flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <GraduationCap size={36} className="text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Student Hub</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mb-8">Access assignments & resources</p>
              <div className="w-full bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm tracking-wide group-hover:bg-blue-600 transition-colors">
                Student Login <ChevronRight size={18} />
              </div>
            </motion.div>
          </Link>

          {/* ADMIN PORTAL CARD */}
          <Link href="/admin-login" className="group">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-50 border border-slate-200 p-8 rounded-[40px] shadow-sm hover:shadow-xl hover:border-slate-400 transition-all duration-300 h-full flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-white border border-slate-200 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-slate-900 transition-colors duration-300">
                <ShieldCheck size={36} className="text-slate-600 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Admin Portal</h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mb-8">Management & Analytics Control</p>
              <div className="w-full bg-white text-slate-900 border border-slate-300 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm tracking-wide group-hover:border-slate-900 transition-colors">
                Staff Login <ChevronRight size={18} />
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Leadership Section */}
        <div className="mt-32 w-full max-w-5xl text-center">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-10">Department Leadership</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Mrs. R. S. Kale", role: "HOD" },
              { name: "Dr. A. B. Dube", role: "Professor" },
              { name: "Dr. S. M. Chavan", role: "Professor" },
              { name: "Ms. M. R. Gudade", role: "Professor" }
            ].map((fac, i) => (
              <div key={i} className="py-8 px-4 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                <p className="text-[12px] font-black text-slate-800 uppercase mb-1">{fac.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{fac.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 mb-16 w-full pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-bold text-white text-xl shadow-lg">M</div>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Developed By</p>
              <p className="text-sm font-black text-slate-800">Mohammad Maaz</p>
            </div>
          </div>
          <div className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">
            © 2026 Shri Shivaji College Computer Science
          </div>
        </footer>
      </div>
    </div>
  )
}
