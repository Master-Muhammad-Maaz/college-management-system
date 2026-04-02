"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, HardDrive, Search, Plus, Upload, 
  ChevronRight, Folder, FileText, ArrowLeft,
  CheckCircle, XCircle, MoreVertical
} from 'lucide-react'

export default function AdminManagementHub() {
  const [activeTab, setActiveTab] = useState<'attendance' | 'drive'>('attendance')
  const [searchQuery, setSearchQuery] = useState('')

  // Check for tab in URL (e.g., /admin/student?tab=drive)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('tab') === 'drive') setActiveTab('drive')
  }, [])

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      
      {/* --- HEADER SECTION --- */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Admin <span className="text-blue-600">Repository</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Digital Academic Control • {activeTab === 'attendance' ? 'Attendance' : 'E-Drive'}
          </p>
        </div>

        {/* --- PROFESSIONAL TAB SWITCHER --- */}
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'attendance' 
              ? 'bg-slate-900 text-white shadow-lg' 
              : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Users size={18} /> Attendance
          </button>
          <button
            onClick={() => setActiveTab('drive')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'drive' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <HardDrive size={18} /> E-Drive
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ATTENDANCE SYSTEM */}
          {activeTab === 'attendance' && (
            <motion.div
              key="attendance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search students by name or roll..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
                  <Upload size={18} /> Import Excel
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Name</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll No</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3].map((item) => (
                      <tr key={item} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                              SM
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">Sample Student {item}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">M.Sc CS Final Year</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-sm font-bold text-slate-600">2026-CS-{item}</td>
                        <td className="p-5">
                          <div className="flex justify-center gap-4">
                            <button className="text-slate-300 hover:text-green-500 transition-colors"><CheckCircle size={24} /></button>
                            <button className="text-slate-300 hover:text-red-500 transition-colors"><XCircle size={24} /></button>
                          </div>
                        </td>
                        <td className="p-5 text-right">
                          <button className="p-2 text-slate-400 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 2: E-DRIVE MANAGER */}
          {activeTab === 'drive' && (
            <motion.div
              key="drive"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                      <ArrowLeft size={20} />
                   </button>
                   <p className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     Root / <span className="text-blue-600">Assignments</span>
                   </p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                    <Plus size={18} /> New Folder
                  </button>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    <Upload size={18} /> Upload File
                  </button>
                </div>
              </div>

              {/* GRID VIEW */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[1, 2, 3, 4].map((f) => (
                  <motion.div 
                    key={f}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white border border-slate-200 p-6 rounded-[32px] flex flex-col items-center text-center group cursor-pointer hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                      <Folder size={32} className="text-blue-600 group-hover:text-white" />
                    </div>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-tighter truncate w-full">Folder Name {f}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">12 Files</p>
                  </motion.div>
                ))}
                
                <motion.div 
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white border border-slate-200 p-6 rounded-[32px] flex flex-col items-center text-center group cursor-pointer hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                    <FileText size={32} className="text-indigo-600 group-hover:text-white" />
                  </div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-tighter truncate w-full">Syllabus.pdf</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">2.4 MB</p>
                </motion.div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* --- FOOTER / CREDIT --- */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-200 flex justify-between items-center opacity-50">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Integrated Academic Repository</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Dev: Mohammad Maaz</p>
      </div>
    </div>
  )
}
