"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ShieldCheck, GraduationCap, ChevronRight, Award, UserCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden relative font-sans selection:bg-blue-100">
      
      {/* DYNAMIC BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-blue-50/60 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[100px]"></div>
      </div>

      {/* 1. FLOATING ANNOUNCEMENT LINE */}
      <div className="relative z-50 bg-slate-900 py-2.5 overflow-hidden border-b border-slate-800">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-[10px] md:text-xs font-bold text-blue-400 uppercase tracking-[0.2em] px-4">
            This project, titled “CORE-MATRIX REPO”, has been successfully completed by Mohammed Maaz Mohammed Niyaz as part of the M.Sc. II (Computer Science) curriculum for the academic year 2025–26. This project was carried out under the guidance of Mr. A. S. Jadhao and the supervision of Ms. R. S. Kale, Head, Department of Computer Science. ——— 
          </span>
          <span className="text-[10px] md:text-xs font-bold text-blue-400 uppercase tracking-[0.2em] px-4">
            This project, titled “CORE-MATRIX REPO”, has been successfully completed by Mohammed Maaz Mohammed Niyaz as part of the M.Sc. II (Computer Science) curriculum for the academic year 2025–26. This project was carried out under the guidance of Mr. A. S. Jadhao and the supervision of Ms. R. S. Kale, Head, Department of Computer Science.
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* 2. COLLEGE DETAIL BOX */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 mb-10 p-6 rounded-[35px] bg-slate-50/80 border border-slate-200 backdrop-blur-sm w-full max-w-4xl shadow-sm text-center"
        >
          <div className="flex items-center justify-center gap-2 text-blue-600 mb-3">
            <Award size={18} />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
              NAAC Reaccredited <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-[9px] md:text-[11px]">"A++"</span> Grade (CGPA 3.58)
            </span>
          </div>
          <div className="h-[1px] w-full bg-slate-200 my-2 opacity-50"></div>
          <p className="text-[10px] md:text-[12px] text-slate-500 font-bold uppercase tracking-[0.3em] leading-relaxed">
            Shri Shivaji Education Society, Amravati<br/>
            <span className="text-slate-900 font-black text-xs md:text-lg block mt-1 tracking-normal md:tracking-[0.1em]">
              Shri Shivaji College of Arts, Commerce & Science, Akola
            </span>
          </p>
        </motion.div>

        {/* 3. HERO TITLES */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12 w-full"
        >
          <h1 className="text-7xl md:text-[140px] font-black tracking-tighter leading-[0.75] text-slate-900 mb-2 uppercase">
            COMPUTER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Science</span>
          </h1>
          
          <div className="flex items-center justify-center gap-4">
            <div className="h-[2px] w-8 bg-blue-600 opacity-30"></div>
            <h2 className="text-2xl md:text-5xl font-black tracking-[0.15em] text-slate-800 uppercase">
              CORE-MATRIX REPO
            </h2>
            <div className="h-[2px] w-8 bg-blue-600 opacity-30"></div>
          </div>
        </motion.div>

        {/* 4. ACCESS PORTALS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-4 mb-16">
          {[
            { title: "Student Hub", icon: GraduationCap, link: "/student-login", sub: "Digital Resource Access" },
            { title: "Admin Portal", icon: ShieldCheck, link: "/admin-login", sub: "Management Control" }
          ].map((item, idx) => (
            <Link href={item.link} key={idx} className="group">
              <motion.div whileHover={{ y: -5 }} className="bg-slate-900 p-8 rounded-[40px] shadow-2xl border-2 border-slate-900 hover:border-blue-500 transition-all flex flex-col items-center">
                <div className={`w-14 h-14 ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-white text-slate-900'} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <item.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{item.title}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8">{item.sub}</p>
                <div className="w-full bg-white text-slate-900 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {idx === 0 ? 'Login' : 'Authorize'} <ChevronRight size={14} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* 5. FACULTY SECTION */}
        <div className="w-full max-w-6xl text-center mb-16">
          <h2 className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400 mb-8 italic">Academic Leadership & Guidance</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Ms. R. S. Kale", role: "Head of Dept", color: "text-blue-600" },
              { name: "Mr. A. S. Jadhao", role: "Assistant Professor", color: "text-indigo-600" },
              { name: "Dr. A. B. Dube", role: "Assistant Professor", color: "text-slate-500" },
              { name: "Dr. S. M. Chavan", role: "Assistant Professor", color: "text-slate-500" },
              { name: "Ms. M. R. Gudade", role: "Assistant Professor", color: "text-slate-500" }
            ].map((fac, i) => (
              <div key={i} className="p-6 rounded-[30px] border border-slate-100 bg-slate-50/50 flex flex-col items-center hover:bg-white transition-all shadow-sm">
                <UserCheck size={16} className={`${fac.color} mb-3`} />
                <p className="text-[10px] font-black text-slate-900 uppercase leading-tight">{fac.name}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{fac.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. UPDATED FOOTER WITH DUAL CREDITS */}
        <footer className="w-full py-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            {/* Developer Maaz */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-black text-white text-lg shadow-lg ring-4 ring-slate-50">M</div>
              <div className="text-left">
                <p className="text-[8px] font-black uppercase tracking-widest text-blue-600 leading-none mb-1">Lead Developer</p>
                <p className="text-sm font-black text-slate-900 tracking-tighter">Mohammad Maaz</p>
              </div>
            </div>
            {/* Guide Mr. Jadhao */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-8">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-black text-blue-600 text-lg shadow-sm border border-blue-100">J</div>
              <div className="text-left">
                <p className="text-[8px] font-black uppercase tracking-widest text-indigo-600 leading-none mb-1">Project Guide</p>
                <p className="text-sm font-black text-slate-900 tracking-tighter">Mr. A. S. Jadhao</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 font-black text-[8px] uppercase tracking-[0.2em]">© 2026 Dept. of Computer Science</p>
            <p className="text-slate-900 font-black text-[8px] uppercase tracking-widest mt-0.5">CORE-MATRIX REPO v1.0</p>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
      `}</style>
    </div>
  )
}
