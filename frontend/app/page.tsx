"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ShieldCheck, GraduationCap, ChevronRight, Award, Binary, Cpu, Globe, UserCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden relative font-sans selection:bg-blue-100">
      
      {/* ULTRA PRO DYNAMIC BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-[120px] opacity-70 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-indigo-50 to-transparent rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_20px_10px_rgba(59,130,246,0.1)]"></div>
      </div>

      {/* CONTINUOUS SCROLLING PROJECT ANNOUNCEMENT (MARQUEE) */}
      <div className="relative z-50 bg-slate-900 py-3 overflow-hidden border-b border-slate-800">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-[10px] md:text-xs font-bold text-blue-400 uppercase tracking-[0.2em] px-4">
            This project, titled “Department E-Repository”, has been successfully completed by Mohammed Maaz Mohammed Niyaz as part of the M.Sc. II (Computer Science) curriculum for the academic year 2025–26. The project is now fully completed and represents a functional academic repository system for departmental use. An updated version of this system, expected to be released by 2029, is planned under the title Student Portal 2.0, which will include further enhancements and extended features. This project was carried out under the guidance of Mr. A. S. Jadhao and the supervision of Ms. R. S. Kale, Head, Department of Computer Science. ——— 
          </span>
          {/* Duplicate for seamless loop */}
          <span className="text-[10px] md:text-xs font-bold text-blue-400 uppercase tracking-[0.2em] px-4">
            This project, titled “Department E-Repository”, has been successfully completed by Mohammed Maaz Mohammed Niyaz as part of the M.Sc. II (Computer Science) curriculum for the academic year 2025–26. The project is now fully completed and represents a functional academic repository system for departmental use. An updated version of this system, expected to be released by 2029, is planned under the title Student Portal 2.0, which will include further enhancements and extended features. This project was carried out under the guidance of Mr. A. S. Jadhao and the supervision of Ms. R. S. Kale, Head, Department of Computer Science.
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* TOP ACCREDITATION BADGE */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-xl shadow-blue-100/20"
        >
          <Award size={18} className="text-blue-600 animate-bounce" />
          <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-slate-700">
            NAAC Reaccredited <span className="text-blue-600 underline decoration-2 underline-offset-4">"A++"</span> Grade <span className="text-slate-400 ml-1 font-bold">(CGPA 3.58)</span>
          </span>
        </motion.div>

        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16 mb-20"
        >
          <div className="flex justify-center mb-6">
            <div className="px-4 py-1.5 bg-blue-600 rounded-lg text-[10px] font-black text-white uppercase tracking-widest mb-4 shadow-lg shadow-blue-200">
              Session 2025-26
            </div>
          </div>
          <h1 className="text-6xl md:text-[120px] font-black tracking-tighter leading-[0.85] text-slate-900 mb-8 select-none">
            COMPUTER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">SCIENCE</span>
          </h1>
          
          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="h-[1px] w-12 bg-slate-200"></div>
            <h2 className="text-3xl md:text-4xl font-light tracking-[0.4em] text-slate-400 uppercase">
              E-Repository
            </h2>
            <div className="h-[1px] w-12 bg-slate-200"></div>
          </div>

          <p className="text-xs md:text-sm text-slate-500 max-w-3xl mx-auto font-bold leading-relaxed uppercase tracking-[0.2em]">
            Shri Shivaji Education Society, Amravati <br/>
            <span className="text-slate-900 font-black text-lg md:text-xl block mt-2">Shri Shivaji College of Arts, Commerce & Science, Akola</span>
          </p>
        </motion.div>

        {/* ACCESS PORTALS - ULTRA MODERN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl px-4">
          
          <Link href="/student-login" className="group relative">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white border-2 border-slate-50 p-10 rounded-[50px] shadow-2xl shadow-slate-200/50 hover:border-blue-500 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Binary size={120} />
              </div>
              <div className="w-24 h-24 bg-blue-600 rounded-[30px] flex items-center justify-center mb-8 shadow-2xl shadow-blue-200 transform group-hover:rotate-6 transition-transform">
                <GraduationCap size={44} className="text-white" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-3 uppercase tracking-tighter">Student Hub</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-10">Gateway to academic Excellence</p>
              <div className="w-full bg-slate-900 text-white py-5 rounded-[25px] flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest group-hover:bg-blue-700 transition-all">
                Enter Repository <ChevronRight size={18} />
              </div>
            </motion.div>
          </Link>

          <Link href="/admin-login" className="group">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-900 p-10 rounded-[50px] shadow-2xl shadow-slate-900/20 border-2 border-slate-900 hover:border-blue-500 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Cpu size={120} className="text-blue-500" />
              </div>
              <div className="w-24 h-24 bg-white rounded-[30px] flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20 transform group-hover:-rotate-6 transition-transform">
                <ShieldCheck size={44} className="text-slate-900" />
              </div>
              <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">Admin Portal</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-10">Strategic Control Center</p>
              <div className="w-full bg-white text-slate-900 py-5 rounded-[25px] flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest group-hover:bg-blue-500 group-hover:text-white transition-all">
                Staff Authorization <ChevronRight size={18} />
              </div>
            </motion.div>
          </Link>
        </div>

        {/* REFINED LEADERSHIP SECTION */}
        <div className="mt-40 w-full max-w-6xl text-center">
          <div className="flex flex-col items-center mb-16">
            <Globe className="text-blue-600 mb-4 animate-spin-slow" size={32} />
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-slate-400">Department Governance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
             {/* HEAD OF DEPT */}
             <div className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-slate-200">
                   <UserCheck size={28} className="text-blue-600" />
                </div>
                <p className="text-[14px] font-black text-slate-900 uppercase">Ms. R. S. Kale</p>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Head of Department</p>
             </div>

             {/* PROJECT GUIDE */}
             <div className="p-10 rounded-[40px] bg-blue-600 shadow-2xl shadow-blue-100 flex flex-col items-center transform scale-110 z-20">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                   <Award size={28} className="text-white" />
                </div>
                <p className="text-[14px] font-black text-white uppercase">Mr. A. S. Jadhao</p>
                <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mt-1">Project Guide</p>
             </div>

             {/* SENIOR FACULTY */}
             <div className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-slate-200">
                   <UserCheck size={28} className="text-slate-400" />
                </div>
                <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight">Academic Faculty</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">CS Dept, Shivaji College</p>
             </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-40 mb-20 w-full pt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-slate-900 flex items-center justify-center font-black text-white text-2xl shadow-2xl ring-8 ring-slate-50">M</div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-1">Lead Developer</p>
              <p className="text-xl font-black text-slate-900 tracking-tighter">Mohammad Maaz</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 font-black text-[11px] uppercase tracking-widest mb-1">System Status: Active (Production)</p>
            <p className="text-slate-900 font-black text-[11px] uppercase tracking-widest">
              © 2026 Department of Computer Science
            </p>
          </div>
        </footer>
      </div>

      {/* TAILWIND CUSTOM ANIMATIONS */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
