import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext(() => {})

/** const toast = useToast();  toast('Saved');  toast('Done', { onUndo: fn }) */
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {
  const [t, setT] = useState(null)
  const timer = useRef()

  const toast = useCallback((msg, { onUndo } = {}) => {
    clearTimeout(timer.current)
    setT({ msg, onUndo })
    timer.current = setTimeout(() => setT(null), onUndo ? 7000 : 2600)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {t && (
        <div
          role="status"
          className="fixed left-1/2 -translate-x-1/2 bottom-5 z-30 bg-neutral-900 text-white px-4 py-2.5 rounded-[5px] flex gap-3 items-center max-w-[calc(100%-2rem)] text-sm shadow-lg"
        >
          <span>{t.msg}</span>
          {t.onUndo && (
            <button
              className="underline font-semibold"
              onClick={() => {
                setT(null)
                t.onUndo()
              }}
            >
              Undo
            </button>
          )}
        </div>
      )}
    </ToastContext.Provider>
  )
}
