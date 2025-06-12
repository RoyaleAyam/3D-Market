
import type React from "react"

import { useState, useEffect } from "react"
import { CreditCard, Banknote, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"
import { BASE_API_URL } from "@/global"
import { getCookies } from "@/lib/server-cookies"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface PurchaseFormProps {
  isOpen: boolean
  onClose: () => void
  motorId: number | null
  motorName: string | null
}

export default function PurchaseForm({ isOpen, onClose, motorId, motorName }: PurchaseFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<"BANK" | "CASH">("BANK")
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")
  const [street, setStreet] = useState("")
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<{
    province?: string
    city?: string
    street?: string
  }>({})

  useEffect(() => {
    if (!isOpen) {
      // Reset form when closed
      setPaymentMethod("BANK")
      setProvince("")
      setCity("")
      setStreet("")
      setNote("")
      setStep(1)
      setErrors({})
    }
  }, [isOpen])

  const validateStep1 = () => {
    const newErrors: {
      province?: string
      city?: string
      street?: string
    } = {}

    if (!province.trim()) {
      newErrors.province = "Province is required"
    }

    if (!city.trim()) {
      newErrors.city = "City is required"
    }

    if (!street.trim()) {
      newErrors.street = "Street address is required"
    } else if (street.trim().length < 5) {
      newErrors.street = "Please enter a complete street address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep1()) {
      setStep(1)
      return
    }

    if (!motorId) {
      toast.error("Invalid motorcycle selection", { containerId: "toastMenu" })
      return
    }

    const fullAddress = `${street}, ${city}, ${province}`

    const orderData = {
      payment_method: paymentMethod,
      status: "NEW",
      address: fullAddress,
      orderlists: [
        {
          motorId: motorId,
          note: note,
        },
      ],
    }

    setIsSubmitting(true)

    try {
      const TOKEN = await getCookies("token")
      const response = await fetch(`${BASE_API_URL}/order/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Order placed successfully!", { containerId: "toastMenu" })
        onClose()
      } else {
        toast.error(data.message || "Failed to place order", { containerId: "toastMenu" })
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("An error occurred while placing your order", { containerId: "toastMenu" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-amber-900">Purchase Motorcycle</DialogTitle>
          <DialogDescription className="text-amber-700">
            Complete the form below to purchase your motorcycle
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {motorName && (
            <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-700 mb-1">You are purchasing:</p>
              <p className="font-medium text-amber-900">{motorName}</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium block text-amber-900">Delivery Address</Label>

                <div>
                  <Label htmlFor="province" className="flex items-center gap-1 text-amber-800">
                    Province <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="province"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="Enter province"
                    className={
                      errors.province
                        ? "border-red-500"
                        : "border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                    }
                  />
                  {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                </div>

                <div>
                  <Label htmlFor="city" className="flex items-center gap-1 text-amber-800">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                    className={
                      errors.city ? "border-red-500" : "border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                    }
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="street" className="flex items-center gap-1 text-amber-800">
                    Street Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Enter complete street address"
                    className={
                      errors.street ? "border-red-500" : "border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                    }
                  />
                  {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="note" className="text-amber-800">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any special requests or notes for this order"
                  className="resize-none border-amber-200 focus:border-amber-400 focus:ring-amber-200"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-2 block text-amber-900">Payment Method</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value: "BANK" | "CASH") => setPaymentMethod(value)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="relative">
                    <RadioGroupItem value="BANK" id="bank" className="peer sr-only" />
                    <Label
                      htmlFor="bank"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-amber-200 bg-white p-4 hover:bg-amber-50 hover:text-amber-900 peer-data-[state=checked]:border-amber-500 [&:has([data-state=checked])]:border-amber-500 [&:has([data-state=checked])]:bg-amber-50"
                    >
                      <CreditCard className="mb-3 h-6 w-6 text-amber-700" />
                      Bank Transfer
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="CASH" id="cash" className="peer sr-only" />
                    <Label
                      htmlFor="cash"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-amber-200 bg-white p-4 hover:bg-amber-50 hover:text-amber-900 peer-data-[state=checked]:border-amber-500 [&:has([data-state=checked])]:border-amber-500 [&:has([data-state=checked])]:bg-amber-50"
                    >
                      <Banknote className="mb-3 h-6 w-6 text-amber-700" />
                      Cash
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <h3 className="font-medium mb-2 text-amber-900">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-amber-700">Product:</span>
                    <span className="font-medium text-amber-900">{motorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Delivery Address:</span>
                    <span className="font-medium text-amber-900 text-right">{`${street}, ${city}, ${province}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">Payment Method:</span>
                    <span className="font-medium text-amber-900">
                      {paymentMethod === "BANK" ? "Bank Transfer" : "Cash"}
                    </span>
                  </div>
                  {note && (
                    <div className="flex justify-between">
                      <span className="text-amber-700">Note:</span>
                      <span className="font-medium text-amber-900 text-right">{note}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-4">
            {step === 1 ? (
              <>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleNextStep}>
                  Next Step
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Purchase"
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
