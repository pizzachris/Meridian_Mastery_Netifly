import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { audioService } from '../services/audioService';
import { colors } from '../styles/colors';

const AudioContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
    max-width: 300px;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 8px;
`;

const WaveformContainer = styled.div`
    width: 100%;
    height: 40px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
`;

export const AudioControls: React.FC<{ audioUrl: string }> = ({ audioUrl }) => {
    const waveformRef = useRef<HTMLDivElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 1 | 1.5>(1);

    useEffect(() => {
        if (waveformRef.current) {
            audioService.initWaveform(waveformRef.current);
        }
    }, []);

    const handleRecord = async () => {
        if (isRecording) {
            const recordedBlob = await audioService.stopRecording();
            // Handle recorded audio...
        } else {
            await audioService.startRecording();
        }
        setIsRecording(!isRecording);
    };

    return (
        <AudioContainer>
            <WaveformContainer ref={waveformRef} />
            <ButtonGroup>
                <button onClick={() => audioService.playPronunciation(audioUrl)}>
                    🔊 Native
                </button>
                <button onClick={handleRecord}>
                    {isRecording ? '⏹️ Stop' : '⏺️ Record'}
                </button>
                <select 
                    value={playbackSpeed}
                    onChange={(e) => {
                        const speed = Number(e.target.value) as 0.5 | 1 | 1.5;
                        setPlaybackSpeed(speed);
                        audioService.setPlaybackSpeed(speed);
                    }}
                >
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={1.5}>1.5x</option>
                </select>
            </ButtonGroup>
        </AudioContainer>
    );
};
