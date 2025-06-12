import { getCookies } from "@/lib/server-cookies"
import { BASE_API_URL, BASE_IMAGE_PROFILE } from "@/global"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { AlertTriangle, ArrowLeft, Trash2 } from "lucide-react"
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

async function deleteUser(id: string) {
  "use server"

  try {
    const TOKEN = await getCookies("token")

    const response = await fetch(`${BASE_API_URL}/user/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    })

    const data = await response.json()

    if (data.status) {
      redirect("/manager/user?success=User deleted successfully")
    } else {
      // Handle error case
      return { error: data.message || "Failed to delete user" }
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { error: "An unexpected error occurred" }
  }
}

export default async function DeleteUserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id)

  if (!user) {
    redirect("/manager/user?error=User not found")
  }

  const deleteUserWithId = deleteUser.bind(null, params.id)

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/manager/user" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Users</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <AlertTriangle className="h-8 w-8 mr-3 text-red-600" />
            Delete User
          </h1>
          <p className="text-gray-600 mt-2">You are about to permanently delete this user account.</p>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                <p className="text-red-800 font-medium">This action cannot be undone. Please confirm carefully.</p>
              </div>
            </div>

            <div className="flex items-center p-4 border border-gray-100 rounded-lg mb-6">
              <div className="flex-shrink-0 mr-4">
                {user.profile_picture ? (
                  <div className="relative h-16 w-16 rounded-full overflow-hidden">
                    <Image
                      src={`${BASE_IMAGE_PROFILE}/${user.profile_picture}`}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-xl">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-1">
                  {user.role === "ADMIN" ? (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Manager
                    </span>
                  ) : (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      User
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-yellow-800 font-medium">Important:</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Users with existing transaction data cannot be deleted. If this user has associated records, the
                    deletion may fail.
                  </p>
                </div>
              </div>
            </div>

            <form action={async (formData) => {
              const result = await deleteUserWithId();
              if (result?.error) {
                console.error(result.error);
              }
            }}>
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <Link
                  href="/manager/user"
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Delete Permanently</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
