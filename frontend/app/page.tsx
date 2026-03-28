"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ShieldCheck, GraduationCap, ChevronRight, Award } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden relative selection:bg-sky-500/30">
      
      {/* ULTRA DYNAMIC BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* PREMIUM HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16 md:mt-24"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
          >
            <Award size={14} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
              NAAC Reaccredited <span className="text-amber-400">"A++"</span> Grade (CGPA 3.58)
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight italic uppercase text-white">
            Computer Science <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 drop-shadow-sm">
              Department
            </span>
          </h1>

          <div className="mt-4 flex items-center justify-center gap-4">
             <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-sky-500"></div>
             <h2 className="text-xl md:text-2xl font-black tracking-[0.4em] text-sky-400 uppercase italic">
               E - Repository
             </h2>
             <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-sky-500"></div>
          </div>

          <p className="mt-8 text-sm md:text-base text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-wider italic">
            Shri Shivaji Education Society, Amravati <br/>
            <span className="text-white/60">Shri Shivaji College of Arts, Commerce & Science, Akola</span>
          </p>
        </motion.div>

        {/* ULTRA LOGIN SECTION (BYPASSED) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 w-full max-w-4xl">
          
          {/* ADMIN PORTAL CARD - DIRECT ACCESS */}
          <motion.div
            whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(56, 189, 248, 0.2)" }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[40px]"
          >
            <div className="bg-[#0a0c14]/90 backdrop-blur-2xl p-10 rounded-[38px] h-full border border-white/5 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck size={32} className="text-sky-400" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-2 italic">Admin Portal</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-8 tracking-widest">Dev Mode: Direct Dashboard Access</p>
              
              <Link href="/admin-dashboard" className="w-full">
                <button className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-sky-400 transition-all uppercase text-xs tracking-widest active:scale-95 shadow-xl">
                  Admin Entrance <ChevronRight size={16} />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* STUDENT PORTAL CARD - DIRECT ACCESS */}
          <motion.div
            whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.2)" }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="group relative p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[40px]"
          >
            <div className="bg-[#0a0c14]/90 backdrop-blur-2xl p-10 rounded-[38px] h-full border border-white/5 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <GraduationCap size={32} className="text-indigo-400" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-2 italic">Student Hub</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-8 tracking-widest">Dev Mode: Direct Entry</p>
              
              <Link href="/student-dashboard" className="w-full">
                <button className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all uppercase text-xs tracking-widest active:scale-95 shadow-xl shadow-indigo-500/20">
                  Student Entrance <ChevronRight size={16} />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* FACULTY SECTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 w-full max-w-5xl"
        >
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-sky-400 mb-2 italic">Faculty Directory</h2>
            <div className="h-1 w-20 bg-sky-500 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { name: "Ms. R. S. Kale", role: "HOD" },
              { name: "Dr. A. B. Dube", role: "Professor" },
              { name: "Dr. S. M. Chavan", role: "Professor" },
              { name: "Ms. M. R. Gudade", role: "Professor" }
            ].map((fac, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                <p className="text-xs font-black uppercase mb-1 group-hover:text-sky-400 transition-colors">{fac.name}</p>
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{fac.role}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* SIGNATURE FOOTER */}
        <footer className="mt-32 mb-16 w-full flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-black text-xl italic shadow-lg shadow-sky-500/20">M</div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Lead Architect</p>
              <p className="text-xs font-black uppercase tracking-tight text-white">Mohammad Maaz</p>
            </div>
          </div>

          <div className="text-center md:text-right">
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Academic Mentorship</p>
             <p className="text-xs font-black uppercase tracking-tight text-white">Under Guidance of Mr. A. S. Jadhon</p>
          </div>
        </footer>

      </div>
    </div>
  )
}
