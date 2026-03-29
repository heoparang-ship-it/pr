"use client"

import { useEffect, useRef } from "react"
import { useEditorStore } from "@/stores/editorStore"
import { toast } from "sonner"

export function useAutoSave() {
  const { portfolio, isDirty, setSaving, setDirty } = useEditorStore()
  const timeoutRef = useRef<NodeJS.Timeout>()
  // [28회차] 저장 실패 시 재시도 카운트
  const retryRef = useRef(0)

  useEffect(() => {
    if (!isDirty || !portfolio) return

    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(async () => {
      setSaving(true)
      try {
        const res = await fetch("/api/portfolio", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            artistName: portfolio.artistName,
            bio: portfolio.bio,
            genre: portfolio.genre,
            heroImage: portfolio.heroImage,
            profileImage: portfolio.profileImage,
            gradientFrom: portfolio.gradientFrom,
            gradientTo: portfolio.gradientTo,
            slug: portfolio.slug,
            isPublished: portfolio.isPublished,
          }),
        })
        if (!res.ok) {
          const json = await res.json()
          toast.error(json.error || "저장에 실패했습니다")
          return
        }
        setDirty(false)
        retryRef.current = 0
      } catch {
        retryRef.current++
        if (retryRef.current <= 3) {
          toast.error(`저장 실패 (${retryRef.current}/3 재시도)`)
        } else {
          toast.error("저장에 반복적으로 실패하고 있습니다. 네트워크를 확인해주세요.")
        }
      } finally {
        setSaving(false)
      }
    }, 3000)

    return () => clearTimeout(timeoutRef.current)
  }, [isDirty, portfolio, setSaving, setDirty])
}
