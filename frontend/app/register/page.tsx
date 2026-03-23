"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

// --- INNER COMPONENT ---
function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "student"

  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [dob, setDob] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, dob, role })
      })

      const data = await res.json()
      alert(data.message)

      if (data.success) {
        router.push(role === "admin" ? "/admin-login" : "/student-login")
      }
    } catch (err) {
      alert("Registration failed. Please check the backend.")
    }
  }

  return (
    <div className="bg-blue-800/40 backdrop-blur-md p-10 rounded-2xl shadow-xl w-96">
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        {role === "admin" ? "Admin Registration" : "Student Registration"}
      </h1>
      <form onSubmit={handleRegister} className="space-y-5">
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none border border-white/10 focus:border-indigo-500" required />
        <input type="text" placeholder="Contact Number" value={contact} onChange={(e) => setContact(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none border border-white/10 focus:border-indigo-500" required />
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none border border-white/10 focus:border-indigo-500" required />
        <button className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all">Register</button>
      </form>
    </div>
  )
}

// --- MAIN EXPORT WITH SUSPENSE ---
export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-black">
      <Suspense fallback={<div className="text-white font-bold">Loading Registration...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
