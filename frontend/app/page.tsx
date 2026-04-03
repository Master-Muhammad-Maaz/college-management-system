"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ShieldCheck, GraduationCap, ChevronRight, Award, UserCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden relative font-sans selection:bg-blue-100">
      
      {/* 0. VERTICAL UPWARD MARQUEE (LEFT SIDE) - Hidden on small mobile for space, visible from md up */}
      <div className="fixed left-0 top-0 h-full w-6 md:w-8 bg-slate-900 z-[60] flex flex-col items-center justify-center overflow-hidden border-r border-slate-800 shadow-2xl">
        <div className="flex flex-col whitespace-nowrap animate-vertical-marquee">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="text-[7px] md:text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 py-10 md:py-20 opacity-80">
              CORE-MATRIX REPO v2.0 ——— UPGRADE EXPECTED 2029 ——— SYSTEM STABILITY VERIFIED ——— 
            </span>
          ))}
        </div>
      </div>

      {/* DYNAMIC BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none pl-8">
        <div className="absolute top-[-5%] right-[-5%] w-[250px] md:w-[700px] h-[250px] md:h-[700px] bg-blue-50/60 rounded-full blur-[60px] md:blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[200px] md:w-[600px] h-[200px] md:h-[600px] bg-indigo-50/50 rounded-full blur-[50px] md:blur-[100px]"></div>
      </div>

      {/* 1. FLOATING ANNOUNCEMENT LINE */}
      <div className="relative z-50 bg-slate-900 py-2 md:py-3 overflow-hidden border-b border-slate-800 ml-6 md:ml-8">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-[8px] md:text-xs font-bold text-blue-400 uppercase tracking-[0.15em] md:tracking-[0.2em] px-4">
            Completed by Mohammed Maaz Mohammed Niyaz — M.Sc. II (Computer Science) 2025–26 — CORE-MATRIX REPO ——— 
          </span>
          <span className="text-[8px] md:text-xs font-bold text-blue-400 uppercase tracking-[0.15em] md:tracking-[0.2em] px-4">
            Completed by Mohammed Maaz Mohammed Niyaz — M.Sc. II (Computer Science) 2025–26 — CORE-MATRIX REPO ——— 
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center ml-6 md:ml-8">
        
        {/* 2. COLLEGE DETAIL BOX */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 md:mt-12 mb-6 md:mb-10 p-5 md:p-8 rounded-[20px] md:rounded-[40px] bg-slate-50/80 border border-slate-200 backdrop-blur-sm w-full max-w-4xl shadow-sm text-center"
        >
          <p className="text-[8px] md:text-[13px] text-slate-500 font-bold uppercase tracking-[0.1em] md:tracking-[0.3em] leading-tight">
            Shri Shivaji Education Society, Amravati
          </p>
          <h3 className="text-slate-900 font-black text-[12px] md:text-2xl block mt-2 tracking-tight md:tracking-[0.05em] uppercase leading-snug">
            Shri Shivaji College of Arts, Commerce & Science, Akola
          </h3>

          <div className="h-[1px] w-2/3 mx-auto bg-slate-200 my-4 opacity-60"></div>

          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Award size={14} className="md:w-5 md:h-5" />
            <span className="text-[9px] md:text-sm font-black uppercase tracking-wider">
              NAAC Reaccredited <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[8px] md:text-xs">"A++"</span> Grade
            </span>
          </div>
        </motion.div>

        {/* 3. HERO TITLES */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8 md:mb-16 w-full"
        >
          <h1 className="text-4xl md:text-[120px] font-black tracking-tighter leading-[1] md:leading-[0.8] text-slate-900 mb-6 uppercase">
            COMPUTER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Science</span>
          </h1>
          
          <div className="flex items-center justify-center gap-2 md:gap-6">
            <div className="h-[1px] w-4 md:w-12 bg-blue-600 opacity-30"></div>
            <h2 className="text-sm md:text-5xl font-black tracking-[0.1em] text-slate-800 uppercase">
              CORE-MATRIX REPO
            </h2>
            <div className="h-[1px] w-4 md:w-12 bg-blue-600 opacity-30"></div>
          </div>
        </motion.div>

        {/* 4. ACCESS PORTALS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-4xl px-2 mb-12 md:mb-20">
          {[
            { title: "Student Hub", icon: GraduationCap, link: "/student-login", sub: "Resource Access", color: "bg-blue-600" },
            { title: "Admin Portal", icon: ShieldCheck, link: "/admin-login", sub: "System Control", color: "bg-white" }
          ].map((item, idx) => (
            <Link href={item.link} key={idx} className="group">
              <motion.div whileHover={{ y: -8 }} className="bg-slate-900 p-8 md:p-12 rounded-[25px] md:rounded-[50px] shadow-2xl border-2 border-transparent hover:border-blue-500 transition-all flex flex-col items-center">
                <div className={`w-14 h-14 md:w-20 md:h-20 ${item.color} ${idx === 1 ? 'text-slate-900' : 'text-white'} rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 shadow-xl`}>
                  <item.icon size={28} className="md:w-10 md:h-10" />
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-white mb-2 uppercase tracking-tighter">{item.title}</h3>
                <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mb-8">{item.sub}</p>
                <div className="w-full bg-white text-slate-900 py-4 md:py-5 rounded-xl md:rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] md:text-sm uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all">
                  Access Portal <ChevronRight size={16} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* 5. FACULTY SECTION */}
        <div className="w-full max-w-6xl text-center mb-16 md:mb-24">
          <h2 className="text-[9px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 italic">Academic Guidance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[
              { name: "Mrs. R. P. Pundkar", role: "Head of Dept" },
              { name: "Dr. A. B. Dube", role: "Asst. Professor" },
              { name: "Dr. S. M. Chavan", role: "Asst. Professor" },
              { name: "Ms. M. R. Gudade", role: "Asst. Professor" }
            ].map((fac, i) => (
              <div key={i} className="p-5 md:p-8 rounded-[20px] md:rounded-[35px] border border-slate-100 bg-slate-50/50 hover:bg-white transition-all shadow-sm">
                <UserCheck size={16} className="text-blue-600 mb-3 mx-auto" />
                <p className="text-[10px] md:text-sm font-black text-slate-900 uppercase leading-tight">{fac.name}</p>
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{fac.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. RESPONSIVE FOOTER */}
        <footer className="w-full py-10 md:py-16 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-purple-600 mb-1">Supervisor</p>
            <p className="text-[11px] md:text-sm font-black text-slate-900 leading-none">Mrs. R. P. Pundkar</p>
          </div>
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-indigo-600 mb-1">Project Guide</p>
            <p className="text-[11px] md:text-sm font-black text-slate-900 leading-none">Mr. A. S. Jadhao</p>
          </div>
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-blue-600 mb-1">Developer</p>
            <p className="text-[11px] md:text-sm font-black text-slate-900 leading-none">Mohammad Maaz</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-slate-400 font-black text-[9px] uppercase tracking-widest">© 2026 Dept. of Comp. Science</p>
            <p className="text-[10px] font-black uppercase text-blue-600 mt-1">CORE-MATRIX REPO v1.0</p>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes vertical-marquee { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .animate-vertical-marquee { animation: vertical-marquee 25s linear infinite; }
      `}</style>
    </div>
  )
}
