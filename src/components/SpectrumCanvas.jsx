import {useEffect, useRef, useState} from 'react';

export function SpectrumCanvas({analyser}) {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('bars');

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !analyser) return;

        const ctx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let animationId;

        function draw() {
            animationId = requestAnimationFrame(draw);
            const {width, height} = canvas;

            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, width, height);

            if (mode === 'bars') {
                analyser.getByteFrequencyData(dataArray);
                const barWidth = (width / bufferLength) * 1.8;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = (dataArray[i] / 255) * height;
                    const hue = 200 + (i / bufferLength) * 120;
                    ctx.fillStyle = `hsl(${hue}, 85%, 60%)`;
                    ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
                    x += barWidth;
                }
            } else {
                analyser.getByteTimeDomainData(dataArray);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#38bdf8';
                ctx.beginPath();

                const sliceWidth = width / (bufferLength - 1);
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArray[i] / 128.0;
                    const y = (v * height) / 2;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                    x += sliceWidth;
                }
                ctx.stroke();
            }
        }

        draw();
        return () => cancelAnimationFrame(animationId);
    }, [analyser, mode]);

    return (
        <div className="panel">
            <div className="panel-header">
                <h3>Анализатор спектра</h3>
                <div className="mode-switch">
                    <button
                        className={mode === 'bars' ? 'active' : ''}
                        onClick={() => setMode('bars')}
                    >
                        Спектр
                    </button>
                    <button
                        className={mode === 'wave' ? 'active' : ''}
                        onClick={() => setMode('wave')}
                    >
                        Волна
                    </button>
                </div>
            </div>
            <canvas ref={canvasRef} width={640} height={220} className="spectrum-canvas"/>
        </div>
    );
}