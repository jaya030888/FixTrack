/**
 * User-friendly Error Parser
 * Translates technical exceptions (timeouts, GPS errors, file limits, AI detection)
 * into friendly, reassuring instructions for citizens.
 */
export function getFriendlyErrorMessage(error, context = '') {
  const errStr = (typeof error === 'string' ? error : error?.message || error?.toString() || '').toLowerCase();

  // 1. GPS Errors
  if (errStr.includes('denied') || errStr.includes('permission denied')) {
    return {
      title: '📍 Location Access Needed',
      message: 'Location permission was denied. Please allow location access in your browser settings or enter the nearest landmark manually.',
      type: 'warning'
    };
  }
  if (errStr.includes('position unavailable') || errStr.includes('no gps') || errStr.includes('timeout')) {
    return {
      title: '🛰️ Weak GPS Signal',
      message: 'Could not pinpoint your exact GPS coordinates. Don’t worry, we’ve placed you at the nearest known junction.',
      type: 'warning'
    };
  }

  // 2. Huge Photo / File Limit
  if (errStr.includes('size') || errStr.includes('huge') || errStr.includes('too large') || errStr.includes('413')) {
    return {
      title: '📸 Photo Too Large',
      message: 'The photo file is very large. We are compressing it in the browser so it uploads smoothly over mobile networks.',
      type: 'info'
    };
  }

  // 3. No Pothole / Hazard Detected
  if (errStr.includes('no hazard') || errStr.includes('no pothole') || errStr.includes('nothing detected')) {
    return {
      title: '🔍 Hazard Not Detected',
      message: 'Our AI couldn’t spot a distinct road hazard or pothole in this photo. You can still submit with your description, or try taking a closer shot.',
      type: 'info'
    };
  }

  // 4. Slow Internet / Network Offline
  if (errStr.includes('networkerror') || errStr.includes('failed to fetch') || errStr.includes('offline') || errStr.includes('abort')) {
    return {
      title: '📶 Slow or Unstable Connection',
      message: 'Network is slow. Your report is saved locally and will automatically retry when your connection strengthens.',
      type: 'error'
    };
  }

  // Fallback
  return {
    title: 'Notice',
    message: error?.message || 'Something unexpected occurred. Please try again.',
    type: 'error'
  };
}

