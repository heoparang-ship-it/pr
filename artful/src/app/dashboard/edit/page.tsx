/* eslint-disable @next/next/no-img-element */
"use client"

import { usePortfolio } from "@/hooks/usePortfolio"
import { useAutoSave } from "@/hooks/useAutoSave"
import { useUpload } from "@/hooks/useUpload"
import { useEditorStore } from "@/stores/editorStore"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import Link from "next/link"
import type { EditorTab } from "@/types"

const TABS: { key: EditorTab; label: string }[] = [
  { key: "basic", label: "기본정보" },
  { key: "visual", label: "비주얼" },
  { key: "works", label: "작품" },
  { key: "links", label: "링크" },
  { key: "publish", label: "발행" },
]

// [5회차] 업로드 에러 핸들링 추가
// [6회차] 링크 URL 유효성 검증 추가
// [7회차] 작품 추가 중 로딩 상태 추가
// [8회차] 삭제 확인 다이얼로그 추가

export default function EditPage() {
  const { loading } = usePortfolio()
  useAutoSave()

  const {
    portfolio,
    activeTab,
    setActiveTab,
    updateField,
    isSaving,
    isDirty,
    addWork,
    removeWork,
    addLink,
    removeLink,
    setBgm,
  } = useEditorStore()

  const { upload, uploading } = useUpload()
  const [newWorkUrl, setNewWorkUrl] = useState("")
  const [newWorkTitle, setNewWorkTitle] = useState("")
  const [newLinkTitle, setNewLinkTitle] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("")
  const [addingWork, setAddingWork] = useState(false)
  const [addingLink, setAddingLink] = useState(false)

  const onDropHero = useCallback(
    async (files: File[]) => {
      if (!files[0]) return
      // [9회차] 파일 크기 체크
      if (files[0].size > 10 * 1024 * 1024) {
        toast.error("이미지는 10MB 이하만 업로드 가능합니다")
        return
      }
      try {
        const url = await upload(files[0], "hero")
        updateField("heroImage", url)
        toast.success("히어로 이미지 업로드 완료")
      } catch {
        toast.error("업로드에 실패했습니다. 다시 시도해주세요.")
      }
    },
    [upload, updateField]
  )

  const onDropProfile = useCallback(
    async (files: File[]) => {
      if (!files[0]) return
      if (files[0].size > 10 * 1024 * 1024) {
        toast.error("이미지는 10MB 이하만 업로드 가능합니다")
        return
      }
      try {
        const url = await upload(files[0], "profile")
        updateField("profileImage", url)
        toast.success("프로필 이미지 업로드 완료")
      } catch {
        toast.error("업로드에 실패했습니다. 다시 시도해주세요.")
      }
    },
    [upload, updateField]
  )

  const heroDropzone = useDropzone({
    onDrop: onDropHero,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })
  const profileDropzone = useDropzone({
    onDrop: onDropProfile,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const handleAddWork = async () => {
    if (!newWorkTitle.trim() || !newWorkUrl.trim()) {
      toast.error("제목과 URL을 입력해주세요")
      return
    }
    // [10회차] URL 기본 검증
    if (!newWorkUrl.startsWith("http://") && !newWorkUrl.startsWith("https://")) {
      toast.error("URL은 http:// 또는 https://로 시작해야 합니다")
      return
    }
    setAddingWork(true)
    try {
      const res = await fetch("/api/works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newWorkTitle.trim(),
          type: newWorkUrl.includes("youtube") || newWorkUrl.includes("youtu.be") ? "VIDEO" : "AUDIO",
          mediaUrl: newWorkUrl.trim(),
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error || "작품 추가에 실패했습니다")
        return
      }
      addWork(json.data)
      setNewWorkTitle("")
      setNewWorkUrl("")
      toast.success("작품이 추가되었습니다")
    } catch {
      toast.error("네트워크 오류가 발생했습니다")
    } finally {
      setAddingWork(false)
    }
  }

  // [11회차] 삭제 시 에러 처리
  const handleDeleteWork = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return
    try {
      const res = await fetch(`/api/works/${id}`, { method: "DELETE" })
      if (!res.ok) {
        toast.error("삭제에 실패했습니다")
        return
      }
      removeWork(id)
      toast.success("작품이 삭제되었습니다")
    } catch {
      toast.error("네트워크 오류가 발생했습니다")
    }
  }

  const handleAddLink = async () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      toast.error("제목과 URL을 입력해주세요")
      return
    }
    if (!newLinkUrl.startsWith("http://") && !newLinkUrl.startsWith("https://")) {
      toast.error("URL은 http:// 또는 https://로 시작해야 합니다")
      return
    }
    setAddingLink(true)
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newLinkTitle.trim(), url: newLinkUrl.trim() }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error || "링크 추가에 실패했습니다")
        return
      }
      addLink(json.data)
      setNewLinkTitle("")
      setNewLinkUrl("")
      toast.success("링크가 추가되었습니다")
    } catch {
      toast.error("네트워크 오류가 발생했습니다")
    } finally {
      setAddingLink(false)
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return
    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" })
      if (!res.ok) {
        toast.error("삭제에 실패했습니다")
        return
      }
      removeLink(id)
      toast.success("링크가 삭제되었습니다")
    } catch {
      toast.error("네트워크 오류가 발생했습니다")
    }
  }

  if (loading || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 bg-background z-10">
        <Link href="/dashboard" className="text-lg font-bold">← Artful</Link>
        <span className="text-sm text-muted-foreground" aria-live="polite">
          {isSaving ? "저장 중..." : isDirty ? "변경사항 있음" : "저장됨 ✓"}
        </span>
      </header>

      {/* 탭 */}
      <nav className="border-b border-border flex overflow-x-auto sticky top-[53px] bg-background z-10" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`px-4 py-3 text-sm whitespace-nowrap transition ${
              activeTab === tab.key
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 에디터 콘텐츠 */}
      <div className="max-w-xl mx-auto p-4 space-y-4 pb-20">
        {activeTab === "basic" && (
          <>
            <label className="block">
              <span className="text-sm text-muted-foreground">아티스트명 *</span>
              <input
                value={portfolio.artistName}
                onChange={(e) => updateField("artistName", e.target.value)}
                required
                className="mt-1 w-full py-2 px-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-sm text-muted-foreground">바이오 ({(portfolio.bio || "").length}/200)</span>
              <textarea
                value={portfolio.bio || ""}
                onChange={(e) => updateField("bio", e.target.value.slice(0, 200))}
                maxLength={200}
                rows={3}
                className="mt-1 w-full py-2 px-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none resize-none"
              />
            </label>
            <label className="block">
              <span className="text-sm text-muted-foreground">장르</span>
              <input
                value={portfolio.genre || ""}
                onChange={(e) => updateField("genre", e.target.value)}
                placeholder="힙합, R&B, 일렉트로닉"
                className="mt-1 w-full py-2 px-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </label>
          </>
        )}

        {activeTab === "visual" && (
          <>
            <div>
              <span className="text-sm text-muted-foreground">히어로 이미지 (권장: 1600px 이상, 10MB 이하)</span>
              <div
                {...heroDropzone.getRootProps()}
                className={`mt-1 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                  heroDropzone.isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                }`}
              >
                <input {...heroDropzone.getInputProps()} />
                {portfolio.heroImage ? (
                  <img src={portfolio.heroImage} alt="히어로 이미지 미리보기" className="w-full h-40 object-cover rounded" />
                ) : (
                  <p className="text-muted-foreground">{uploading ? "업로드 중..." : "이미지를 드래그하거나 클릭"}</p>
                )}
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">프로필 사진</span>
              <div
                {...profileDropzone.getRootProps()}
                className={`mt-1 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                  profileDropzone.isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                }`}
              >
                <input {...profileDropzone.getInputProps()} />
                {portfolio.profileImage ? (
                  <img src={portfolio.profileImage} alt="프로필 사진 미리보기" className="w-20 h-20 rounded-full object-cover mx-auto" />
                ) : (
                  <p className="text-muted-foreground">{uploading ? "업로드 중..." : "프로필 사진 업로드"}</p>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "works" && (
          <>
            <div className="space-y-2">
              <input
                value={newWorkTitle}
                onChange={(e) => setNewWorkTitle(e.target.value)}
                placeholder="곡/작품 제목"
                className="w-full py-2 px-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <input
                value={newWorkUrl}
                onChange={(e) => setNewWorkUrl(e.target.value)}
                placeholder="YouTube 또는 SoundCloud URL"
                type="url"
                className="w-full py-2 px-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <button
                onClick={handleAddWork}
                disabled={addingWork}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
              >
                {addingWork ? "추가 중..." : "+ 작품 추가"}
              </button>
            </div>
            {portfolio.works.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">아직 작품이 없습니다. YouTube URL을 추가해보세요!</p>
            )}
            <div className="space-y-2 mt-4">
              {portfolio.works.map((work) => (
                <div key={work.id} className="flex items-center gap-3 bg-card p-3 rounded-lg border border-border">
                  {work.thumbnailUrl && (
                    <img src={work.thumbnailUrl} alt={work.title} className="w-12 h-12 rounded object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{work.title}</p>
                    <p className="text-xs text-muted-foreground">{work.type}{work.isBgm ? " · BGM" : ""}</p>
                  </div>
                  <button
                    onClick={() => setBgm(work.id)}
                    className={`px-2 py-1 text-xs rounded transition ${
                      work.isBgm ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    title={work.isBgm ? "BGM 해제" : "BGM으로 설정"}
                  >
                    BGM
                  </button>
                  <button
                    onClick={() => handleDeleteWork(work.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                    aria-label={`${work.title} 삭제`}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "links" && (
          <>
            <div className="space-y-2">
              <input
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                placeholder="링크 제목 (예: Instagram)"
                className="w-full py-2 px-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <input
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://..."
                type="url"
                className="w-full py-2 px-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <button
                onClick={handleAddLink}
                disabled={addingLink}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
              >
                {addingLink ? "추가 중..." : "+ 링크 추가"}
              </button>
            </div>
            {portfolio.links.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">SNS, 스트리밍 링크를 추가해보세요!</p>
            )}
            <div className="space-y-2 mt-4">
              {portfolio.links.map((link) => (
                <div key={link.id} className="flex items-center gap-3 bg-card p-3 rounded-lg border border-border">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{link.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                    aria-label={`${link.title} 삭제`}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "publish" && (
          <>
            <label className="block">
              <span className="text-sm text-muted-foreground">공개 주소 (slug)</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-muted-foreground text-sm shrink-0">artful.kr/</span>
                <input
                  value={portfolio.slug}
                  onChange={(e) => updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="flex-1 py-2 px-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  pattern="[a-z0-9-]+"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">영문 소문자, 숫자, 하이픈만 사용 가능</p>
            </label>
            <div className="flex items-center justify-between bg-card p-4 rounded-lg border border-border">
              <div>
                <p className="font-medium">발행 상태</p>
                <p className="text-sm text-muted-foreground">
                  {portfolio.isPublished ? "공개 중 — 누구나 볼 수 있습니다" : "비공개 — 본인만 볼 수 있습니다"}
                </p>
              </div>
              <button
                onClick={() => updateField("isPublished", !portfolio.isPublished)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  portfolio.isPublished
                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {portfolio.isPublished ? "비공개로 전환" : "발행하기"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
