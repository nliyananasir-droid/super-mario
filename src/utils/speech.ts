/**
 * Speech Synthesis Helper for Bahasa Melayu Malaysia
 * Tailored for Year 1 pupils (7 years old)
 */

export function speakMalay(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // Look for Malay voice first (ms-MY, ms), or Indonesian (id-ID) as close regional match
    const malayVoice = voices.find(v => v.lang.startsWith('ms') || v.lang.includes('ms-MY')) ||
                       voices.find(v => v.lang.startsWith('id') || v.lang.includes('id-ID')) ||
                       voices.find(v => v.lang.startsWith('en'));

    if (malayVoice) {
      utterance.voice = malayVoice;
    }
    
    // Set gentle, friendly pitch and pace for 7-year-olds
    utterance.pitch = 1.15;
    utterance.rate = 0.9;
    utterance.lang = 'ms-MY';

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis not available', err);
    if (onEnd) onEnd();
  }
}

export function stopMalaySpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
