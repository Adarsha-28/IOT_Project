/**
 * IoT Server Room Monitoring - Web Audio API Alert Sound Utility
 *
 * Generates synthesized industrial alarm beeps directly in the browser.
 * Works 100% offline with zero external audio assets or network requests.
 */

let audioCtx = null;
let alarmIntervalId = null;
let isAudioUnlocked = false;

// Initialize or get the shared AudioContext
export function getAudioContext() {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().then(() => {
      isAudioUnlocked = true;
    }).catch(() => {
      // Waiting for user gesture
    });
  } else if (audioCtx && audioCtx.state === 'running') {
    isAudioUnlocked = true;
  }

  return audioCtx;
}

// Auto-unlock AudioContext on first user interaction anywhere
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        isAudioUnlocked = true;
      });
    } else if (ctx && ctx.state === 'running') {
      isAudioUnlocked = true;
    }
  };

  window.addEventListener('click', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });
}

/**
 * Synthesizes a critical high-temperature alarm sound.
 * Plays an urgent triple-pulsing dual tone (880Hz -> 659Hz)
 */
export function playCriticalAlarmSound(volume = 0.35) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const beeps = [0, 0.14, 0.28]; // 3 quick alert pulses

    beeps.forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Industrial alert tone: sawtooth / square mix
      osc.type = 'sawtooth';
      
      // Dual-frequency drop for high-urgency siren effect
      osc.frequency.setValueAtTime(880, now + offset); // A5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + offset + 0.09); // E5

      // Smooth envelope to prevent harsh digital audio clicks
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.linearRampToValueAtTime(volume, now + offset + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.11);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.12);
    });

    return true;
  } catch (err) {
    console.warn('Audio playback error:', err);
    return false;
  }
}

/**
 * Plays a single informational chime for warning level (30-35°C) or test
 */
export function playWarningChime(volume = 0.2) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
    return true;
  } catch (err) {
    console.warn('Warning chime playback error:', err);
    return false;
  }
}

/**
 * Start repeating alarm while temperature is critical.
 * Will play every `intervalMs` ms unless muted.
 */
export function startContinuousAlarm(intervalMs = 2200) {
  if (alarmIntervalId) return; // Already running

  playCriticalAlarmSound();
  alarmIntervalId = setInterval(() => {
    playCriticalAlarmSound();
  }, intervalMs);
}

/**
 * Stop repeating alarm
 */
export function stopContinuousAlarm() {
  if (alarmIntervalId) {
    clearInterval(alarmIntervalId);
    alarmIntervalId = null;
  }
}

export function isAlarmRunning() {
  return alarmIntervalId !== null;
}
