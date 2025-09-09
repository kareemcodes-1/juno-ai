
import { create } from "zustand"

type WorkspaceState = {
  currentWorkspace: string | null
  setWorkspace: (url: string) => void
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspace: null,
  setWorkspace: (url) => set({ currentWorkspace: url }),
}))
