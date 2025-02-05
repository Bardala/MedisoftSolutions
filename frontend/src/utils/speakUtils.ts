import { QueueStatus } from "../types";

export const speak = (text: string, lang = "en-US", gender = "female") => {
  if (!("speechSynthesis" in window)) {
    console.error("Speech synthesis not supported in this browser.");
    return;
  }

  const playAudio = (src: string) =>
    new Promise<void>((resolve, reject) => {
      const audio = new Audio(src);
      audio.onended = () => resolve();
      audio.onerror = (err) => reject(err);
      audio.play();
    });

  const speakText = (text: string, lang: string, gender: string) =>
    new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.volume = 1;
      utterance.rate = 0.75;
      utterance.pitch = 1;

      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const genderFilter = gender === "male" ? /male/i : /female/i;
        const voice = voices.find(
          (v) => v.lang.startsWith(lang) && genderFilter.test(v.name),
        );

        if (voice) {
          utterance.voice = voice;
        }
      };

      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoice;
      } else {
        setVoice();
      }

      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });

  playAudio("simple-notification.mp3")
    .then(() => speakText(text, lang, gender))
    .then(() => playAudio("simple-notification.mp3"))
    .catch((err) => console.error("Error in speech sequence:", err));
};

const formatArabicText = (text: string) =>
  text
    .split(" ")
    .map((word) => (word.endsWith("ة") ? word.slice(0, -1) + "ه" : word))
    .join("ْ.") + "ْ.";

export const handleSpeakName = (
  name: string,
  position?: number,
  status?: QueueStatus,
) => {
  if (position !== 1 || status !== "IN_PROGRESS") {
    callPatientForAssistant(name);
  } else {
    callPatientForDoctor(name);
  }
};

export const callPatientForAssistant = (name: string) => {
  const textToSpeak =
    " على المريضْ " +
    formatArabicText(name) +
    " الْحُضُورْ لِلْاِسْتِعْلَامَاتْ ";
  speak(textToSpeak, "ar", "male");
};

export const callPatientForDoctor = (name: string) => {
  const textToSpeak =
    " فَلْيَتَفَضلْ بالدخولْ المريضْ " + formatArabicText(name);
  speak(textToSpeak, "ar", "male");
};

export const callNextPatient = (name: string) => {
  const textToSpeak = " المريضْ التالى " + formatArabicText(name);
  speak(textToSpeak, "ar", "male");
};

export const handleSpeakTurn = (positionId: number) => {
  const textToSpeak = `مَرِيضْ رَقمْ ${positionId}`;
  speak(textToSpeak, "ar", "male");
};
