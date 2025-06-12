import type { IMenu } from "@/app/types"
import { getCookies } from "@/lib/server-cookies"
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global"
import { get } from "@/lib/api-bridge"
import Image from "next/image"
import Link from "next/link"
import { BikeIcon as Motorcycle, Tag, Clock, ChevronRight, CheckCircle } from "lucide-react"
import { formatPrice, formatKilometer, formatClass, formatBrand } from "@/lib/utilis"
import EditMenu from "./editMenu"
import DeleteMenu from "./deleteMenu"
import AddMenu from "./addMenu"

const getMenu = async (search: string, sort = "", classFilter = ""): Promise<IMenu[]> => {
  try {
    const TOKEN = await getCookies("token")
    const url = `${BASE_API_URL}/M?search=${search}`
    const { data } = await get(url, TOKEN)
    let result: IMenu[] = []
    if (data?.status) result = [...data.data]

    // Apply class filtering if specified
    if (classFilter && classFilter !== "all") {
      result = result.filter((item) => item.Class === classFilter)
    }

    // Apply sorting
    if (sort) {
      switch (sort) {
        case "newest":
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        case "oldest":
          result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          break
        case "price-high":
          result.sort((a, b) => b.price - a.price)
          break
        case "price-low":
          result.sort((a, b) => a.price - b.price)
          break
      }
    }

    return result
  } catch (error) {
    console.log(error)
    return []
  }
}

const MenuPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const search = searchParams.search ? searchParams.search.toString() : ``
  const sort = searchParams.sort ? searchParams.sort.toString() : "newest"
  const classFilter = searchParams.class ? searchParams.class.toString() : "all"

  const menu: IMenu[] = await getMenu(search, sort, classFilter)

  // Helper function to generate filter URLs
  const getFilterUrl = (newClass: string) => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (sort) params.set("sort", sort)
    params.set("class", newClass)
    return `/manager/product?${params.toString()}`
  }

  // Helper function to generate sort URLs
  const getSortUrl = (newSort: string) => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    params.set("sort", newSort)
    if (classFilter !== "all") params.set("class", classFilter)
    return `/manager/product?${params.toString()}`
  }

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 rounded-2xl overflow-hidden mb-8 shadow-xl">
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
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Motorcycle Collection</h1>
            <p className="text-blue-100 max-w-lg">
              Manage your premium motorcycle inventory with ease. Add new models, update details, and showcase your
              collection to customers.
            </p>
            <div className="flex items-center mt-4 text-blue-100">
              <div className="flex items-center mr-6">
                <Motorcycle className="h-5 w-5 mr-2" />
                <span>{menu.length} Models</span>
              </div>
              <div className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                <span>Premium Collection</span>
              </div>
            </div>
          </div>
            <div className="ml-4 hover:-translate-y-1 transition-all duration-300 
              inline-flex items-center gap-2">
            <AddMenu />
            </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 overflow-x-auto hide-scrollbar">
        <div className="flex space-x-2 min-w-max">
          <Link
            href={getFilterUrl("all")}
            className={`px-6 py-2 rounded-lg font-medium shadow-sm transition-colors ${
              classFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            All Motorcycles
          </Link>
          <Link
            href={getFilterUrl("CC_250_UP")}
            className={`px-6 py-2 rounded-lg font-medium shadow-sm transition-colors ${
              classFilter === "CC_250_UP"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            250 CC & UP
          </Link>
          <Link
            href={getFilterUrl("CC_150_225")}
            className={`px-6 py-2 rounded-lg font-medium shadow-sm transition-colors ${
              classFilter === "CC_150_225"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            150 CC - 225 CC
          </Link>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <form action="/manager/product" method="GET">
              {sort && <input type="hidden" name="sort" value={sort} />}
              {classFilter !== "all" && <input type="hidden" name="class" value={classFilter} />}
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  name="search"
                  defaultValue={search}
                  className="pl-12 text-sm w-full rounded-lg p-3 bg-white border border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300"
                  placeholder="Search motorcycles by name, category..."
                />
                {search && (
                  <Link
                    href={`/manager/product${classFilter !== "all" ? `?class=${classFilter}` : ""}${sort !== "newest" ? `${classFilter !== "all" ? "&" : "?"}sort=${sort}` : ""}`}
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
                  </Link>
                )}
              </div>
            </form>
          </div>
          <div className="flex items-center gap-3">
            <form action="/manager/product" method="GET" className="flex items-center gap-3">
              {search && <input type="hidden" name="search" value={search} />}
              {classFilter !== "all" && <input type="hidden" name="class" value={classFilter} />}
              <select
                name="sort"
                className="bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                defaultValue={sort}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                Apply
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Motorcycles Grid */}
      {menu.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-md text-center scale-in">
          <div className="max-w-md mx-auto">
            <div className="bg-blue-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Motorcycle className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Motorcycles Found</h3>
            <p className="text-gray-600 mb-6">
              {search || classFilter !== "all"
                ? "No motorcycles match your search criteria. Try adjusting your filters."
                : "Your motorcycle collection is empty. Add your first motorcycle to get started."}
            </p>
            
            <div className="ml-4 hover:-translate-y-1 transition-all duration-300 
              inline-flex items-center gap-2">
            <AddMenu />
          </div>

          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
          {menu.map((data, index) => (
            <div
              key={`keyMenu${index}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <Link href={`/manager/detail/${data.id}`} className="block">
                <div className="relative h-56 bg-gray-50 overflow-hidden">
                  {data.motorbike_picture ? (
                    <Image
                      fill
                      src={`${BASE_IMAGE_MENU}/${data.motorbike_picture}`}
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={data.name || "Motorcycle"}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <Motorcycle className="h-20 w-20 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {data.Class && (
                      <span className="bg-gradient-to-r from-green-600 to-green-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                        {formatClass(data.Class)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-2">
                  {data.brand && <span className="text-sm font-medium text-blue-600">{formatBrand(data.brand)}</span>}
                </div>

                <Link href={`/manager/detail/${data.id}`}>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {data.name}
                  </h3>
                </Link>

                <div className="flex items-center mb-4">
                  <span className="text-lg font-semibold text-green-600">{formatPrice(data.price)}</span>
                </div>

                {data.description && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{data.description}</p>}

                <div className="mt-auto grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
                  {data.kilometer && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatKilometer(data.kilometer)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2">
                    {data.BPKB === "YES" && (
                      <span className="flex items-center text-xs text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        BPKB
                      </span>
                    )}
                    {data.STNK === "YES" && (
                      <span className="flex items-center text-xs text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        STNK
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <Link
                    href={`/manager/detail/${data.id}`}
                    className="text-blue-600 text-sm font-medium flex items-center hover:underline"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>

                  <div className="flex gap-1">
                          <EditMenu selectedMenu={data} />
                          <DeleteMenu selectedMenu={data} />
                      </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MenuPage
