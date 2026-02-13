
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { decodeBase64, encodeBase64, decodeAudioData } from "./gemini-utils";

export async function connectMagmaLive(callbacks: {
  onAudioData: (buffer: AudioBuffer) => void;
  onInterrupted: () => void;
  onLog: (msg: string) => void;
}) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const inputAudioContext = new AudioContext({ sampleRate: 16000 });
  const outputAudioContext = new AudioContext({ sampleRate: 24000 });
  const sources = new Set<AudioBufferSourceNode>();
  let nextStartTime = 0;

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks: {
      onopen: () => {
        callbacks.onLog("BRIDGE: SECURE LINK ESTABLISHED.");
        const source = inputAudioContext.createMediaStreamSource(stream);
        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
          const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
          const int16 = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
          
          sessionPromise.then((session) => {
            session.sendRealtimeInput({ 
              media: { 
                data: encodeBase64(new Uint8Array(int16.buffer)), 
                mimeType: 'audio/pcm;rate=16000' 
              } 
            });
          });
        };
        source.connect(scriptProcessor);
        scriptProcessor.connect(inputAudioContext.destination);
      },
      onmessage: async (message: LiveServerMessage) => {
        const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (audioBase64) {
          const buffer = await decodeAudioData(decodeBase64(audioBase64), outputAudioContext, 24000, 1);
          callbacks.onAudioData(buffer);
          
          nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
          const source = outputAudioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(outputAudioContext.destination);
          source.start(nextStartTime);
          nextStartTime += buffer.duration;
          sources.add(source);
          source.onended = () => sources.delete(source);
        }
        if (message.serverContent?.interrupted) {
          sources.forEach(s => s.stop());
          sources.clear();
          nextStartTime = 0;
          callbacks.onInterrupted();
        }
      },
      onclose: () => callbacks.onLog("BRIDGE: LINK TERMINATED."),
      onerror: (e: any) => callbacks.onLog(`BRIDGE ERROR: ${e.message}`)
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
      systemInstruction: `You are the Magma Ape. A gravelly-voiced survivor in Section 9. Tone: Cynical, gritty, urban noir. Use comic-book sound effects. Speak about DNA integrity and the wasteland ruins.`
    }
  });

  return {
    close: () => {
      stream.getTracks().forEach(t => t.stop());
      inputAudioContext.close();
      outputAudioContext.close();
      sessionPromise.then(s => s.close());
    }
  };
}
