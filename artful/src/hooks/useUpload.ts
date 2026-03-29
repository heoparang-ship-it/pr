"use client"

import { useState } from "react"

export function useUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const upload = async (
    file: File,
    category: "hero" | "profile" | "work"
  ): Promise<string> => {
    setUploading(true)
    setProgress(0)

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        category,
      }),
    })
    const { uploadUrl, imageUrl } = await res.json()

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable)
          setProgress(Math.round((e.loaded / e.total) * 100))
      }
      xhr.onload = () => (xhr.status === 200 ? resolve() : reject())
      xhr.onerror = reject
      xhr.open("PUT", uploadUrl)
      xhr.setRequestHeader("Content-Type", file.type)
      xhr.send(file)
    })

    setUploading(false)
    setProgress(100)
    return imageUrl
  }

  return { upload, uploading, progress }
}
