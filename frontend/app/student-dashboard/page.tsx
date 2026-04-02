"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ShieldCheck, GraduationCap, ChevronRight, Award, UserCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden relative font-sans selection:bg-blue-100">
      
      {/* 0. VERTICAL UPWARD MARQUEE (LEFT SIDE) */}
      <div className="fixed left-0 top-0 h-full w-6 md:w-8 bg-slate-900 z-[60] flex flex-col items-center justify-center overflow-hidden border-r border-slate-800 shadow-2xl">
        <div className="flex flex-col whitespace-nowrap animate-vertical-marquee">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="text-[8px] md:text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 py-20 opacity-80">
              NEXT UPGRADE EXPECTED BY 2029 ——— SYSTEM STABILITY VERIFIED ——— 
            </span>
          ))}
        </div>
      </div>

      {/* DYNAMIC BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none pl-8">
        <div className="absolute top-[-5%] right-[-5%] w-[300px] md:w-[700px] h-[300px] md:h-[700px] bg-blue-50/60 rounded-full blur-[80px] md:blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-50/50 rounded-full blur-[70px] md:blur-[100px]"></div>
      </div>

      {/* 1. FLOATING ANNOUNCEMENT LINE */}
      <div className="relative z-50 bg-slate-900 py-2 md:py-2.5 overflow-hidden border-b border-slate-800 ml-6 md:ml-8">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-[9px] md:text-xs font-bold text-blue-400 uppercase tracking-[0.2em] px-4">
            This project, titled “CORE-MATRIX REPO”, has been successfully completed by Mohammed Maaz Mohammed Niyaz as part of the M.Sc. II (Computer Science) curriculum for the academic year 2025–26. ——— 
          </span>
          <span className="text-[9px] md:text-xs font-bold text-blue-400 uppercase tracking-[0.2em] px-4">
            This project, titled “CORE-MATRIX REPO”, has been successfully completed by Mohammed Maaz Mohammed Niyaz as part of the M.Sc. II (Computer Science) curriculum for the academic year 2025–26.
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center ml-6 md:ml-8">
        
        {/* 2. COLLEGE DETAIL BOX */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 md:mt-8 mb-8 md:mb-10 p-4 md:p-6 rounded-[25px] md:rounded-[35px] bg-slate-50/80 border border-slate-200 backdrop-blur-sm w-full max-w-4xl shadow-sm text-center"
        >
          <div className="flex items-center justify-center gap-2 text-blue-600 mb-2 md:mb-3">
            <Award size={14} className="md:w-[18px]" />
            <span className="text-[8px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em]">
              NAAC Reaccredited <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-md">"A++"</span> Grade (CGPA 3.58)
            </span>
          </div>
          <div className="h-[1px] w-full bg-slate-200 my-2 opacity-50"></div>
          <p className="text-[9px] md:text-[12px] text-slate-500 font-bold uppercase tracking-[0.15em] md:tracking-[0.3em] leading-relaxed">
            Shri Shivaji Education Society, Amravati<br/>
            <span className="text-slate-900 font-black text-[10px] md:text-lg block mt-1 tracking-normal md:tracking-[0.1em]">
              Shri Shivaji College of Arts, Commerce & Science, Akola
            </span>
          </p>
        </motion.div>

        {/* 3. HERO TITLES */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10 md:mb-12 w-full px-2"
        >
          <h1 className="text-5xl md:text-[140px] font-black tracking-tighter leading-[0.9] md:leading-[0.75] text-slate-900 mb-4 uppercase break-words">
            COMPUTER <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Science</span>
          </h1>
          
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <div className="h-[1px] md:h-[2px] w-6 md:w-8 bg-blue-600 opacity-30"></div>
            <h2 className="text-lg md:text-5xl font-black tracking-[0.1em] md:tracking-[0.15em] text-slate-800 uppercase">
              CORE-MATRIX REPO
            </h2>
            <div className="h-[1px] md:h-[2px] w-6 md:w-8 bg-blue-600 opacity-30"></div>
          </div>
        </motion.div>

        {/* 4. ACCESS PORTALS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-5xl px-2 md:px-4 mb-12 md:mb-16">
          {[
            { title: "Student Hub", icon: GraduationCap, link: "/student-login", sub: "Digital Resource Access" },
            { title: "Admin Portal", icon: ShieldCheck, link: "/admin-login", sub: "Management Control" }
          ].map((item, idx) => (
            <Link href={item.link} key={idx} className="group">
              <motion.div whileHover={{ y: -5 }} className="bg-slate-900 p-6 md:p-8 rounded-[30px] md:rounded-[40px] shadow-xl border-2 border-slate-900 hover:border-blue-500 transition-all flex flex-col items-center">
                <div className={`w-12 h-12 md:w-14 md:h-14 ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-white text-slate-900'} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg`}>
                  <item.icon size={24} className="md:w-[28px]" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-1 uppercase tracking-tight">{item.title}</h3>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6 md:mb-8">{item.sub}</p>
                <div className="w-full bg-white text-slate-900 py-3 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 font-black text-[9px] md:text-[10px] uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {idx === 0 ? 'Login' : 'Authorize'} <ChevronRight size={12} className="md:w-[14px]" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* 5. FACULTY SECTION */}
        <div className="w-full max-w-6xl text-center mb-12 md:mb-16">
          <h2 className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-slate-400 mb-6 md:mb-8 italic">Academic Leadership & Guidance</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {[
              { name: "Ms. R. S. Kale", role: "Head of Dept", color: "text-blue-600" },
              { name: "Mr. A. S. Jadhao", role: "Assistant Professor", color: "text-indigo-600" },
              { name: "Dr. A. B. Dube", role: "Assistant Professor", color: "text-slate-500" },
              { name: "Dr. S. M. Chavan", role: "Assistant Professor", color: "text-slate-500" },
              { name: "Ms. M. R. Gudade", role: "Assistant Professor", color: "text-slate-500" }
            ].map((fac, i) => (
              <div key={i} className="p-4 md:p-6 rounded-[20px] md:rounded-[30px] border border-slate-100 bg-slate-50/50 flex flex-col items-center hover:bg-white transition-all shadow-sm">
                <UserCheck size={14} className={`${fac.color} mb-2 md:mb-3 md:w-[16px]`} />
                <p className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase leading-tight">{fac.name}</p>
                <p className="text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{fac.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. UPDATED FOOTER */}
        <footer className="w-full py-8 md:py-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 items-center gap-6 md:gap-4">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-black text-white text-lg">M</div>
            <div className="text-left">
              <p className="text-[7px] font-black uppercase tracking-widest text-blue-600 mb-0.5">Developer</p>
              <p className="text-xs font-black text-slate-900">Mohammad Maaz</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-slate-400 font-black text-[8px] uppercase tracking-[0.1em]">© 2026 Dept. of Comp. Science</p>
            <p className="text-slate-900 font-black text-[8px] uppercase tracking-widest">v1.0 REPO</p>
          </div>

          <div className="text-center border-y md:border-y-0 md:border-x border-slate-100 py-4 md:py-0">
            <p className="text-[7px] font-black uppercase tracking-widest text-purple-600 mb-0.5">Supervisor</p>
            <p className="text-xs font-black text-slate-900">Mrs. R. P. Pundkar</p>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-end">
            <div className="text-right">
              <p className="text-[7px] font-black uppercase tracking-widest text-indigo-600 mb-0.5">Project Guide</p>
              <p className="text-xs font-black text-slate-900 italic">Mr. A. S. Jadhao</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-black text-blue-600 text-lg border border-blue-100">J</div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes vertical-marquee { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        .animate-marquee { animation: marquee 35s linear infinite; }
        .animate-vertical-marquee { animation: vertical-marquee 20s linear infinite; }
      `}</style>
    </div>
  )
}
