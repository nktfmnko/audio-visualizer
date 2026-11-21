function formatTime(seconds) {
    if (!seconds || Number.isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function ProgressBar({ currentTime, duration, onSeek }) {
    return (
        <div className="progress-container">
            <span className="time-label">{formatTime(currentTime)}</span>
            <input
                type="range"
                className="progress-slider"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={(e) => onSeek(Number(e.target.value))}
                disabled={!duration}
            />
            <span className="time-label">{formatTime(duration)}</span>
        </div>
    );
}