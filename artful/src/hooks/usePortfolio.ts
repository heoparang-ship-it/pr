"use client"

import { useEffect, useState } from "react"
import { useEditorStore } from "@/stores/editorStore"

export function usePortfolio() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setPortfolio } = useEditorStore()

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setPortfolio(json.data)
        else setError(json.error || "데이터를 불러올 수 없습니다")
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [setPortfolio])

  return { loading, error }
}
