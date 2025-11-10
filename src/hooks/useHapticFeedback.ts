export function useHapticFeedback() {
  function impact() {
    if (navigator.vibrate) navigator.vibrate(10)
  }
  function success() {
    if (navigator.vibrate) navigator.vibrate([10, 30, 10])
  }
  function error() {
    if (navigator.vibrate) navigator.vibrate([30, 50, 30])
  }
  return { impact, success, error }
}


