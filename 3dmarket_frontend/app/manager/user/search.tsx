"use server"

import { redirect } from "next/navigation"

export async function searchUsers(formData: FormData) {
  const searchTerm = formData.get("search")?.toString() || ""

  const params = new URLSearchParams()
  if (searchTerm) {
    params.set("search", searchTerm)
  }

  redirect(`/manager/user?${params.toString()}`)
}
