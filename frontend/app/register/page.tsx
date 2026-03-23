"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function Register() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "student"

  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [dob, setDob] = useState("")

  const handleRegister = async (e: any) => {
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
        // Registration successful ho toh login page par bhej dein
        router.push(role === "admin" ? "/admin-login" : "/student-login")
      }
    } catch (err) {
      alert("Registration fail ho gayi. Backend check karein.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-black">
      <div className="bg-blue-800/40 backdrop-blur-md p-10 rounded-2xl shadow-xl w-96">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          {role === "admin" ? "Admin Registration" : "Student Registration"}
        </h1>
        <form onSubmit={handleRegister} className="space-y-5">
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none" required />
          <input type="text" placeholder="Contact Number" value={contact} onChange={(e) => setContact(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none" required />
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-3 rounded-lg bg-gray-900 text-white outline-none" required />
          <button className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">Register</button>
        </form>
      </div>
    </div>
  )
}