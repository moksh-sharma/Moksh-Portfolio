import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type ScrollVideoContextValue = {
  progress: number
  ready: boolean
  setProgress: (value: number) => void
  setReady: (value: boolean) => void
}

const ScrollVideoContext = createContext<ScrollVideoContextValue | null>(null)

export function ScrollVideoProvider({ children }: { children: ReactNode }) {
  const [progress, setProgressState] = useState(0)
  const [ready, setReadyState] = useState(false)

  const setProgress = useCallback((value: number) => {
    setProgressState(Math.min(100, Math.max(0, value)))
  }, [])

  const setReady = useCallback((value: boolean) => {
    setReadyState(value)
    if (value) setProgressState(100)
  }, [])

  const value = useMemo(
    () => ({ progress, ready, setProgress, setReady }),
    [progress, ready, setProgress, setReady],
  )

  return (
    <ScrollVideoContext.Provider value={value}>{children}</ScrollVideoContext.Provider>
  )
}

export function useScrollVideo() {
  const ctx = useContext(ScrollVideoContext)
  if (!ctx) {
    throw new Error('useScrollVideo must be used within ScrollVideoProvider')
  }
  return ctx
}
