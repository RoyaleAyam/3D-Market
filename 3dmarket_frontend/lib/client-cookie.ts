import Cookies from "js-cookie"

export const getCookie = (key: string): string | null => {
  const value = Cookies.get(key)
  if (!value) return null

  try {
    // Try to parse and format if it's JSON
    const parsedValue = JSON.parse(value)
    return value // Return original value for use in the application
  } catch {
    // Return original value if it's not JSON
    return value
  }
}

export const storeCookie = (key: string, value: string) => {
  try {
    // Try to parse to ensure it's valid JSON
    JSON.parse(value)
    Cookies.set(key, value, { expires: 1, path: "/" }) // Ensure cookie is set for root path
  } catch {
    // If not JSON, store as is
    Cookies.set(key, value, { expires: 1, path: "/" }) // Ensure cookie is set for root path
  }
}

export const removeCookie = (key: string) => {
  Cookies.remove(key)
}

// Helper function to pretty print cookie value (for debugging)
export const prettyPrintCookie = (key: string): void => {
  const value = Cookies.get(key)
  if (!value) {
    console.log(`No cookie found for key: ${key}`)
    return
  }

  try {
    const parsedValue = JSON.parse(value)
    console.log(`Cookie ${key}:`)
    console.log(JSON.stringify(parsedValue, null, 2))
  } catch {
    console.log(`Cookie ${key}: ${value}`)
  }
}

