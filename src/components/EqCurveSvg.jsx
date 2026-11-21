const WIDTH = 600;
const HEIGHT = 180;
const MIN_FREQ = 20;
const MAX_FREQ = 20000;
const POINTS = 80;

export function EqCurveSvg({engine, isEngineReady}) {
    const freqs = new Float32Array(POINTS);
    for (let i = 0; i < POINTS; i++) {
        const ratio = i / (POINTS - 1);
        freqs[i] = MIN_FREQ * Math.pow(MAX_FREQ / MIN_FREQ, ratio);
    }

    const dbValues = isEngineReady
        ? engine.getFrequencyResponse(freqs)
        : new Float32Array(POINTS);

    const coords = Array.from(dbValues).map((db, i) => {
        const x = (i / (POINTS - 1)) * WIDTH;
        const clampedDb = Math.max(-20, Math.min(20, db));
        const y = HEIGHT / 2 - (clampedDb / 20) * (HEIGHT / 2 - 12);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pathData = `M ${coords.join(' L ')}`;

    return (
        <div className="panel">
            <h3>Кривая эквалайзера АЧХ</h3>
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="eq-svg">
                <line x1="0" y1={HEIGHT / 2} x2={WIDTH} y2={HEIGHT / 2} stroke="#334155" strokeDasharray="4 4"/>
                <path d={pathData} fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <div className="freq-labels">
                <span>20 Гц</span>
                <span>150 Гц (Bass)</span>
                <span>1 кГц (Mid)</span>
                <span>4 кГц (Treble)</span>
                <span>20 кГц</span>
            </div>
        </div>
    );
}