import type { IUser } from "@/app/types"
import { getCookies } from "@/lib/server-cookies"
import { BASE_API_URL, BASE_IMAGE_PROFILE } from "@/global"
import { get } from "@/lib/api-bridge"
import Image from "next/image"
import { Search, UserCog, Filter, ChevronDown } from "lucide-react"
import AddUser from "./components/add-user"
import EditUser from "./components/edit-user"
import DeleteUser from "./components/delete-user"

const getUser = async (search: string): Promise<IUser[]> => {
  try {
    const TOKEN = await getCookies("token")
    const url = `${BASE_API_URL}/user?search=${search}`
    const { data } = await get(url, TOKEN)
    let result: IUser[] = []
    if (data?.status) result = [...data.data]
    return result
  } catch (error) {
    console.log(error)
    return []
  }
}

const UserPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const search = searchParams.search ? searchParams.search.toString() : ``
  const users: IUser[] = await getUser(search)

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg mb-8 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 opacity-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              className="absolute bottom-0 left-0 w-full"
              preserveAspectRatio="none"
            >
              <path
                fill="white"
                fillOpacity="1"
                d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,186.7C960,192,1056,224,1152,218.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div className="relative z-10 px-8 py-12 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">User Management</h1>
              <p className="text-blue-100 max-w-lg">
                Manage users, assign roles, and control access to the system. Add new users, update existing
                ones, or remove accounts as needed.
              </p>
              <div className="flex items-center mt-4 text-blue-100">
                <div className="flex items-center mr-6">
                  <UserCog className="h-5 w-5 mr-2" />
                  <span>{users.length} Users</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <AddUser />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <form action="/manager/user" method="GET">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  id="search"
                  name="search"
                  defaultValue={search}
                  className="pl-12 text-sm w-full rounded-lg p-3 text-black bg-white border border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300"
                  placeholder="Search users by name or email..."
                />
                {search && (
                  <a
                    href="/manager/user"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                  </a>
                )}
              </div>
            </form>
          </div>
          {/* <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div> */}
        </div>
      </div>

      {/* Users List */}
      {users.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-md text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-blue-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <UserCog className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600 mb-6">
              {search
                ? "No users match your search criteria. Try adjusting your search term."
                : "Your team is empty. Add your first team member to get started."}
            </p>
            <AddUser buttonStyle="large" />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={`user-${index}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          {user.profile_picture ? (
                            <Image
                              src={`${BASE_IMAGE_PROFILE}/${user.profile_picture}`}
                              alt={user.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            Created: {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === "ADMIN" ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Manager
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone_number || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <EditUser selectedUser={user} />
                        <DeleteUser selectedUser={user} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserPage
