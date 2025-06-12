import { getCookies } from "@/lib/server-cookies"
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global"
import { get } from "@/lib/api-bridge"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BikeIcon, ArrowLeft, Tag, CheckCircle, XCircle, ChevronRight, Info } from "lucide-react"
import { formatPrice, formatKilometer, formatClass, formatBrand } from "@/lib/utilis"
import PurchaseButton from "./purchase-button"

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
          <Link href="/user/product" className="text-blue-600 hover:text-blue-800 flex items-center group">
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
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-r border-blue-100">
            {/* Main Image */}
            <div className="relative h-[750px] mt-3 rounded-lg overflow-hidden bg-white border border-blue-200 shadow-md mb-4">
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
              <div className="grid grid-cols-4 gap-3 mt-4">
                {additionalImages.map((img, index) => (
                  <div
                    key={`thumb-${index}`}
                    className="relative h-20 rounded-md overflow-hidden border border-blue-200 bg-white cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200"
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
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 mb-6 border border-blue-500 text-white shadow-lg">
              <div className="mb-2">
                <span className="text-sm text-blue-100 font-medium">Price</span>
                <div className="text-3xl font-bold">{formatPrice(motorcycle.price || 0)}</div>
              </div>
              <div>
                <span className="text-sm text-blue-100 font-medium">DP starting from</span>
                <div className="text-xl font-semibold">{downPayment}</div>
              </div>
            </div>

            {/* Availability */}
            {/* <div className="mb-6 flex items-start p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-blue-800">
                This motorcycle is available for purchase and can be viewed at our showroom.
              </p>
            </div> */}

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Brand</h3>
                <p className="font-semibold text-gray-900">{formatBrand(motorcycle.brand || "")}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Kilometer</h3>
                <p className="font-semibold text-gray-900">{formatKilometer(motorcycle.kilometer || "")}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Class</h3>
                <p className="font-semibold text-gray-900">{formatClass(motorcycle.Class || "")}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Tax</h3>
                <p className="font-semibold text-gray-900">{motorcycle.tax || "N/A"}</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              {/* Inquire Further Button */}
              <Link
                href="https://wa.me/62881036733173"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
              >
                <span>Inquire Further</span>
                <ChevronRight className="h-5 w-5 ml-1" />
              </Link>

              {/* Purchase Button */}
              <PurchaseButton motorcycleId={motorcycle.id} motorcycleName={motorcycle.name} />
            </div>
          </div>
        </div>

        {/* Vehicle Details Section */}
        <div className="border-t border-gray-200 bg-gradient-to-br from-white to-blue-50">
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Vehicle Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-sm font-medium text-blue-600 mb-2">Documents</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">STNK</span>
                    {motorcycle.STNK === "YES" ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Available
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600">
                        <XCircle className="h-4 w-4 mr-1" />
                        Not Available
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">BPKB</span>
                    {motorcycle.BPKB === "YES" ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Available
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600">
                        <XCircle className="h-4 w-4 mr-1" />
                        Not Available
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-sm font-medium text-blue-600 mb-2">Payment Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-gray-700">Cash Payment</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-gray-700">Bank Transfer</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-sm font-medium text-blue-600 mb-2">Delivery</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-gray-700">Home Delivery Available</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-gray-700">Pickup at Showroom</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {motorcycle.description && (
          <div className="border-t border-gray-200">
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <div className="bg-white p-5 rounded-lg border border-blue-100 shadow-sm">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{motorcycle.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Why Choose Us */}
        <div className="border-t border-gray-200 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="p-8">
            <h2 className="text-xl font-bold mb-6 text-center">Why Choose Our Motorcycles</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-700/50 p-5 rounded-lg border border-blue-500/30 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-2">Quality Assurance</h3>
                <p className="text-blue-100">
                  All our motorcycles undergo thorough inspection and quality checks before listing.
                </p>
              </div>

              <div className="bg-blue-700/50 p-5 rounded-lg border border-blue-500/30 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-2">Transparent Pricing</h3>
                <p className="text-blue-100">No hidden fees or charges. What you see is what you pay.</p>
              </div>

              <div className="bg-blue-700/50 p-5 rounded-lg border border-blue-500/30 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-2">After-Sales Support</h3>
                <p className="text-blue-100">
                  Our team is always available to assist you with any questions or concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
