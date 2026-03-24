"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function AdminLogin() {
  const router = useRouter()
  const [contact, setContact] = useState("")
  const [dob, setDob] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      // FINAL RENDER BACKEND URL
      const backendUrl = "https://college-management-system-ae1l.onrender.com/api/login"

      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contact, 
          dob, 
          role: "admin" 
        })
      })

      const data = await res.json()
      
      if (res.ok && data.success) {
        alert("Login Successful! Welcome Admin.")
        
        // Agar aap JWT token use kar rahe hain toh ise save karein
        if (data.token) {
          localStorage.setItem("token", data.token)
        }
        
        // Dashboard par bhejien
        router.push("/admin-dashboard")
      } else {
        // Database mein agar user nahi mila toh ye message dikhayega
        alert(data.message || "Login failed. Please check your Contact Number and DOB.")
      }
    } catch (error) {
      console.error("Login Error:", error)
      alert("Server se connection nahi ho paa raha. Please check if Backend is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-black">
      <motion.div 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-blue-800/40 backdrop-blur-md p-10 rounded-2xl shadow-xl w-96"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-8">Admin Login</h1>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-white text-sm mb-1 block">Contact Number</label>
            <input 
              type="text" 
              placeholder="Enter Contact Number" 
              value={contact} 
              onChange={(e) => setContact(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none border border-gray-700 focus:border-indigo-500" 
              required 
            />
          </div>

          <div>
            <label className="text-white text-sm mb-1 block">Date of Birth</label>
            <input 
              type="date" 
              value={dob} 
              onChange={(e) => setDob(e.target.value)} 
              className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none border border-gray-700 focus:border-indigo-500" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6 text-sm">
          Don't have an account?{" "}
          <Link href="/register?role=admin" className="text-blue-300 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
