// import { type ClassValue, clsx } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

// /**
//  * Triggers a profile update event to refresh profile pictures across components
//  */
// export function triggerProfileUpdate() {
//   if (typeof window !== "undefined") {
//     // Create and dispatch a custom event
//     const event = new Event("profile-updated")
//     window.dispatchEvent(event)
//   }
// }


import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Triggers a profile update event to refresh profile pictures across components
 */
export function triggerProfileUpdate() {
  if (typeof window !== "undefined") {
    // Create and dispatch a custom event
    const event = new Event("profile-updated")
    window.dispatchEvent(event)
  }
}

// Formatting utilities for motorcycle data
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatKilometer(value: string) {
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

export function formatClass(value: string) {
  switch (value) {
    case "CC_150_225":
      return "150 CC - 225 CC"
    case "CC_250_UP":
      return "250 CC & UP"
    default:
      return value
  }
}

export function formatBrand(value: string) {
  return value?.replace(/_/g, " ") || ""
}
