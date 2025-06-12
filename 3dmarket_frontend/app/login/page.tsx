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
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image src="/image/Background.png" alt="Port background" fill className="object-cover" priority />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(13, 110, 253, 0.8), rgba(13, 110, 253, 0))",
          }}
        ></div>
      </div>

      <ToastContainer containerId={`toastLogin`} />

      <div className="relative z-10 w-full h-full flex flex-col justify-between p-8">
        {/* Top section with company name */}
        <div className="flex items-center">
          <div className="flex items-center">
            <Image src="/image/Logo_Horizon.png" alt="HORIZON Logo" width={36} height={36} className="mr-3" />
            <span className="text-white font-medium text-xl">HORIZON</span>
          </div>
        </div>

        {/* Middle section with forms container */}
        <div className="relative max-w-md">
          {/* Form container with fixed height */}
          <div className="relative" style={{ height: "500px" }}>
            {/* Login Form */}
            <div
              className={`transition-all duration-500 ease-in-out absolute inset-0 ${
                isLoginForm ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"
              }`}
            >
              <h1 className="text-3xl font-bold text-white mb-8">Access your account</h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email field */}
                <div className="relative">
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-blue-800/50 text-white border border-blue-700/50 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-blue-300"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-blue-300"
                    >
                      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                    </svg>
                  </div>
                </div>

                {/* Password field */}
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password-industri-app"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-blue-800/50 text-white border border-blue-700/50 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-blue-300"
                    required
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-blue-300"
                      >
                        <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                        <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                        <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-blue-300"
                      >
                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                        <path
                          fillRule="evenodd"
                          d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                <div className="text-blue-300 text-sm">
                  <button type="button" className="hover:text-blue-100 transition-colors">
                    Forget password
                  </button>
                </div>

                {/* Login button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-md text-white font-medium 
                    ${isLoading ? "bg-cyan-600 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-400"} 
                    transition-all`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Process...
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-blue-300">
                    Don't Have Account?{" "}
                    <button type="button" onClick={toggleForm} className="text-white hover:underline">
                      Sign in
                    </button>
                  </p>
                </div>
              </form>
            </div>

            {/* Sign Up Form */}
            <div
              className={`transition-all duration-500 ease-in-out absolute inset-0 ${
                !isLoginForm ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
              }`}
            >
              <h1 className="text-3xl font-bold text-white mb-8">Create an account</h1>

              <form onSubmit={handleSignup} className="space-y-4">
                {/* Name field */}
                <div className="relative">
                  <label htmlFor="name" className="sr-only">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-blue-800/50 text-white border border-blue-700/50 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-blue-300"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-blue-300"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Email field */}
                <div className="relative">
                  <label htmlFor="signup-email" className="sr-only">
                    Email
                  </label>
                  <input
                    type="email"
                    id="signup-email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-blue-800/50 text-white border border-blue-700/50 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-blue-300"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-blue-300"
                    >
                      <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                      <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                    </svg>
                  </div>
                </div>

                {/* Password field */}
                <div className="relative">
                  <label htmlFor="signup-password" className="sr-only">
                    Password
                  </label>
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    id="signup-password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-blue-800/50 text-white border border-blue-700/50 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-blue-300"
                    required
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                  >
                    {showSignupPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-blue-300"
                      >
                        <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                        <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                        <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-blue-300"
                      >
                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                        <path
                          fillRule="evenodd"
                          d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Phone Number field - now with numeric input only */}
                <div className="relative">
                  <label htmlFor="phone-number" className="sr-only">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone-number"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="Phone Number"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    className="w-full bg-blue-800/50 text-white border border-blue-700/50 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-blue-300"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-blue-300"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Sign up button */}
                <button
                  type="submit"
                  disabled={isSignupLoading}
                  className={`w-full py-3 rounded-md text-white font-medium 
                    ${isSignupLoading ? "bg-cyan-600 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-400"} 
                    transition-all`}
                >
                  {isSignupLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Process...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-blue-300">
                    Already have an account?{" "}
                    <button type="button" onClick={toggleForm} className="text-white hover:underline">
                      Login
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="text-blue-300 text-sm">
          <p>&copy; {new Date().getFullYear()} HORIZON</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
