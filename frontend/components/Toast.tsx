"use client"

import toast, { Toast } from 'react-hot-toast'
import React from 'react'

type ToastKind = 'success' | 'error' | 'info' | 'haptic'

// Haptic feedback simulation
const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    }
    navigator.vibrate(patterns[type])
  }
}

function ToastCard({ t, title, message, kind }: { t: Toast; title: string; message?: string; kind: ToastKind }) {
  const accent = kind === 'success' ? 'bg-emerald-500' : kind === 'error' ? 'bg-rose-500' : kind === 'haptic' ? 'bg-zinc-500' : 'bg-blue-500'
  const icon = kind === 'success' ? '✓' : kind === 'error' ? '!' : kind === 'haptic' ? '•' : 'i'
  
  return (
    <div
      className={`pointer-events-auto w-[320px] ${t.visible ? 'animate-in fade-in slide-in-from-top-2 duration-200' : 'animate-out fade-out slide-out-to-top-2 duration-150'} `}
      role="status"
      aria-live="polite"
    >
      <div className="flex overflow-hidden rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-xl ring-1 ring-black/10">
        <div className={`${accent} w-1`} />
        <div className="p-3 flex items-center gap-3">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-white text-sm ${accent}`}>{icon}</div>
          <div className="flex-1">
            <p className="m-0 text-[14px] font-medium leading-4">{title}</p>
            {message ? <p className="m-0 mt-0.5 text-[12px] text-zinc-600 dark:text-zinc-300">{message}</p> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export function showToast(title: string, options?: { message?: string; kind?: ToastKind; durationMs?: number; haptic?: boolean }) {
  const { message, kind = 'info', durationMs, haptic = false } = options || {}
  
  // Default durations based on kind
  const defaultDuration = kind === 'haptic' ? 1500 : kind === 'success' ? 2000 : kind === 'error' ? 3000 : 2500
  const finalDuration = durationMs || defaultDuration
  
  // Trigger haptic feedback
  if (haptic || kind === 'haptic') {
    triggerHaptic(kind === 'error' ? 'heavy' : kind === 'success' ? 'medium' : 'light')
  }
  
  toast.custom((t) => <ToastCard t={t} title={title} message={message} kind={kind} />, { 
    duration: finalDuration,
    position: 'top-center'
  })
}

export const toastSuccess = (title: string, message?: string, haptic = true) => 
  showToast(title, { message, kind: 'success', haptic })

export const toastError = (title: string, message?: string, haptic = true) => 
  showToast(title, { message, kind: 'error', haptic })

export const toastInfo = (title: string, message?: string, haptic = false) => 
  showToast(title, { message, kind: 'info', haptic })

export const toastHaptic = (title: string, message?: string) => 
  showToast(title, { message, kind: 'haptic', haptic: true })


