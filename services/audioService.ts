
import { GoogleGenAI, Modality } from "@google/genai";

// Helper to decode base64 string to Uint8Array
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to decode raw PCM data to AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

let currentSource: AudioBufferSourceNode | null = null;
let audioCtx: AudioContext | null = null;

export const playOmMantra = async (onEnded: () => void) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Request meditative chant
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ 
        parts: [{ 
          text: "Chant the sacred sound 'Om' with a deep, resonant, and very slow meditative tone. Repeat the chant 'Om' five times with long pauses in between for meditation. Ensure the tone is calm and spiritual." 
        }] 
      }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Charon' }, // Resonant voice
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate) {
      console.error("Gemini TTS Error: No candidates returned. Full response:", response);
      throw new Error("Model failed to generate audio. It might be blocked or unavailable.");
    }

    let base64Audio = '';
    // Iterate through parts to find the audio data
    if (candidate.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          base64Audio = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Audio) {
      console.error("Gemini TTS Error: Candidate received but no inlineData found. Candidate:", candidate);
      throw new Error("No audio data found in the response parts.");
    }

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    const audioBuffer = await decodeAudioData(
      decodeBase64(base64Audio),
      audioCtx,
      24000,
      1
    );

    if (currentSource) {
      currentSource.stop();
    }

    currentSource = audioCtx.createBufferSource();
    currentSource.buffer = audioBuffer;
    currentSource.connect(audioCtx.destination);
    currentSource.onended = () => {
      currentSource = null;
      onEnded();
    };
    currentSource.start();
    
    return true;
  } catch (error) {
    console.error("Error playing Om mantra:", error);
    return false;
  }
};

export const stopMantra = () => {
  if (currentSource) {
    currentSource.stop();
    currentSource = null;
  }
};
