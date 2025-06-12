"use client"
import type { IMenu } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { drop } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookie"
import { useRouter } from "next/navigation"
import { type FormEvent, useState } from "react"
import { toast } from "react-toastify"
import { Trash2, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const DeleteMenu = ({ selectedMenu }: { selectedMenu: IMenu }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const TOKEN = getCookie("token") || ""

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault()
      setIsLoading(true)
      const url = `${BASE_API_URL}/menu/${selectedMenu.id}`
      const { data } = await drop(url, TOKEN)
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
        title="Delete Motorcycle"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 flex flex-row items-center">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">Delete Motorcycle</DialogTitle>
              <DialogDescription className="text-gray-500">This action cannot be undone</DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                <p className="text-red-800">
                  Are you sure you want to delete the motorcycle{" "}
                  <span className="font-semibold">{selectedMenu.name}</span>?
                </p>
                <p className="text-sm text-red-600 mt-2">Motorcycles with existing sales records cannot be deleted.</p>
              </div>

              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-yellow-700">
                  This will permanently remove all data associated with this motorcycle model.
                </p>
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
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Permanently</span>
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

export default DeleteMenu
