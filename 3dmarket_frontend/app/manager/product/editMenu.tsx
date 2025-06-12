"use client"
import type { IMenu } from "@/app/types"
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global"
import { put } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookie"
import { useRouter } from "next/navigation"
import { type FormEvent, useRef, useState } from "react"
import { toast } from "react-toastify"
import { Edit2, X, Save, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const EditMenu = ({
  selectedMenu,
}: {
  selectedMenu: IMenu & {
    brand?: string
    Class?: string
    tax?: string
    kilometer?: string
    BPKB?: string
    STNK?: string
  }
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [menu, setMenu] = useState<
    IMenu & {
      brand?: string
      Class?: string
      tax?: string
      kilometer?: string
      BPKB?: string
      STNK?: string
    }
  >({ ...selectedMenu })
  const router = useRouter()
  const TOKEN = getCookie("token") || ""
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const openModal = () => {
    setMenu({ ...selectedMenu })
    setPreviewUrl(selectedMenu.motorbike_picture ? `${BASE_IMAGE_MENU}/${selectedMenu.motorbike_picture}` : null)
    setIsOpen(true)
    if (formRef.current) formRef.current.reset()
  }

  const handleFileChange = (f: File | null) => {
    setFile(f)
    if (f) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(f)
    } else {
      setPreviewUrl(selectedMenu.motorbike_picture ? `${BASE_IMAGE_MENU}/${selectedMenu.motorbike_picture}` : null)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault()
      setIsLoading(true)
      const url = `${BASE_API_URL}/M/${selectedMenu.id}`
      const { name, price, description, brand, Class, tax, kilometer, BPKB, STNK } = menu
      const payload = new FormData()
      payload.append("name", name || "")
      payload.append("price", price !== undefined ? price.toString() : "0")
      payload.append("description", description || "")
      payload.append("brand", brand || "")
      payload.append("Class", Class || "")
      payload.append("tax", tax || "")
      payload.append("kilometer", kilometer || "")
      payload.append("BPKB", BPKB || "YES")
      payload.append("STNK", STNK || "YES")
      if (file !== null) payload.append("motorbike_picture", file || "")
      const { data } = await put(url, payload, TOKEN)
      if (data?.status) {
        setIsOpen(false)
        toast(data?.message, { hideProgressBar: true, containerId: `toastMenu`, type: `success` })
        setTimeout(() => router.refresh(), 1000)
      } else {
        toast(data?.message, { hideProgressBar: true, containerId: `toastMenu`, type: `warning` })
      }
    } catch (error) {
      console.log(error)
      toast(`Something Wrong`, { hideProgressBar: true, containerId: `toastMenu`, type: `error` })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to format kilometer display
  const formatKilometer = (value: string) => {
    switch (value) {
      case "KM0_KM900":
        return "0 - 999km"
      case "KM1000_KM2999":
        return "1000 - 2999km"
      case "KM3000_KM4999":
        return "3000 - 4999km"
      case "KM5000_KM6999":
        return "5000 - 6999km"
      case "KM7000_UP":
        return "7000km & UP"
      default:
        return value
    }
  }

  // Helper function to format class display
  const formatClass = (value: string) => {
    switch (value) {
      case "CC_150_225":
        return "150 CC - 225 CC"
      case "CC_250_UP":
        return "250 CC & UP"
      default:
        return value
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
        title="Edit Motorcycle"
      >
        <Edit2 className="h-4 w-4" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-xl font-bold text-gray-900">Edit Motorcycle</DialogTitle>
            <DialogDescription className="text-gray-500">Update details for {menu.name}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} ref={formRef} className="overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Model Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={menu.name}
                      onChange={(e) => setMenu({ ...menu, name: e.target.value })}
                      required
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      placeholder="Enter motorcycle model name"
                    />
                  </div>

                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="brand"
                      value={menu.brand}
                      onChange={(e) => setMenu({ ...menu, brand: e.target.value })}
                      required
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    >
                      <option value="">--- Select Brand ---</option>
                      <option value="HONDA">Honda</option>
                      <option value="YAMAHA">Yamaha</option>
                      <option value="SUZUKI">Suzuki</option>
                      <option value="KAWASAKI">Kawasaki</option>
                      <option value="DUCATI">Ducati</option>
                      <option value="KTM">KTM</option>
                      <option value="BMW">BMW</option>
                      <option value="APRILIA">Aprilia</option>
                      <option value="HARLEY_DAVIDSON">Harley Davidson</option>
                      <option value="TRIUMPH">Triumph</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                      Engine Class <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="class"
                      value={menu.Class}
                      onChange={(e) => setMenu({ ...menu, Class: e.target.value })}
                      required
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    >
                      <option value="">--- Select Engine Class ---</option>
                      <option value="CC_150_225">150 CC - 225 CC</option>
                      <option value="CC_250_UP">250 CC & UP</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Pricing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        id="price"
                        type="number"
                        value={menu.price}
                        onChange={(e) => setMenu({ ...menu, price: Number(e.target.value) })}
                        required
                        min="0"
                        className="w-full rounded-lg border border-gray-300 p-3 pl-9 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        placeholder="Enter price"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="tax" className="block text-sm font-medium text-gray-700 mb-1">
                      Tax <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="tax"
                      type="text"
                      value={menu.tax}
                      onChange={(e) => setMenu({ ...menu, tax: e.target.value })}
                      required
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      placeholder="Enter tax information"
                    />
                  </div>
                </div>
              </div>

              {/* Condition Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Condition Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="kilometer" className="block text-sm font-medium text-gray-700 mb-1">
                      Kilometer <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="kilometer"
                      value={menu.kilometer}
                      onChange={(e) => setMenu({ ...menu, kilometer: e.target.value })}
                      required
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    >
                      <option value="">--- Select Kilometer Range ---</option>
                      <option value="KM0_KM900">0 - 999km</option>
                      <option value="KM1000_KM2999">1000 - 2999km</option>
                      <option value="KM3000_KM4999">3000 - 4999km</option>
                      <option value="KM5000_KM6999">5000 - 6999km</option>
                      <option value="KM7000_UP">7000km & UP</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bpkb" className="block text-sm font-medium text-gray-700 mb-1">
                      BPKB <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="bpkb"
                          value="YES"
                          checked={menu.BPKB === "YES"}
                          onChange={() => setMenu({ ...menu, BPKB: "YES" })}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="bpkb"
                          value="NO"
                          checked={menu.BPKB === "NO"}
                          onChange={() => setMenu({ ...menu, BPKB: "NO" })}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="stnk" className="block text-sm font-medium text-gray-700 mb-1">
                      STNK <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="stnk"
                          value="YES"
                          checked={menu.STNK === "YES"}
                          onChange={() => setMenu({ ...menu, STNK: "YES" })}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="stnk"
                          value="NO"
                          checked={menu.STNK === "NO"}
                          onChange={() => setMenu({ ...menu, STNK: "NO" })}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description and Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    id="description"
                    value={menu.description}
                    onChange={(e) => setMenu({ ...menu, description: e.target.value })}
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    placeholder="Enter motorcycle description"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motorcycle Image <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div
                    className={`
                      border-2 border-dashed rounded-lg p-4 text-center 
                      ${previewUrl ? "border-blue-300 bg-blue-50" : "border-gray-300 hover:border-blue-400"} 
                      transition-colors cursor-pointer h-[200px] flex flex-col items-center justify-center
                    `}
                    onClick={() => document.getElementById("motorcycle_picture_edit")?.click()}
                  >
                    {previewUrl ? (
                      <div className="relative h-full w-full">
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="h-full w-full object-contain rounded-md mx-auto"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFileChange(null)
                          }}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="bg-blue-100 rounded-full p-4 mx-auto mb-4">
                          <Upload className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Drag & drop or click to upload</p>
                        <p className="text-xs text-gray-400">PNG, JPG, JPEG (max 11MB)</p>
                      </>
                    )}
                    <input
                      id="motorcycle_picture_edit"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 p-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Update Motorcycle</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditMenu
