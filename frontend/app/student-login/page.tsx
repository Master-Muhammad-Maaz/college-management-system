"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function StudentLogin() {
  const router = useRouter()
  const [contact, setContact] = useState("")
  const [dob, setDob] = useState("")

  const handleLogin = async (e: any) => {
    e.preventDefault()

    try {
      // FINAL FIX: Render URL added here
      const API_BASE_URL = "https://college-management-system-ae1l.onrender.com";

      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, dob, role: "student" })
      })

      const data = await res.json()
      
      if (data.success) {
        alert("Login Successful!")
        // User data ko localStorage mein save kar sakte hain agar dashboard pe naam dikhana ho
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/student-dashboard") 
      } else {
        alert(data.message || "Invalid credentials")
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Server se connection nahi ho paya. Please check if backend is live.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-black p-4">
      <motion.div 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-blue-800/40 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-md border border-white/10"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-8">Student Login</h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-white text-xs mb-1 block opacity-70">Contact Number</label>
            <input 
              type="text" 
              placeholder="Enter registered mobile" 
              value={contact} 
              onChange={(e) => setContact(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none border border-white/10 focus:border-indigo-500 transition-all" 
              required 
            />
          </div>

          <div>
            <label className="text-white text-xs mb-1 block opacity-70">Date of Birth</label>
            <input 
              type="date" 
              value={dob} 
              onChange={(e) => setDob(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none border border-white/10 focus:border-indigo-500 transition-all" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all mt-2"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-300 text-sm">
            Don't have an account? <Link href="/register?role=student" className="text-sky-400 hover:underline font-medium">Register here</Link>
          </p>
          <Link href="/" className="inline-block text-xs text-gray-500 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
