"use client"

import { usePortfolio } from "@/hooks/usePortfolio"
import { useAutoSave } from "@/hooks/useAutoSave"
import { useUpload } from "@/hooks/useUpload"
import { useEditorStore } from "@/stores/editorStore"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import type { EditorTab } from "@/types"

const TABS: { key: EditorTab; label: string }[] = [
  { key: "basic", label: "기본정보" },
  { key: "visual", label: "비주얼" },
  { key: "works", label: "작품" },
  { key: "links", label: "링크" },
  { key: "publish", label: "발행" },
]

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

  const onDropHero = useCallback(
    async (files: File[]) => {
      if (files[0]) {
        const url = await upload(files[0], "hero")
        updateField("heroImage", url)
        toast.success("히어로 이미지 업로드 완료")
      }
    },
    [upload, updateField]
  )

  const onDropProfile = useCallback(
    async (files: File[]) => {
      if (files[0]) {
        const url = await upload(files[0], "profile")
        updateField("profileImage", url)
        toast.success("프로필 이미지 업로드 완료")
      }
    },
    [upload, updateField]
  )

  const heroDropzone = useDropzone({ onDrop: onDropHero, accept: { "image/*": [] }, maxFiles: 1 })
  const profileDropzone = useDropzone({ onDrop: onDropProfile, accept: { "image/*": [] }, maxFiles: 1 })

  const handleAddWork = async () => {
    if (!newWorkTitle || !newWorkUrl) {
      toast.error("제목과 URL을 입력해주세요")
      return
    }
    const res = await fetch("/api/works", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newWorkTitle,
        type: newWorkUrl.includes("youtube") || newWorkUrl.includes("youtu.be") ? "VIDEO" : "AUDIO",
        mediaUrl: newWorkUrl,
      }),
    })
    const { data } = await res.json()
    if (data) {
      addWork(data)
      setNewWorkTitle("")
      setNewWorkUrl("")
      toast.success("작품이 추가되었습니다")
    }
  }

  const handleDeleteWork = async (id: string) => {
    await fetch(`/api/works/${id}`, { method: "DELETE" })
    removeWork(id)
    toast.success("작품이 삭제되었습니다")
  }

  const handleAddLink = async () => {
    if (!newLinkTitle || !newLinkUrl) {
      toast.error("제목과 URL을 입력해주세요")
      return
    }
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newLinkTitle, url: newLinkUrl }),
    })
    const { data } = await res.json()
    if (data) {
      addLink(data)
      setNewLinkTitle("")
      setNewLinkUrl("")
      toast.success("링크가 추가되었습니다")
    }
  }

  const handleDeleteLink = async (id: string) => {
    await fetch(`/api/links/${id}`, { method: "DELETE" })
    removeLink(id)
    toast.success("링크가 삭제되었습니다")
  }

  if (loading || !portfolio) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <a href="/dashboard" className="text-lg font-bold">Artful</a>
        <span className="text-sm text-muted-foreground">
          {isSaving ? "저장 중..." : isDirty ? "변경사항 있음" : "저장됨 ✓"}
        </span>
      </div>

      {/* 탭 */}
      <div className="border-b border-border flex overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm whitespace-nowrap transition ${
              activeTab === tab.key
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 에디터 콘텐츠 */}
      <div className="max-w-xl mx-auto p-4 space-y-4">
        {activeTab === "basic" && (
          <>
            <label className="block">
              <span className="text-sm text-muted-foreground">아티스트명</span>
              <input
                value={portfolio.artistName}
                onChange={(e) => updateField("artistName", e.target.value)}
                className="mt-1 w-full py-2 px-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-sm text-muted-foreground">바이오 (200자)</span>
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
              <span className="text-sm text-muted-foreground">히어로 이미지</span>
              <div
                {...heroDropzone.getRootProps()}
                className="mt-1 border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition"
              >
                <input {...heroDropzone.getInputProps()} />
                {portfolio.heroImage ? (
                  <img src={portfolio.heroImage} alt="히어로" className="w-full h-40 object-cover rounded" />
                ) : (
                  <p className="text-muted-foreground">{uploading ? "업로드 중..." : "이미지를 드래그하거나 클릭"}</p>
                )}
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">프로필 사진</span>
              <div
                {...profileDropzone.getRootProps()}
                className="mt-1 border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition"
              >
                <input {...profileDropzone.getInputProps()} />
                {portfolio.profileImage ? (
                  <img src={portfolio.profileImage} alt="프로필" className="w-20 h-20 rounded-full object-cover mx-auto" />
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
                className="w-full py-2 px-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <button
                onClick={handleAddWork}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                + 작품 추가
              </button>
            </div>
            <div className="space-y-2 mt-4">
              {portfolio.works.map((work) => (
                <div key={work.id} className="flex items-center gap-3 bg-card p-3 rounded-lg border border-border">
                  {work.thumbnailUrl && (
                    <img src={work.thumbnailUrl} alt="" className="w-12 h-12 rounded object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{work.title}</p>
                    <p className="text-xs text-muted-foreground">{work.type}</p>
                  </div>
                  <button
                    onClick={() => setBgm(work.id)}
                    className={`px-2 py-1 text-xs rounded ${
                      work.isBgm ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    BGM
                  </button>
                  <button
                    onClick={() => handleDeleteWork(work.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
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
                className="w-full py-2 px-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <button
                onClick={handleAddLink}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                + 링크 추가
              </button>
            </div>
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
                <span className="text-muted-foreground text-sm">artful.kr/</span>
                <input
                  value={portfolio.slug}
                  onChange={(e) => updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="flex-1 py-2 px-3 bg-muted border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
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
