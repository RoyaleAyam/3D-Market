
import { useState, useEffect } from "react"
import PurchaseForm from "./purchase-form"

export default function PurchaseModalProvider() {
  const [isOpen, setIsOpen] = useState(false)
  const [motorId, setMotorId] = useState<number | null>(null)
  const [motorName, setMotorName] = useState<string | null>(null)

  useEffect(() => {
    const handleOpenModal = (event: Event) => {
      const customEvent = event as CustomEvent
      const detail = customEvent.detail

      if (detail && detail.motorId) {
        setMotorId(detail.motorId)
        setMotorName(detail.motorName || "")
        setIsOpen(true)
      }
    }

    window.addEventListener("open-purchase-modal", handleOpenModal)

    return () => {
      window.removeEventListener("open-purchase-modal", handleOpenModal)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
  }

  return <PurchaseForm isOpen={isOpen} onClose={handleClose} motorId={motorId} motorName={motorName} />
}
