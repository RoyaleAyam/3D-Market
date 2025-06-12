"use client"

import type React from "react"

import { useState, useRef, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { UserPlus } from "lucide-react"
import { BASE_API_URL } from "@/global"
import { post } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookie"

type AddUserProps = {
  buttonStyle?: "default" | "large"
}

export default function AddUser({ buttonStyle = "default" }: AddUserProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [role, setRole] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const openModal = () => {
    setName("")
    setEmail("")
    setPassword("")
    setPhoneNumber("")
    setRole("")
    setFile(null)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only update state if the input is numeric or empty
    if (value === "" || /^[0-9]+$/.test(value)) {
      setPhoneNumber(value)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const TOKEN = getCookie("token") || ""
      const url = `${BASE_API_URL}/user/create`

      const payload = new FormData()
      payload.append("name", name)
      payload.append("email", email)
      payload.append("password", password)
      payload.append("phone_number", phoneNumber)
      payload.append("role", role)

      if (file) {
        payload.append("profile_picture", file)
      }

      const { data } = await post(url, payload, TOKEN)

      if (data?.status) {
        toast.success(data.message || "User created successfully", {
          hideProgressBar: true,
          containerId: `toastUser`,
        })
        closeModal()
        router.refresh()
      } else {
        // Display the exact error message from the backend
        toast.warning(data?.message || "Failed to create user", {
          hideProgressBar: true,
          containerId: `toastUser`,
        })
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong", {
        hideProgressBar: true,
        containerId: `toastUser`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {buttonStyle === "default" ? (
        <button
          onClick={openModal}
          className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-lg shadow-md hover:shadow-lg 
          transform hover:-translate-y-1 transition-all duration-300 
          flex items-center gap-2"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add User</span>
        </button>
      ) : (
        <button
          onClick={openModal}
          className="px-6 py-3 text-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 
          text-white font-medium rounded-lg shadow-md hover:shadow-lg 
          transform hover:-translate-y-1 transition-all duration-300 
          inline-flex items-center gap-2"
        >
          <UserPlus className="h-6 w-6" />
          <span>Add User</span>
        </button>
      )}

      {/* Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          {/* Modal Content */}
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <UserPlus className="h-6 w-6 mr-2 text-blue-600" />
                  Add New User
                </h2>
                <p className="text-gray-600 text-sm">
                  Create a new user account with appropriate role and permissions.
                </p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          placeholder="Enter full name"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          placeholder="email@example.com"
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone_number"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          required
                          pattern="[0-9]*"
                          inputMode="numeric"
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          placeholder="Enter phone number"
                        />
                        <p className="text-xs text-gray-500 mt-1">Numbers only, no spaces or special characters</p>
                      </div>

                      {/* Password */}
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          placeholder="Create a strong password"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Role & Profile Picture */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                      Role & Profile Picture
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Role */}
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                          Role <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="role"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          required
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        >
                          <option value="">Select a role</option>
                          <option value="ADMIN">Manager</option>
                          <option value="USER">User</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Managers have full access to the system. Users have limited access.
                        </p>
                      </div>

                      {/* Profile Picture */}
                      <div>
                        <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700 mb-1">
                          Profile Picture <span className="text-gray-500">(Optional)</span>
                        </label>
                        <input
                          type="file"
                          id="profile_picture"
                          onChange={handleFileChange}
                          accept="image/png, image/jpeg, image/jpg"
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Maximum file size: 2MB. Supported formats: JPG, JPEG, PNG
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-4 sticky bottom-0 bg-white z-10">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                {isLoading ? (
                  <>
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
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>Create User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
