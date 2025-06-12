"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import PurchaseForm from "./purchase-form"

interface PurchaseButtonProps {
  motorcycleId: number
  motorcycleName: string
}

export default function PurchaseButton({ motorcycleId, motorcycleName }: PurchaseButtonProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const openForm = () => setIsFormOpen(true)
  const closeForm = () => setIsFormOpen(false)

  return (
    <>
      <Button
        onClick={openForm}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 h-auto shadow-md hover:shadow-lg transition-all duration-300 text-base"
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Purchase Now
      </Button>

      <PurchaseForm
        isOpen={isFormOpen}
        onClose={closeForm}
        motorcycleId={motorcycleId}
        motorcycleName={motorcycleName}
      />
    </>
  )
}
