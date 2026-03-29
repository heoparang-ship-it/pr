import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 예약어 slug 목록
const RESERVED_SLUGS = [
  "login",
  "register",
  "dashboard",
  "api",
  "admin",
  "settings",
  "profile",
  "about",
  "help",
  "terms",
  "privacy",
]

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug.toLowerCase())
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(slug) && !isReservedSlug(slug)
}

export function generateSlug(name: string | null): string {
  const base = (name || "artist")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20)

  return base || "artist"
}

// YouTube URL 감지
export function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url)
}

// SoundCloud URL 감지
export function isSoundCloudUrl(url: string): boolean {
  return /soundcloud\.com/.test(url)
}

// 미디어 타입 감지
export function detectMediaType(url: string): "VIDEO" | "AUDIO" | "IMAGE" {
  if (isYouTubeUrl(url) || /\.(mp4|webm)$/i.test(url)) return "VIDEO"
  if (isSoundCloudUrl(url) || /\.(mp3|wav|ogg)$/i.test(url)) return "AUDIO"
  return "IMAGE"
}

// YouTube URL → 임베드 URL
export function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}

// YouTube URL → 썸네일 URL
export function getYouTubeThumbnail(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : ""
}

// 시간 포맷 (mm:ss)
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}
