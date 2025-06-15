import WaveSurfer from 'wavesurfer.js';

class AudioService {
    private audio: HTMLAudioElement | null = null;
    private audioCache: Map<string, HTMLAudioElement> = new Map();
    private mediaRecorder: MediaRecorder | null = null;
    private waveform: WaveSurfer | null = null;
    private recordedChunks: Blob[] = [];

    async preloadAudio(url: string): Promise<HTMLAudioElement> {
        if (this.audioCache.has(url)) {
            return this.audioCache.get(url)!;
        }

        const audio = new Audio(url);
        await audio.load();
        this.audioCache.set(url, audio);
        return audio;
    }

    async playPronunciation(url: string): Promise<void> {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }

        const audioElement = await this.preloadAudio(url);
        this.audio = audioElement;
        return audioElement.play();
    }

    stopPlayback() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }

    async startRecording(): Promise<void> {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        
        this.mediaRecorder.ondataavailable = (event) => {
            this.recordedChunks.push(event.data);
        };

        this.mediaRecorder.start();
    }

    async stopRecording(): Promise<Blob> {
        return new Promise((resolve) => {
            if (!this.mediaRecorder) return;
            
            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
                this.recordedChunks = [];
                resolve(blob);
            };

            this.mediaRecorder.stop();
        });
    }

    initWaveform(container: HTMLElement) {
        this.waveform = WaveSurfer.create({
            container,
            waveColor: '#E6B95C',
            progressColor: '#4A0404',
            height: 40,
            cursorWidth: 1
        });
    }

    setPlaybackSpeed(speed: 0.5 | 1 | 1.5) {
        if (this.audio) {
            this.audio.playbackRate = speed;
        }
    }
}

export const audioService = new AudioService();
