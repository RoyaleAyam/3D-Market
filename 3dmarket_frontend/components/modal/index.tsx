"use client"

import type React from "react"

type ModalProps = {
  isShow: boolean
  onClose: (state: boolean) => void
  children: React.ReactNode
  className?: string
}

const Modal = ({ isShow, onClose, children, className }: ModalProps) => {
  // Handle click outside to close modal
  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose(false)
  }

  if (!isShow) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50"
      onClick={handleClickOutside}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-lg max-w-md w-full max-h-[90vh] overflow-auto ${
          className || ""
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        {children}
      </div>
    </div>
  )
}

export default Modal

