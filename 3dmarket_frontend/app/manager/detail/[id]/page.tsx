import { getCookies } from "@/lib/server-cookies"
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global"
import { get } from "@/lib/api-bridge"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BikeIcon, ArrowLeft, Calendar, Tag, MapPin, CheckCircle, XCircle, ChevronRight, Info } from "lucide-react"
import { formatPrice, formatKilometer, formatClass, formatBrand } from "@/lib/utilis"

// Get motorcycle details by ID
async function getMotorcycleById(id: string) {
  try {
    const TOKEN = await getCookies("token")
    const url = `${BASE_API_URL}/M/getMotorById/${id}`
    const { data } = await get(url, TOKEN)

    if (data?.status && data.data) {
      return data.data
    }
    return null
  } catch (error) {
    console.error("Error fetching motorcycle details:", error)
    return null
  }
}

// Calculate down payment (20% of price)
function calculateDownPayment(price: number): string {
  const dpAmount = Math.round(price * 0.2)
  return formatPrice(dpAmount)
}

export default async function MotorcycleDetailPage({ params }: { params: { id: string } }) {
  const motorcycle = await getMotorcycleById(params.id)

  if (!motorcycle) {
    notFound()
  }

  // Using thumbnail images for gallery (in production, these would be separate images)
  const additionalImages = motorcycle.picture ? Array(4).fill(motorcycle.picture) : []

  // Calculate down payment
  const downPayment = calculateDownPayment(motorcycle.price || 0)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm">
          <Link href="/manager/product" className="text-blue-600 hover:text-blue-800 flex items-center group">
            <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
            <span>Back to Motorcycles</span>
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <span className="text-gray-600">Details</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Side - Gallery */}
          <div className="p-6 bg-gray-50 border-r border-gray-100">
        {/* Main Image */}
        <div className="relative h-full rounded-lg overflow-hidden bg-gray-50 border border-gray-200 shadow-md">
          {motorcycle.motorbike_picture ? (
            <Image
          src={`${BASE_IMAGE_MENU}/${motorcycle.motorbike_picture}`}
          alt={motorcycle.name}
          fill
          className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
          <BikeIcon className="h-24 w-24 text-gray-300" />
            </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {additionalImages.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {additionalImages.map((img, index) => (
          <div
            key={`thumb-${index}`}
            className="relative h-20 rounded-md overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200"
          >
            <Image
              src={`${BASE_IMAGE_MENU}/${img}`}
              alt={`${motorcycle.name} view ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
            ))}
          </div>
        )}
          </div>

          {/* Right Side - Details */}
          <div className="p-8">
            {/* Title & Badges */}
            <div className="mb-6">
              <div className="flex gap-2 mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {formatClass(motorcycle.Class || "")}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {formatKilometer(motorcycle.kilometer || "")}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-1">{motorcycle.name}</h1>

              <div className="flex items-center text-gray-600">
                <Tag className="h-4 w-4 mr-1" />
                <span className="font-medium">{formatBrand(motorcycle.brand || "")}</span>
              </div>
            </div>

            {/* Price & Down Payment */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 mb-6 border border-blue-200">
              <div className="mb-2">
                <span className="text-sm text-blue-700 font-medium">Price</span>
                <div className="text-3xl font-bold text-blue-900">{formatPrice(motorcycle.price || 0)}</div>
              </div>
              <div>
                <span className="text-sm text-blue-700 font-medium">DP starting from</span>
                <div className="text-xl font-semibold text-blue-800">{downPayment}</div>
              </div>
            </div>

            {/* Availability */}
            <div className="mb-6 flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">This item is available for purchase and can be viewed at our showroom.</p>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Brand</h3>
                <p className="font-semibold text-gray-900">{formatBrand(motorcycle.brand || "")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Kilometer</h3>
                <p className="font-semibold text-gray-900">{formatKilometer(motorcycle.kilometer || "")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Class</h3>
                <p className="font-semibold text-gray-900">{formatClass(motorcycle.Class || "")}</p>
              </div>
              {/* <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                  <p className="font-semibold text-gray-900">Horizon Motorsport</p>
                </div>
              </div> */}
            </div>

            {/* CTA Button */}
            <Link
              href="https://wa.me/62881036733173"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-md hover:shadow-lg mb-6"
            >
              <span>Inquire Further</span>
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>

            {/* Social Sharing */}
            {/* <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 mr-3">Share:</div>
              <div className="flex space-x-2">
                <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.016 18.846c-.853.85-1.863 1.521-2.986 1.982-1.153.475-2.386.714-3.653.714-1.276 0-2.517-.24-3.676-.72-1.121-.46-2.135-1.136-2.987-1.987C3.863 17.985 3.186 16.976 2.721 15.85c-.476-1.155-.717-2.393-.717-3.66 0-1.26.24-2.487.716-3.638.466-1.123 1.143-2.131 2-2.986.85-.853 1.864-1.523 2.987-1.984 1.16-.48 2.4-.72 3.676-.72 1.268 0 2.5.24 3.653.714 1.124.462 2.132 1.132 2.987 1.984.854.855 1.53 1.863 1.993 2.985.477 1.15.717 2.38.717 3.64 0 1.266-.24 2.504-.715 3.66-.464 1.124-1.14 2.133-1.992 2.986z" />
                  </svg>
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </button>
                <button className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-full transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Vehicle Details Section */}
        <div className="border-t border-gray-200">
            <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Vehicle Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Tax</h3>
              <p className="text-gray-900 font-semibold">{motorcycle.tax || "N/A"}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">STNK</h3>
              <div className="flex items-center">
                {motorcycle.STNK === "YES" ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-gray-900 font-semibold">Available</span>
                </>
                ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600 mr-1" />
                  <span className="text-gray-900 font-semibold">Not Available</span>
                </>
                )}
              </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">BPKB</h3>
              <div className="flex items-center">
                {motorcycle.BPKB === "YES" ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-gray-900 font-semibold">Available</span>
                </>
                ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600 mr-1" />
                  <span className="text-gray-900 font-semibold">Not Available</span>
                </>
                )}
              </div>
              </div>
            </div>
            </div>
        </div>

        {/* Detail Tabs */}
        {/* <div className="border-t border-gray-200">
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Detail View</h2>

            <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
              <button className="px-5 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors whitespace-nowrap">
                DASHBOARD
              </button>
              <button className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap">
                FAIRING
              </button>
              <button className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap">
                BODY
              </button>
              <button className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap">
                LAMPU
              </button>
              <button className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap">
                MESIN
              </button>
              <button className="px-5 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap">
                KAKI-KAKI
              </button>
            </div> */}

            {/* Dashboard Preview Image */}
            {/* <div className="mt-6">
              <div className="relative h-64 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={`${BASE_IMAGE_MENU}/${motorcycle.picture}`}
                  alt="Dashboard View"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div> */}

        {/* Description */}
        {motorcycle.description && (
          <div className="border-t border-gray-200">
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{motorcycle.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
