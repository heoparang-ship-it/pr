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

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          category,
        }),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || "업로드 URL 생성 실패")
      }

      const { uploadUrl, imageUrl } = await res.json()

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable)
            setProgress(Math.round((e.loaded / e.total) * 100))
        }
        xhr.onload = () => (xhr.status === 200 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`)))
        xhr.onerror = () => reject(new Error("네트워크 오류"))
        xhr.open("PUT", uploadUrl)
        xhr.setRequestHeader("Content-Type", file.type)
        xhr.send(file)
      })

      setProgress(100)
      return imageUrl
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, progress }
}
