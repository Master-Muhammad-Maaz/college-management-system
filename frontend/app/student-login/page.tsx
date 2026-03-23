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
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, dob, role: "student" })
      })

      const data = await res.json()
      
      if (data.success) {
        alert(data.message)
        router.push("/student-dashboard") // Student dashboard ka path yahan check karlein
      } else {
        alert(data.message)
      }
    } catch (err) {
      alert("Server se connection nahi ho paya. Backend check karein.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-black">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-800/40 backdrop-blur-md p-10 rounded-2xl shadow-xl w-96">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Student Login</h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <input type="text" placeholder="Contact Number" value={contact} onChange={(e) => setContact(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none" required />
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none" required />
          <button type="submit" className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">Login</button>
        </form>
        <p className="text-center text-gray-300 mt-4 text-sm">Don't have an account? <Link href="/register?role=student" className="text-blue-300 hover:underline">Register here</Link></p>
      </motion.div>
    </div>
  )
}