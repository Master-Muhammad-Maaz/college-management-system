"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function Home() {

return (

<div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col items-center">

{/* HEADER */}

<div className="text-center mt-12">

<h1 className="text-5xl font-bold tracking-wide">
COMPUTER SCIENCE DEPARTMENT
</h1>

<h2 className="text-2xl mt-3 text-sky-400">
E - REPOSITORY
</h2>

<p className="mt-6 text-gray-300 leading-relaxed">
Shri Shivaji Education Society, Amravati <br/>
Shri Shivaji College of Arts, Commerce & Science, Akola <br/>
NAAC Reaccredited with <b>"A++"</b> Grade (CGPA 3.58)
</p>

</div>


{/* LOGIN SECTION */}

<div className="flex gap-12 mt-20 flex-wrap justify-center">

{/* ADMIN LOGIN */}

<motion.div
whileHover={{scale:1.05}}
className="backdrop-blur-md bg-white/10 border border-white/20 p-10 rounded-2xl shadow-xl w-72 text-center">

<h2 className="text-2xl font-semibold mb-6">
Admin Login
</h2>

<Link href="/admin-login">
<button className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded-lg">
Login
</button>
</Link>

<p className="text-sm mt-4 text-gray-300">
Don't have account?{" "}
<Link href="/register" className="text-sky-400 underline">
Register here
</Link>
</p>

</motion.div>


{/* STUDENT LOGIN */}

<motion.div
whileHover={{scale:1.05}}
className="backdrop-blur-md bg-white/10 border border-white/20 p-10 rounded-2xl shadow-xl w-72 text-center">

<h2 className="text-2xl font-semibold mb-6">
Student Login
</h2>

<Link href="/student-login">
<button className="bg-indigo-600 hover:bg-indigo-700 w-full py-2 rounded-lg">
Login
</button>
</Link>

<p className="text-sm mt-4 text-gray-300">
Don't have account?{" "}
<Link href="/register" className="text-sky-400 underline">
Register here
</Link>
</p>

</motion.div>

</div>


{/* FACULTY */}

<div className="text-center mt-24">

<h2 className="text-2xl font-bold mb-4 text-sky-400">
Faculty
</h2>

<p>HOD : Ms. R. S. Kale</p>
<p>Dr. A. B. Dube</p>
<p>Dr. S. M. Chavan</p>
<p>Ms. M. R. Gudade</p>

<p className="mt-6 font-semibold">
Non Teaching Staff
</p>

<p>________</p>
<p>________</p>

</div>


{/* FOOTER */}

<div className="mt-20 mb-10 text-center text-gray-400">

<p>
Project Developed by <b className="text-white">Mohammed Maaz</b>
</p>

<p>
Under Guidance <b className="text-white">Mr. A. S. Jadhon</b>
</p>

</div>

</div>

)

}