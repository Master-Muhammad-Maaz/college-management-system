"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ShieldCheck, GraduationCap, ChevronRight, Award, Binary, Cpu, UserCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden relative font-sans selection:bg-blue-100">
      
      {/* DYNAMIC BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-blue-50/60 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[100px]"></div>
      </div>

      {/* SCROLLING ANNOUNCEMENT */}
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
        
        {/* HERO SECTION - COMPACT & WIDE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-12 mb-12 w-full"
        >
          <h1 className="text-7xl md:text-[130px] font-black tracking-tighter leading-[0.8] text-slate-900 mb-4 uppercase">
            COMPUTER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Science</span>
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[2px] w-10 bg-blue-600"></div>
            <h2 className="text-3xl md:text-5xl font-black tracking-[0.2em] text-slate-800 uppercase">
              CORE-MATRIX REPO
            </h2>
            <div className="h-[2px] w-10 bg-blue-600"></div>
          </div>

          <div className="inline-flex flex-col items-center gap-2 mb-8 p-6 rounded-[30px] bg-slate-50/80 border border-slate-200 backdrop-blur-sm w-full max-w-4xl shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Award size={20} />
              <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em]">
                NAAC Reaccredited <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md">"A++"</span> Grade (CGPA 3.58)
              </span>
            </div>
            <div className="h-[1px] w-full bg-slate-200 my-1"></div>
            <p className="text-[11px] md:text-sm text-slate-500 font-bold uppercase tracking-[0.3em] leading-relaxed">
              Shri Shivaji Education Society, Amravati <br/>
              <span className="text-slate-900 font-black text-sm md:text-base">Shri Shivaji College of Arts, Commerce & Science, Akola</span>
            </p>
          </div>
        </motion.div>

        {/* ACCESS PORTALS - UNIFIED DARK THEME */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl px-4 mb-16">
          {[
            { title: "Student Hub", icon: GraduationCap, link: "/student-login", sub: "Digital Resource Access", accent: "bg-blue-600" },
            { title: "Admin Portal", icon: ShieldCheck, link: "/admin-login", sub: "Management Control", accent: "bg-white text-slate-900" }
          ].map((item, idx) => (
            <Link href={item.link} key={idx} className="group">
              <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-900 p-8 rounded-[40px] shadow-2xl border-2 border-slate-900 hover:border-blue-500 transition-all flex flex-col items-center">
                <div className={`w-16 h-16 ${idx === 0 ? 'bg-blue-600' : 'bg-white'} rounded-2xl flex items-center justify-center mb-6 shadow-xl`}>
                  <item.icon size={32} className={idx === 0 ? 'text-white' : 'text-slate-900'} />
                </div>
                <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{item.title}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8">{item.sub}</p>
                <div className="w-full bg-white text-slate-900 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {idx === 0 ? 'Login' : 'Authorize'} <ChevronRight size={16} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* FACULTY SECTION - COMPACT GRID */}
        <div className="w-full max-w-6xl text-center mb-16">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-8 italic">Academic Leadership & Guidance</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Ms. R. S. Kale", role: "Head of Dept", color: "text-blue-600" },
              { name: "Mr. A. S. Jadhao", role: "Assistant Professor", color: "text-indigo-600" },
              { name: "Dr. A. B. Dube", role: "Assistant Professor", color: "text-slate-500" },
              { name: "Dr. S. M. Chavan", role: "Assistant Professor", color: "text-slate-500" },
              { name: "Ms. M. R. Gudade", role: "Assistant Professor", color: "text-slate-500" }
            ].map((fac, i) => (
              <div key={i} className="p-6 rounded-[30px] border border-slate-100 bg-slate-50/50 flex flex-col items-center hover:bg-white hover:shadow-lg transition-all">
                <UserCheck size={18} className={`${fac.color} mb-3`} />
                <p className="text-[11px] font-black text-slate-900 uppercase leading-tight">{fac.name}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{fac.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="w-full py-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white text-xl shadow-lg ring-4 ring-slate-50">M</div>
            <div className="text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-blue-600">Lead Developer</p>
              <p className="text-base font-black text-slate-900 tracking-tighter">Mohammad Maaz</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.2em]">© 2026 Dept. of Computer Science</p>
            <p className="text-slate-900 font-black text-[9px] uppercase tracking-widest mt-0.5">CORE-MATRIX REPO v1.0</p>
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
