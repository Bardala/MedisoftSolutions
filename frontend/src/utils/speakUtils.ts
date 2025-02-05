import { QueueStatus } from "../types";

export const speak = (text, lang = "en-US", gender = "female") => {
  if ("speechSynthesis" in window) {
    // Create an audio object for the alert sound
    const audioBefore = new Audio("simple-notification.mp3");
    const audioAfter = new Audio("simple-notification.mp3");

    // Play the alert sound first
    audioBefore.play();

    // When the sound finishes, start the speech synthesis
    audioBefore.onended = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.volume = 1;
      utterance.rate = 0.8;
      utterance.pitch = 1;

      // Find a voice that matches the language and gender
      const voices = window.speechSynthesis.getVoices();
      const genderFilter = gender === "male" ? /male/i : /female/i;
      const voice = voices.find(
        (v) => v.lang.startsWith(lang) && genderFilter.test(v.name),
      );

      if (voice) {
        utterance.voice = voice; // Set the voice
      }

      // Play the alert sound after the speech ends
      utterance.onend = () => {
        audioAfter.play();
      };

      window.speechSynthesis.speak(utterance);
    };
  } else {
    console.error("Speech synthesis not supported in this browser.");
  }
};

export const handleSpeakName = (
  name: string,
  position?: number,
  status?: QueueStatus,
) => {
  if (position !== 1 || status !== "IN_PROGRESS") {
    callPatientForAssistant(name);
  } else callPatientForDoctor(name);
};

export const callPatientForAssistant = (name: string) => {
  const textToSpeak =
    " على المريضْ" +
    name.split(" ").join("ْ.") +
    "ْ." +
    " الْحُضُورْ لِلْاِسْتِعْلَامَاتْ ";

  speak(textToSpeak, "ar", "male");
};

export const callPatientForDoctor = (name: string) => {
  const textToSpeak =
    " فَلْيَتَفَضلْ. بالدخولْ المريضْ " + name.split(" ").join("ْ.") + "ْ.";

  speak(textToSpeak, "ar", "male");
};

export const callNextPatient = (name: string) => {
  const textToSpeak = " المريضْ التالى " + name.split(" ").join("ْ.") + "ْ.";

  speak(textToSpeak, "ar", "male");
};

export const handleSpeakTurn = (positionId) => {
  const textToSpeak = `مَرِيضْ رَقمْ ${positionId}`;
  speak(textToSpeak, "ar", "male"); // Speak the position ID with the appropriate language
};
