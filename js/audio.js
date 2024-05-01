import Config from "./config.js";

export const audioContext = new AudioContext();
export const analyser = audioContext.createAnalyser();
analyser.fftSize = Config.fftSize;
let dataArray = new Uint8Array(analyser.frequencyBinCount);

export function setFftSize(size) {
  analyser.fftSize = size;
  dataArray = new Uint8Array(analyser.frequencyBinCount);
}

export function getSpectrum() {
  analyser.getByteFrequencyData(dataArray);
  return dataArray;
}

export function init(connectToSoundOut = false) {
  getStreamFromOtherTab()
    .then((stream) => {
      audioContext.createMediaStreamSource(stream).connect(analyser);
      if (connectToSoundOut) {
        analyser.connect(audioContext.destination);
      }
    })
    .catch((err) => {
      alert(err);
      console.log(err);
    });
}

export function getStreamFromOtherTab() {
  return navigator.mediaDevices.getDisplayMedia({
    video: {
      displaySurface: "browser",
    },
    audio: {
      suppressLocalAudioPlayback: false,
    },
    preferCurrentTab: false,
    selfBrowserSurface: "exclude",
    systemAudio: "include",
    surfaceSwitching: "include",
    monitorTypeSurfaces: "include",
  });
}
