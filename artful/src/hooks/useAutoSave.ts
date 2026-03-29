"use client"

import { useEffect, useRef } from "react"
import { useEditorStore } from "@/stores/editorStore"
import { toast } from "sonner"

export function useAutoSave() {
  const { portfolio, isDirty, setSaving, setDirty } = useEditorStore()
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!isDirty || !portfolio) return

    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(async () => {
      setSaving(true)
      try {
        await fetch("/api/portfolio", {
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
        setDirty(false)
      } catch {
        toast.error("저장에 실패했습니다")
      } finally {
        setSaving(false)
      }
    }, 3000)

    return () => clearTimeout(timeoutRef.current)
  }, [isDirty, portfolio, setSaving, setDirty])
}
