import React, { useEffect, useRef } from 'react';

const DottedSurface = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const points: { x: number, y: number, z: number, baseX: number, baseZ: number }[] = [];
        const spacing = 35; // Fine grid resolution
        const gridSize = 90; // Large enough to cover viewport across 3D perspective
        const perspective = 500;

        // Generate grid points centered on (0,0)
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const x = (j - gridSize / 2) * spacing;
                const z = (i - gridSize / 2) * spacing;
                points.push({ x, y: 0, z, baseX: x, baseZ: z });
            }
        }

        let time = 0;
        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2 + 150; // Offset Y slightly lower to act as grounded surface

            const tilt = Math.PI / 3.5; // ~50 degrees downward tilt
            const sinTilt = Math.sin(tilt);
            const cosTilt = Math.cos(tilt);

            for (let i = 0; i < points.length; i++) {
                const p = points[i];

                // Simulated distance for organic wave effect
                const dist = Math.sqrt(p.baseX * p.baseX + p.baseZ * p.baseZ);

                // Flowing multi-directional organic wave formula
                const wave1 = Math.sin((p.baseX * 0.008) + time * 1.2) * 35;
                const wave2 = Math.cos((p.baseZ * 0.012) - time * 0.9) * 45;
                const wave3 = Math.sin((dist * 0.015) - time * 2.5) * 15;

                p.y = wave1 + wave2 + wave3;

                // Shift Z to position grid into distance
                const zPos = p.z + 900;

                // Only project items in front of the "camera"
                if (zPos > 0) {
                    const scale = perspective / (perspective + zPos);

                    const px = cx + (p.x * scale);
                    // Apply our tilt mathematically to the Y projection
                    const py = cy + ((p.y * cosTilt - p.z * sinTilt) * scale) + 250;

                    // View frustum culling to optimize drawing performance
                    if (px > -50 && px < width + 50 && py > -50 && py < height + 50) {
                        const dotSize = Math.max(0.6, scale * 3.5);
                        // Fade far-away dots and edge dots seamlessly
                        const opacity = Math.max(0, Math.min(1, scale * 2 - 0.2));

                        ctx.beginPath();
                        ctx.arc(px, py, dotSize, 0, Math.PI * 2);
                        // "#C5A059" is the luxury golden branding color of REclose
                        ctx.fillStyle = `rgba(197, 160, 89, ${opacity * 0.5})`;
                        ctx.fill();
                    }
                }
            }

            // Fast, smooth water flow
            time += 0.015;
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80 flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full filter blur-[0.4px]" />
            {/* Deep elegant fade from middle to edge so the grid smoothly blends into the white canvas */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#ffffff_100%)] pointer-events-none"></div>
        </div>
    );
};

export default DottedSurface;
