import { useEffect, useRef } from 'react';

const GridBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const drawGrid = (offset) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Dark green background
            ctx.fillStyle = '#001a0d';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Grid settings - smaller squares with blur
            const gridSize = 40;
            const lineWidth = 1;

            // Add blur effect
            ctx.filter = 'blur(1px)';

            // Draw vertical lines with bright green
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.4)';
            ctx.lineWidth = lineWidth;

            for (let x = 0; x <= canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }

            // Draw horizontal lines
            for (let y = 0; y <= canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Reset filter for vignette
            ctx.filter = 'none';

            // Subtle vignette effect
            const gradient = ctx.createRadialGradient(
                canvas.width / 2,
                canvas.height / 2,
                0,
                canvas.width / 2,
                canvas.height / 2,
                Math.max(canvas.width, canvas.height) / 2
            );
            gradient.addColorStop(0, 'rgba(0, 26, 13, 0)');
            gradient.addColorStop(1, 'rgba(0, 26, 13, 0.7)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Animated scanline effect
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, offset);
            ctx.lineTo(canvas.width, offset);
            ctx.stroke();
        };

        let offset = 0;
        const animate = () => {
            offset = (offset + 2) % canvas.height;
            drawGrid(offset);
            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        animate();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    );
};

export default GridBackground;
