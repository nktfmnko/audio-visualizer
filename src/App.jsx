import {useEffect, useRef, useState} from 'react';
import {Play, Pause} from 'lucide-react';
import {AudioEngine} from './audio/AudioEngine';
import {SearchPanel} from './components/SearchPanel';
import {AudioControls} from './components/AudioControls';
import {SpectrumCanvas} from './components/SpectrumCanvas';
import {EqCurveSvg} from './components/EqCurveSvg';
import {ProgressBar} from './components/ProgressBar';

export default function App() {
    const audioRef = useRef(null);
    const [engine] = useState(() => new AudioEngine());
    const [analyser, setAnalyser] = useState(null);

    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isEngineReady, setIsEngineReady] = useState(false);

    const [eq, setEq] = useState({bass: 0, mid: 0, treble: 0});
    const [speed, setSpeed] = useState(1.0);
    const [preservePitch, setPreservePitch] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.playbackRate = speed;
        audio.preservesPitch = preservePitch;
    }, [speed, preservePitch, currentTrack]);

    function initAndPlay() {
        const audio = audioRef.current;
        if (!audio) return;

        engine.init(audio);
        engine.setEq(eq);
        setAnalyser(engine.analyser);
        setIsEngineReady(true);

        audio.play();
        setIsPlaying(true);
    }

    function togglePlay() {
        const audio = audioRef.current;
        if (!audio || !currentTrack) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            initAndPlay();
        }
    }

    function handleSeek(newTime) {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    }

    function handleSelectTrack(track) {
        setCurrentTrack(track);
        setCurrentTime(0);
        setDuration(0);
        setTimeout(() => initAndPlay(), 50);
    }

    function handleEqChange(newEq) {
        setEq(newEq);
        if (isEngineReady) {
            engine.setEq(newEq);
        }
    }

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Audio Visualizer & EQ Studio</h1>
                {currentTrack && (
                    <div className="player-bar panel">
                        <div className="now-playing">
                            <button onClick={togglePlay} className="play-btn">
                                {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
                                {isPlaying ? 'Пауза' : 'Играть'}
                            </button>
                            <span>
                                <strong>{currentTrack.title}</strong> — {currentTrack.artist}
                            </span>
                        </div>
                        <ProgressBar
                            currentTime={currentTime}
                            duration={duration}
                            onSeek={handleSeek}
                        />
                    </div>
                )}
            </header>

            <audio
                ref={audioRef}
                crossOrigin="anonymous"
                src={currentTrack?.previewUrl || ''}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={() => setIsPlaying(false)}
            />

            <main className="main-grid">
                <SearchPanel
                    onSelectTrack={handleSelectTrack}
                    currentTrackId={currentTrack?.id}
                />

                <div className="right-column">
                    <SpectrumCanvas analyser={analyser}/>
                    <EqCurveSvg engine={engine} isEngineReady={isEngineReady}/>
                    <AudioControls
                        eq={eq}
                        onEqChange={handleEqChange}
                        speed={speed}
                        onSpeedChange={setSpeed}
                        preservePitch={preservePitch}
                        onPreservePitchChange={setPreservePitch}
                    />
                </div>
            </main>
        </div>
    );
}