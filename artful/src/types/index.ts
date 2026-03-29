// ===== DB 모델 기반 타입 =====

export interface User {
  id: string
  email: string
  name: string | null
  provider: "kakao" | "naver" | "google" | "credentials" | null
  profileImage: string | null
  createdAt: Date
}

export interface Portfolio {
  id: string
  userId: string
  slug: string
  artistName: string
  bio: string | null
  genre: string | null
  heroImage: string | null
  profileImage: string | null
  gradientFrom: string
  gradientTo: string
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
  works: Work[]
  links: Link[]
}

export interface Work {
  id: string
  portfolioId: string
  title: string
  type: "VIDEO" | "AUDIO" | "IMAGE"
  mediaUrl: string
  thumbnailUrl: string | null
  isBgm: boolean
  autoPlay: boolean
  order: number
  createdAt: Date
}

export interface Link {
  id: string
  portfolioId: string
  title: string
  url: string
  icon: LinkIconType | null
  order: number
}

export type LinkIconType =
  | "instagram"
  | "youtube"
  | "twitter"
  | "tiktok"
  | "soundcloud"
  | "spotify"
  | "applemusic"
  | "website"
  | "email"
  | "other"

export interface PageView {
  id: string
  portfolioId: string
  viewedAt: Date
  referrer: string | null
  device: string | null
  country: string | null
}

// ===== API 요청/응답 타입 =====

export interface UpdatePortfolioRequest {
  artistName?: string
  bio?: string
  genre?: string
  heroImage?: string
  profileImage?: string
  gradientFrom?: string
  gradientTo?: string
  slug?: string
  isPublished?: boolean
}

export interface CreateWorkRequest {
  title: string
  type: "VIDEO" | "AUDIO" | "IMAGE"
  mediaUrl: string
  thumbnailUrl?: string
  isBgm?: boolean
  autoPlay?: boolean
}

export interface CreateLinkRequest {
  title: string
  url: string
  icon?: LinkIconType
}

export interface UploadRequest {
  fileName: string
  fileType: string
  category: "hero" | "profile" | "work"
}

export interface UploadResponse {
  uploadUrl: string
  imageUrl: string
}

// ===== 에디터 상태 타입 =====

export type EditorTab = "basic" | "visual" | "works" | "links" | "publish"

export interface EditorState {
  portfolio: Portfolio | null
  isDirty: boolean
  isSaving: boolean
  activeTab: EditorTab
}
