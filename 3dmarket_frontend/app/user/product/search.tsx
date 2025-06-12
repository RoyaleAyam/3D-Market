
import { useRouter } from "next/navigation"
import { type KeyboardEvent, useState } from "react"
import { SearchIcon } from "lucide-react"
import { X } from "lucide-react"

type Props = {
  url: string
  search: string
}

const Search = ({ url, search }: Props) => {
  const [keyword, setKeyword] = useState<string>(search)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const router = useRouter()

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      router.push(`${url}?search=${keyword}`)
    }
  }

  return (
    <div className="relative w-full">
      <div
        className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-all duration-300 ${
          isFocused ? "text-blue-600" : "text-gray-500"
        }`}
      >
        <SearchIcon className={`w-5 h-5 transition-all duration-300 ${isFocused ? "scale-110" : ""}`} />
      </div>
      <input
        type="text"
        id="keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`pl-12 text-sm w-full rounded-lg p-3 bg-white border ${
          isFocused ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"
        } focus:border-blue-500 focus:outline-none transition-all duration-300`}
        placeholder="Search motorcycles by name, category..."
        onKeyUp={handleSearch}
      />
      {keyword && (
        <button
          onClick={() => {
            setKeyword("")
            router.push(url)
          }}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default Search
