import { getCookies } from "@/lib/server-cookies"
import { BASE_API_URL, BASE_IMAGE_PROFILE } from "@/global"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { UserCog, ArrowLeft, Save } from "lucide-react"
import type { IUser } from "@/app/types"

async function getUser(id: string): Promise<IUser | null> {
  try {
    const TOKEN = await getCookies("token")
    const response = await fetch(`${BASE_API_URL}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    })

    const data = await response.json()

    if (data.status) {
      return data.data
    }
    return null
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

async function updateUser(id: string, formData: FormData) {
  "use server"

  try {
    const TOKEN = await getCookies("token")

    const response = await fetch(`${BASE_API_URL}/user/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      body: formData,
    })

    const data = await response.json()

    if (data.status) {
      redirect("/manager/user?success=User updated successfully")
    } else {
      // Handle error case
      return { error: data.message || "Failed to update user" }
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return { error: "An unexpected error occurred" }
  }
}

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id)

  if (!user) {
    redirect("/manager/user?error=User not found")
  }

  const updateUserWithId = updateUser.bind(null, params.id)

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/manager/user" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Users</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <UserCog className="h-8 w-8 mr-3 text-blue-600" />
            Edit User: {user.name}
          </h1>
          <p className="text-gray-600 mt-2">Update user information, change role, or reset password.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <form action={async (formData) => {
              const result = await updateUserWithId(formData);
              if (result?.error) {
                console.error(result.error);
              }
            }}>
              <div className="space-y-6">
                {/* Current Profile Picture */}
                {user.profile_picture && (
                  <div className="flex justify-center mb-6">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-blue-100">
                      <Image
                        src={`${BASE_IMAGE_PROFILE}/${user.profile_picture}`}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

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
                        name="name"
                        required
                        defaultValue={user.name}
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
                        name="email"
                        required
                        defaultValue={user.email}
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
                        name="phone_number"
                        required
                        pattern="[0-9]*"
                        inputMode="numeric"
                        defaultValue={user.phone_number}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="Enter phone number"
                      />
                      <p className="text-xs text-gray-500 mt-1">Numbers only, no spaces or special characters</p>
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-gray-500">(Leave blank to keep current)</span>
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="Enter new password"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Only fill this if you want to change the current password
                      </p>
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
                        name="role"
                        required
                        defaultValue={user.role}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      >
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
                        name="profile_picture"
                        accept="image/png, image/jpeg, image/jpg"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum file size: 2MB. Supported formats: JPG, JPEG, PNG
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                  <Link
                    href="/manager/user"
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>Update User</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
