"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutGrid, Search, Plus, Upload, 
  Folder, FileText, CheckCircle, XCircle, Home 
} from 'lucide-react'

export default function AdminRepository() {
  // Default view "USERS" (Attendance) par rakha hai
  const [view, setView] = useState<'users' | 'files'>('users')

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* --- ORIGINAL HEADER (As per your Screenshot) --- */}
      <header className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Admin Repository</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Digital Academic Control</p>
          </div>
        </div>

        {/* --- THE TWO COMPULSORY BUTTONS --- */}
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <button 
            onClick={() => setView('files')}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'files' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Files
          </button>
          <button 
            onClick={() => setView('users')}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'users' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Users
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* --- BREADCRUMB / ACTION BAR --- */}
        <div className="flex justify-between items-center mb-12">
          <button className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100">
            <Home size={20} />
          </button>

          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
              <Plus size={18} /> New Folder
            </button>
            <button className="bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all">
              <Upload size={18} /> Upload
            </button>
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        {view === 'users' ? (
          /* ATTENDANCE / USERS VIEW */
          <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Student Attendance List</h3>
              <div className="relative w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-xs font-bold border-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-50">
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                    <td className="p-6 flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-xs">ST</div>
                      <p className="text-sm font-bold text-slate-800">Student Name Example {i}</p>
                    </td>
                    <td className="p-6 text-xs font-bold text-slate-400">2026-CS-0{i}</td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-6">
                        <button className="text-slate-200 hover:text-green-500 transition-colors"><CheckCircle size={24} /></button>
                        <button className="text-slate-200 hover:text-red-500 transition-colors"><XCircle size={24} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* FILES / DRIVE VIEW */
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[1, 2, 3, 4].map((f) => (
              <motion.div key={f} whileHover={{ y: -5 }} className="flex flex-col items-center group cursor-pointer">
                <div className="w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-blue-100">
                  <Folder size={32} />
                </div>
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">Semester {f}</p>
                <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">Folder</p>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-20 py-8 text-center border-t border-slate-50">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Developed By Mohammad Maaz</p>
      </footer>
    </div>
  )
}
