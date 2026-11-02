import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  baseAlpha: number;
  alpha: number;
  colorType: 'gold' | 'blue' | 'crimson';
}

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isDark = theme === 'dark';

    // Particle count based on screen width
    const particleCount = Math.floor(Math.min(width, 1920) / 18);
    const particles: Particle[] = [];

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120
    };

    // Color maps
    const colorsDark = {
      gold: '245, 158, 11',
      blue: '59, 130, 246',
      crimson: '239, 68, 68'
    };
    const colorsLight = {
      gold: '217, 119, 6',
      blue: '29, 78, 216',
      crimson: '220, 38, 38'
    };
    const activePalette = isDark ? colorsDark : colorsLight;

    for (let i = 0; i < particleCount; i++) {
      const types: ('gold' | 'blue' | 'crimson')[] = ['gold', 'blue', 'blue', 'gold', 'crimson'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        baseAlpha: Math.random() * 0.45 + (isDark ? 0.25 : 0.15),
        alpha: 0.3,
        colorType: chosenType
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connective constellation lines
      const maxDistance = 95;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * (isDark ? 0.09 : 0.05);
            ctx.beginPath();
            ctx.strokeStyle = isDark
              ? `rgba(148, 163, 184, ${lineAlpha})`
              : `rgba(100, 116, 139, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 1.5;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force;
          p.y += Math.sin(angle) * force;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const rgb = activePalette[p.colorType];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${p.baseAlpha})`;
        ctx.fill();

        // Glow ring for gold particles in dark mode
        if (isDark && p.colorType === 'gold' && p.radius > 1.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb}, 0.04)`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: 0.85 }}
    />
  );
};
