"use client"

import { create } from "zustand"
import type { Portfolio, Work, Link, EditorTab } from "@/types"

interface EditorState {
  portfolio: Portfolio | null
  isDirty: boolean
  isSaving: boolean
  activeTab: EditorTab
}

interface EditorActions {
  setPortfolio: (portfolio: Portfolio) => void
  reset: () => void
  updateField: <K extends keyof Portfolio>(key: K, value: Portfolio[K]) => void
  addWork: (work: Work) => void
  updateWork: (id: string, updates: Partial<Work>) => void
  removeWork: (id: string) => void
  reorderWorks: (workIds: string[]) => void
  setBgm: (workId: string) => void
  addLink: (link: Link) => void
  updateLink: (id: string, updates: Partial<Link>) => void
  removeLink: (id: string) => void
  reorderLinks: (linkIds: string[]) => void
  setDirty: (dirty: boolean) => void
  setSaving: (saving: boolean) => void
  setActiveTab: (tab: EditorTab) => void
}

type EditorStore = EditorState & EditorActions

export const useEditorStore = create<EditorStore>((set) => ({
  portfolio: null,
  isDirty: false,
  isSaving: false,
  activeTab: "basic",

  setPortfolio: (portfolio) => set({ portfolio, isDirty: false }),
  reset: () => set({ portfolio: null, isDirty: false, isSaving: false }),

  updateField: (key, value) =>
    set((state) => ({
      portfolio: state.portfolio ? { ...state.portfolio, [key]: value } : null,
      isDirty: true,
    })),

  addWork: (work) =>
    set((state) => ({
      portfolio: state.portfolio
        ? { ...state.portfolio, works: [...state.portfolio.works, work] }
        : null,
      isDirty: true,
    })),

  updateWork: (id, updates) =>
    set((state) => ({
      portfolio: state.portfolio
        ? {
            ...state.portfolio,
            works: state.portfolio.works.map((w) =>
              w.id === id ? { ...w, ...updates } : w
            ),
          }
        : null,
      isDirty: true,
    })),

  removeWork: (id) =>
    set((state) => ({
      portfolio: state.portfolio
        ? {
            ...state.portfolio,
            works: state.portfolio.works.filter((w) => w.id !== id),
          }
        : null,
      isDirty: true,
    })),

  reorderWorks: (workIds) =>
    set((state) => {
      if (!state.portfolio) return state
      const reordered = workIds
        .map((id, index) => {
          const work = state.portfolio!.works.find((w) => w.id === id)
          return work ? { ...work, order: index } : null
        })
        .filter(Boolean) as Work[]
      return {
        portfolio: { ...state.portfolio, works: reordered },
        isDirty: true,
      }
    }),

  setBgm: (workId) =>
    set((state) => {
      if (!state.portfolio) return state
      return {
        portfolio: {
          ...state.portfolio,
          works: state.portfolio.works.map((w) => ({
            ...w,
            isBgm: w.id === workId,
            autoPlay: w.id === workId,
          })),
        },
        isDirty: true,
      }
    }),

  addLink: (link) =>
    set((state) => ({
      portfolio: state.portfolio
        ? { ...state.portfolio, links: [...state.portfolio.links, link] }
        : null,
      isDirty: true,
    })),

  updateLink: (id, updates) =>
    set((state) => ({
      portfolio: state.portfolio
        ? {
            ...state.portfolio,
            links: state.portfolio.links.map((l) =>
              l.id === id ? { ...l, ...updates } : l
            ),
          }
        : null,
      isDirty: true,
    })),

  removeLink: (id) =>
    set((state) => ({
      portfolio: state.portfolio
        ? {
            ...state.portfolio,
            links: state.portfolio.links.filter((l) => l.id !== id),
          }
        : null,
      isDirty: true,
    })),

  reorderLinks: (linkIds) =>
    set((state) => {
      if (!state.portfolio) return state
      const reordered = linkIds
        .map((id, index) => {
          const link = state.portfolio!.links.find((l) => l.id === id)
          return link ? { ...link, order: index } : null
        })
        .filter(Boolean) as Link[]
      return {
        portfolio: { ...state.portfolio, links: reordered },
        isDirty: true,
      }
    }),

  setDirty: (dirty) => set({ isDirty: dirty }),
  setSaving: (saving) => set({ isSaving: saving }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
