const PRESETS = {
    Flat: {eq: {bass: 0, mid: 0, treble: 0}, speed: 1.0, preservePitch: true},
    'Bass Boost': {eq: {bass: 10, mid: -2, treble: 2}, speed: 1.0, preservePitch: true},
    'Slowed Vibe': {eq: {bass: 5, mid: -1, treble: -2}, speed: 0.82, preservePitch: false},
    Nightcore: {eq: {bass: 2, mid: 2, treble: 6}, speed: 1.25, preservePitch: false},
};

export function AudioControls({
                                  eq,
                                  onEqChange,
                                  speed,
                                  onSpeedChange,
                                  preservePitch,
                                  onPreservePitchChange,
                              }) {
    function applyPreset(preset) {
        onEqChange(preset.eq);
        onSpeedChange(preset.speed);
        onPreservePitchChange(preset.preservePitch);
    }

    return (
        <div className="panel controls-grid">
            <div>
                <h3>Эквалайзер (дБ)</h3>
                <label className="slider-row">
                    <span>Басы (150 Гц): {eq.bass > 0 ? `+${eq.bass}` : eq.bass} дБ</span>
                    <input
                        type="range"
                        min="-15"
                        max="15"
                        step="1"
                        value={eq.bass}
                        onChange={(e) => onEqChange({...eq, bass: Number(e.target.value)})}
                    />
                </label>

                <label className="slider-row">
                    <span>Середина (1 кГц): {eq.mid > 0 ? `+${eq.mid}` : eq.mid} дБ</span>
                    <input
                        type="range"
                        min="-15"
                        max="15"
                        step="1"
                        value={eq.mid}
                        onChange={(e) => onEqChange({...eq, mid: Number(e.target.value)})}
                    />
                </label>

                <label className="slider-row">
                    <span>Верха (4 кГц): {eq.treble > 0 ? `+${eq.treble}` : eq.treble} дБ</span>
                    <input
                        type="range"
                        min="-15"
                        max="15"
                        step="1"
                        value={eq.treble}
                        onChange={(e) => onEqChange({...eq, treble: Number(e.target.value)})}
                    />
                </label>
            </div>

            <div>
                <h3>Скорость и тональность</h3>
                <label className="slider-row">
                    <span>Скорость: {speed.toFixed(2)}x</span>
                    <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.05"
                        value={speed}
                        onChange={(e) => onSpeedChange(Number(e.target.value))}
                    />
                </label>

                <label className="checkbox-row">
                    <input
                        type="checkbox"
                        checked={preservePitch}
                        onChange={(e) => onPreservePitchChange(e.target.checked)}
                    />
                    Сохранять тональность (выключи для Slowed / Nightcore)
                </label>

                <div className="presets-row">
                    {Object.entries(PRESETS).map(([name, preset]) => (
                        <button key={name} type="button" onClick={() => applyPreset(preset)}>
                            {name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}