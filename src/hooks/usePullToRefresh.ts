import { useEffect } from 'react'

type Options = { onRefresh: () => void }

export function usePullToRefresh({ onRefresh }: Options) {
  useEffect(() => {
    let y = 0
    let pulling = false
    function onTouchStart(e: TouchEvent) {
      if (window.scrollY === 0) {
        pulling = true
        y = e.touches[0].clientY
      }
    }
    function onTouchMove(e: TouchEvent) {
      if (!pulling) return
      const dy = e.touches[0].clientY - y
      if (dy > 80) {
        pulling = false
        onRefresh()
      }
    }
    function onTouchEnd() { pulling = false }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [onRefresh])
}


