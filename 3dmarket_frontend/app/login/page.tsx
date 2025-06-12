"use client"
import { BASE_API_URL } from "@/global"
import { storeCookie } from "@/lib/client-cookie"
import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { type FormEvent, useState, type ChangeEvent } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const LoginPage = () => {
  // Form states
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Sign up form states
  const [name, setName] = useState<string>("")
  const [signupEmail, setSignupEmail] = useState<string>("")
  const [signupPassword, setSignupPassword] = useState<string>("")
  const [showSignupPassword, setShowSignupPassword] = useState<boolean>(false)
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [isSignupLoading, setIsSignupLoading] = useState<boolean>(false)

  // Toggle between login and signup
  const [isLoginForm, setIsLoginForm] = useState<boolean>(true)

  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault()
      setIsLoading(true)

      const url = `${BASE_API_URL}/user/login`
      const payload = JSON.stringify({ email: email, password })
      const { data } = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      })

      if (data.status === true) {
        toast(data.message, {
          hideProgressBar: true,
          containerId: `toastLogin`,
          type: "success",
          autoClose: 2000,
        })

        storeCookie("token", data.token)
        storeCookie("id", data.data.id)
        storeCookie("name", data.data.name)
        storeCookie("role", data.data.role)
        storeCookie("profile_picture", data.data.profile_picture)
        storeCookie("phone_number", data.data.phone_number)

        const role = data.data.role
        if (role === `ADMIN`) setTimeout(() => router.replace(`/manager/dashboard`), 1000)
        else if (role === `USER`) setTimeout(() => router.replace(`/user/dashboard`), 1000)
      } else {
        toast(data.message, {
          hideProgressBar: true,
          containerId: `toastLogin`,
          type: "warning",
        })
      }
    } catch (error) {
      console.log(error)
      toast(`Something wrong`, {
        hideProgressBar: true,
        containerId: `toastLogin`,
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: FormEvent) => {
    try {
      e.preventDefault()
      setIsSignupLoading(true)

      // Replace with your actual signup API endpoint
      const url = `${BASE_API_URL}/user/register`
      const payload = JSON.stringify({
        name,
        email: signupEmail,
        password: signupPassword,
        role: "USER", // Always set role to USER
        phone_number: phoneNumber,
      })

      const { data } = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      })

      if (data.status === true) {
        toast(data.message || "Registration successful!", {
          hideProgressBar: true,
          containerId: `toastLogin`,
          type: "success",
          autoClose: 2000,
        })

        // Switch to login form after successful registration
        setIsLoginForm(true)

        // Optionally pre-fill the login form with the registered email
        setEmail(signupEmail)
      } else {
        toast(data.message || "Registration failed", {
          hideProgressBar: true,
          containerId: `toastLogin`,
          type: "warning",
        })
      }
    } catch (error) {
      console.log(error)
      toast(`Registration failed. Please try again.`, {
        hideProgressBar: true,
        containerId: `toastLogin`,
        type: "error",
      })
    } finally {
      setIsSignupLoading(false)
    }
  }

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm)
  }

  // Handle phone number input to only allow numbers
  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only update state if the input is numeric or empty
    if (value === "" || /^[0-9]+$/.test(value)) {
      setPhoneNumber(value)
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-dashboard-gradient relative overflow-hidden">
      {/* Glassmorphism card */}
      <div className="relative z-10 w-full max-w-md p-10 rounded-2xl glass-card shadow-xl flex flex-col items-center border border-white/10">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center drop-shadow-lg">Login</h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <input
            type="text"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 rounded-full input-dark placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent border-none mb-2"
            required
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 rounded-full input-dark placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent border-none mb-2"
            required
          />
          <div className="flex justify-between items-center text-secondary text-sm mb-2">
            <div></div>
            <button type="button" className="hover:underline font-semibold">Forgot Password?</button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full button-primary font-bold text-lg shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-secondary text-center">
          Don’t have an account?{' '}
          <button type="button" onClick={toggleForm} className="font-bold underline hover:text-accent">Sign up</button>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-[#232b39]/80 via-[#2d3748]/60 to-[#232b39]/80"></div>
      </div>
      <ToastContainer containerId={`toastLogin`} />
    </div>
  )
}

export default LoginPage
