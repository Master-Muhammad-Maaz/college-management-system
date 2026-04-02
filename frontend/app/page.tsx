"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ShieldCheck, GraduationCap, ChevronRight, Award, Binary, Cpu, Globe, UserCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden relative font-sans selection:bg-blue-100">
      
      {/* ULTRA PRO DYNAMIC BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-[120px] opacity-70 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-indigo-50 to-transparent rounded-full blur-[100px] opacity-60"></div>
      </div>

      {/* CONTINUOUS SCROLLING PROJECT ANNOUNCEMENT */}
      <div className="relative z-50 bg-slate-900 py-3 overflow-hidden border-b border-slate-800 shadow-2xl">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-[10px] md:text-xs font-bold text-blue-400 uppercase tracking-[0.2em] px-4">
            This project, titled “CORE-MATRIX REPO”, has been successfully completed by Mohammed Maaz Mohammed Niyaz as part of the M.Sc. II (Computer Science) curriculum for the academic year 2025–26. The project is now fully completed and represents a functional academic repository system for departmental use. An updated version of this system, expected to be released by 2029, is planned under the title Student Portal 2.0. This project was carried out under the guidance of Mr. A. S. Jadhao and the supervision of Ms. R. S. Kale, Head, Department of Computer Science. ——— 
          </span>
          <span className="text-[10px] md:text-xs font-bold text-blue-400 uppercase tracking-[0.2em] px-4">
            This project, titled “CORE-MATRIX REPO”, has been successfully completed by Mohammed Maaz Mohammed Niyaz as part of the M.Sc. II (Computer Science) curriculum for the academic year 2025–26. The project is now fully completed and represents a functional academic repository system for departmental use. An updated version of this system, expected to be released by 2029, is planned under the title Student Portal 2.0. This project was carried out under the guidance of Mr. A. S. Jadhao and the supervision of Ms. R. S. Kale, Head, Department of Computer Science.
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* TOP BADGE */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-slate-200 shadow-xl shadow-blue-100/20"
        >
          <Award size={18} className="text-blue-600" />
          <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-700">
            NAAC Reaccredited <span className="text-blue-600 font-black">"A++"</span> Grade (CGPA 3.58)
          </span>
        </motion.div>

        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mt-16 mb-20"
        >
          <h1 className="text-6xl md:text-[110px] font-black tracking-tighter leading-[0.85] text-slate-900 mb-8">
            COMPUTER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 uppercase">Science</span>
          </h1>
          
          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="h-[1px] w-12 bg-slate-200"></div>
            <h2 className="text-3xl md:text-4xl font-light tracking-[0.4em] text-slate-400 uppercase">
              CORE-MATRIX REPO
            </h2>
            <div className="h-[1px] w-12 bg-slate-200"></div>
          </div>

          <p className="text-xs md:text-sm text-slate-500 max-w-3xl mx-auto font-bold leading-relaxed uppercase tracking-[0.2em]">
            Shri Shivaji Education Society, Amravati <br/>
            <span className="text-slate-900 font-black text-lg md:text-xl block mt-2">Shri Shivaji College of Arts, Commerce & Science, Akola</span>
          </p>
        </motion.div>

        {/* ACCESS PORTALS - NOW IN UNIFIED DARK FORMAT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl px-4 mb-24">
          
          {/* STUDENT HUB - MODIFIED TO MATCH ADMIN STYLE */}
          <Link href="/student-login" className="group">
            <motion.div whileHover={{ y: -10 }} className="bg-slate-900 p-10 rounded-[50px] shadow-2xl shadow-slate-900/20 border-2 border-slate-900 hover:border-blue-500 transition-all duration-500">
              <div className="w-20 h-20 bg-blue-600 rounded-[30px] flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
                <GraduationCap size={40} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 uppercase">Student Hub</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-10">Digital Resource Access</p>
              <div className="w-full bg-white text-slate-900 py-5 rounded-[25px] flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all">
                Login <ChevronRight size={18} />
              </div>
            </motion.div>
          </Link>

          {/* ADMIN PORTAL */}
          <Link href="/admin-login" className="group">
            <motion.div whileHover={{ y: -10 }} className="bg-slate-900 p-10 rounded-[50px] shadow-2xl shadow-slate-900/20 border-2 border-slate-900 hover:border-blue-500 transition-all duration-500">
              <div className="w-20 h-20 bg-white rounded-[30px] flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
                <ShieldCheck size={40} className="text-slate-900" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 uppercase">Admin Portal</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-10">Management Control</p>
              <div className="w-full bg-white text-slate-900 py-5 rounded-[25px] flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest group-hover:bg-blue-500 group-hover:text-white transition-all">
                Authorize <ChevronRight size={18} />
              </div>
            </motion.div>
          </Link>
        </div>

        {/* FULL DEPARTMENT LEADERSHIP SECTION */}
        <div className="mt-20 w-full max-w-6xl text-center">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-12">Department Faculty & Leadership</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              { name: "Ms. R. S. Kale", role: "Head of Dept", color: "text-blue-600" },
              { name: "Mr. A. S. Jadhao", role: "Project Guide", color: "text-indigo-600" },
              { name: "Dr. A. B. Dube", role: "Professor", color: "text-slate-500" },
              { name: "Dr. S. M. Chavan", role: "Professor", color: "text-slate-500" },
              { name: "Ms. M. R. Gudade", role: "Professor", color: "text-slate-500" }
            ].map((fac, i) => (
              <div key={i} className="p-8 rounded-[35px] border border-slate-100 bg-slate-50/50 flex flex-col items-center hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                  <UserCheck size={20} className={fac.color} />
                </div>
                <p className="text-[12px] font-black text-slate-900 uppercase leading-tight">{fac.name}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{fac.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-40 mb-20 w-full pt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-slate-900 flex items-center justify-center font-black text-white text-2xl shadow-2xl ring-8 ring-slate-50">M</div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Developed By</p>
              <p className="text-lg font-black text-slate-900 tracking-tighter">Mohammad Maaz</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">© 2026 Dept. of Computer Science</p>
            <p className="text-slate-900 font-black text-[10px] uppercase tracking-widest mt-1">CORE-MATRIX REPO v1.0</p>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 45s linear infinite; }
      `}</style>
    </div>
  )
}
