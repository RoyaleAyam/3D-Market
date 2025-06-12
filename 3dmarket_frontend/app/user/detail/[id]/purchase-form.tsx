"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, Banknote, Loader2, ShoppingBag } from "lucide-react"
import { post } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookie"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface PurchaseFormProps {
  isOpen: boolean
  onClose: () => void
  motorcycleId: number
  motorcycleName: string
}

export default function PurchaseForm({ isOpen, onClose, motorcycleId, motorcycleName }: PurchaseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"BANK" | "CASH">("BANK")
  const [address, setAddress] = useState("")
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<{ address?: string }>({})
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value)
    if (errors.address) {
      setErrors({})
    }
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value)
  }

  const validateForm = () => {
    const newErrors: { address?: string } = {}

    if (!address.trim()) {
      newErrors.address = "Please enter your complete address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const token = getCookie("token") || ""

      const orderData = {
        payment_method: paymentMethod,
        status: "NEW",
        address: address.trim(),
        orderlists: [
          {
            motorId: motorcycleId,
            note: note.trim(),
          },
        ],
      }

      const response = await post(`/order/`, JSON.stringify(orderData), token)

      if (response.status) {
        setSubmitStatus("success")
        setTimeout(() => {
          onClose()
          // Reset form after successful submission
          setPaymentMethod("BANK")
          setAddress("")
          setNote("")
        }, 2000)
      } else {
        setSubmitStatus("error")
        setErrorMessage(response.message || "Failed to create order. Please try again.")
      }
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage("An unexpected error occurred. Please try again.")
      console.error("Order submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white">
        {submitStatus === "success" ? (
          <div className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">Order Placed Successfully!</h3>
            <p className="text-blue-700 mb-4">Thank you for your purchase. We will process your order shortly.</p>
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-blue-600 p-5 text-white">
              <DialogTitle className="text-xl font-bold mb-1">Purchase Motorcycle</DialogTitle>
              <DialogDescription className="text-blue-100 text-sm opacity-90">
                Complete the form below to purchase {motorcycleName}
              </DialogDescription>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Motorcycle info */}
              <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <ShoppingBag className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-blue-800 text-xs mb-0.5">You are purchasing:</h3>
                  <p className="text-base font-bold text-blue-900">{motorcycleName}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label className="text-base font-medium block text-blue-900">Payment Method</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === "BANK"
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setPaymentMethod("BANK")}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK"
                      checked={paymentMethod === "BANK"}
                      onChange={() => setPaymentMethod("BANK")}
                      className="absolute opacity-0"
                    />
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          paymentMethod === "BANK" ? "bg-blue-600" : "bg-gray-100"
                        }`}
                      >
                        <CreditCard
                          className={`h-5 w-5 ${paymentMethod === "BANK" ? "text-white" : "text-gray-500"}`}
                        />
                      </div>
                      <span className={`font-medium ${paymentMethod === "BANK" ? "text-blue-800" : "text-gray-700"}`}>
                        Bank Transfer
                      </span>
                    </div>
                  </div>

                  <div
                    className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === "CASH"
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setPaymentMethod("CASH")}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH"
                      checked={paymentMethod === "CASH"}
                      onChange={() => setPaymentMethod("CASH")}
                      className="absolute opacity-0"
                    />
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                          paymentMethod === "CASH" ? "bg-blue-600" : "bg-gray-100"
                        }`}
                      >
                        <Banknote className={`h-5 w-5 ${paymentMethod === "CASH" ? "text-white" : "text-gray-500"}`} />
                      </div>
                      <span className={`font-medium ${paymentMethod === "CASH" ? "text-blue-800" : "text-gray-700"}`}>
                        Cash Payment
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2 text-blue-900 font-medium">
                <Label htmlFor="address" className="text-base font-medium text-blue-900">
                  Complete Address
                </Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Enter your complete address"
                  rows={3}
                  className={`p-3 ${errors.address ? "border-red-500" : "border-blue-200"}`}
                />
                {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
              </div>

              {/* Note */}
              <div className="space-y-2 text-blue-900 font-medium">
                <Label htmlFor="note" className="text-base font-medium text-blue-900">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={handleNoteChange}
                  placeholder="Any special requests or notes"
                  rows={2}
                  className="p-3 border-blue-200"
                />
              </div>

              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-end pt-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Complete Purchase"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
