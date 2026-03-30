/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import type { Portfolio } from "@/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactPlayer = dynamic(() => import("react-player") as any, { ssr: false }) as any

interface Props {
  portfolio: Portfolio
  isPreview?: boolean
}

export default function SoundTemplate({ portfolio }: Props) {
  const [selectedWork, setSelectedWork] = useState<string | null>(null)
  const [bgmPlaying, setBgmPlaying] = useState(false)

  const bgmWork = portfolio.works.find((w) => w.isBgm)
  const currentWork = portfolio.works.find((w) => w.id === selectedWork)

  // [3회차] ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedWork) {
        setSelectedWork(null)
        if (bgmWork) setBgmPlaying(true)
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [selectedWork, bgmWork])

  // [4회차] 모달 열릴 때 body 스크롤 잠금
  useEffect(() => {
    if (selectedWork) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [selectedWork])

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: `linear-gradient(135deg, ${portfolio.gradientFrom}, ${portfolio.gradientTo})`,
      }}
    >
      {/* 히어로 */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-4" aria-label="히어로">
        {portfolio.heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${portfolio.heroImage})` }}
            role="img"
            aria-label={`${portfolio.artistName} 배경 이미지`}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}

        <div className="relative z-10 text-center space-y-4">
          {portfolio.profileImage ? (
            <img
              src={portfolio.profileImage}
              alt={`${portfolio.artistName} 프로필`}
              className="w-28 h-28 rounded-full mx-auto object-cover border-2 border-white/20"
              loading="eager"
            />
          ) : (
            <div className="w-28 h-28 rounded-full mx-auto bg-white/10 flex items-center justify-center text-4xl font-bold" aria-label={`${portfolio.artistName} 아바타`}>
              {portfolio.artistName.charAt(0)}
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{portfolio.artistName}</h1>
          {portfolio.genre && (
            <p className="text-white/60 text-sm">{portfolio.genre}</p>
          )}
          {bgmWork && !bgmPlaying && (
            <button
              onClick={() => setBgmPlaying(true)}
              className="mt-4 px-6 py-3 bg-white/10 backdrop-blur rounded-full text-sm hover:bg-white/20 transition"
              aria-label={`${bgmWork.title} 재생`}
            >
              ▶ Play
            </button>
          )}
        </div>

        <div className="absolute bottom-8 animate-bounce text-white/40" aria-hidden="true">
          ↓
        </div>
      </section>

      {/* 작품 */}
      {portfolio.works.length > 0 && (
        <section className="px-4 py-16 max-w-2xl mx-auto" aria-label="작품">
          <h2 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-6">Works</h2>
          <div className="grid grid-cols-2 gap-4">
            {portfolio.works.map((work) => (
              <button
                key={work.id}
                onClick={() => {
                  setSelectedWork(work.id)
                  setBgmPlaying(false)
                }}
                className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition text-left"
                aria-label={`${work.title} 열기`}
              >
                {work.thumbnailUrl ? (
                  <img
                    src={work.thumbnailUrl}
                    alt={work.title}
                    className="w-full aspect-video object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full aspect-video bg-white/10 flex items-center justify-center text-2xl" aria-hidden="true">
                    {work.type === "VIDEO" ? "▶" : "♪"}
                  </div>
                )}
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{work.title}</p>
                  <p className="text-xs text-white/40">{work.type}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      {portfolio.bio && (
        <section className="px-4 py-16 max-w-2xl mx-auto" aria-label="소개">
          <h2 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">About</h2>
          <p className="text-white/70 leading-relaxed whitespace-pre-line">{portfolio.bio}</p>
        </section>
      )}

      {/* 링크 */}
      {portfolio.links.length > 0 && (
        <section className="px-4 py-16 max-w-sm mx-auto space-y-3" aria-label="링크">
          {portfolio.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 bg-white/10 backdrop-blur rounded-xl text-center font-medium hover:bg-white/20 transition"
            >
              {link.title}
            </a>
          ))}
        </section>
      )}

      {/* 푸터 */}
      <footer className="py-8 text-center text-white/30 text-xs" style={{ paddingBottom: bgmWork && bgmPlaying ? "80px" : undefined }}>
        <p>Powered by <a href="/" className="hover:text-white/50">Artful</a></p>
        <a href="/" className="text-white/40 hover:text-white/60 text-xs mt-1 inline-block">
          나도 만들기 →
        </a>
      </footer>

      {/* BGM 플레이어 */}
      {bgmWork && bgmPlaying && (
        <div className="fixed bottom-0 inset-x-0 bg-black/80 backdrop-blur-lg border-t border-white/10 px-4 py-3 z-50" role="region" aria-label="BGM 플레이어">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            {bgmWork.thumbnailUrl && (
              <img src={bgmWork.thumbnailUrl} alt={bgmWork.title} className="w-10 h-10 rounded object-cover" />
            )}
            <span className="text-sm flex-1 truncate">{bgmWork.title}</span>
            <button
              onClick={() => setBgmPlaying(false)}
              className="text-white/60 hover:text-white text-sm px-2 py-1"
              aria-label="일시정지"
            >
              ⏸
            </button>
            <div className="hidden">
              <ReactPlayer
                url={bgmWork.mediaUrl}
                playing={bgmPlaying && !selectedWork}
                loop
                width={0}
                height={0}
              />
            </div>
          </div>
        </div>
      )}

      {/* 작품 모달 */}
      {currentWork && (
        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          onClick={() => {
            setSelectedWork(null)
            if (bgmWork) setBgmPlaying(true)
          }}
          role="dialog"
          aria-modal="true"
          aria-label={currentWork.title}
        >
          <div
            className="w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{currentWork.title}</h3>
              <button
                onClick={() => {
                  setSelectedWork(null)
                  if (bgmWork) setBgmPlaying(true)
                }}
                className="text-white/60 hover:text-white text-xl px-2"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            {currentWork.type === "VIDEO" ? (
              <div className="aspect-video">
                <ReactPlayer
                  url={currentWork.mediaUrl}
                  playing
                  controls
                  width="100%"
                  height="100%"
                />
              </div>
            ) : currentWork.type === "IMAGE" ? (
              <img
                src={currentWork.mediaUrl}
                alt={currentWork.title}
                className="w-full rounded-lg"
              />
            ) : (
              <div className="bg-white/5 rounded-xl p-8 text-center">
                <ReactPlayer
                  url={currentWork.mediaUrl}
                  playing
                  controls
                  width="100%"
                  height={80}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
