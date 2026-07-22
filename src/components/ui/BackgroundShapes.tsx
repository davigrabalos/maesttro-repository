"use client";

import React, { useEffect, useState } from 'react';

type ShapeConfig = {
  id: number;
  type: 'circle' | 'pill' | 'rect' | 'diamond' | 'blob';
  colorClass: string;
  size: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
};

export function BackgroundShapes() {
  const [shapes, setShapes] = useState<ShapeConfig[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Generate shapes only on the client to prevent SSR hydration mismatch
    const SHAPE_COUNT = 35; // Mais formas já que são menores
    const types: Array<'circle' | 'pill' | 'rect' | 'diamond' | 'blob'> = ['circle', 'pill', 'rect', 'diamond', 'blob'];
    const colors = ['bg-shape-primary', 'bg-shape-secondary', 'bg-shape-surface'];
    
    const newShapes: ShapeConfig[] = Array.from({ length: SHAPE_COUNT }).map((_, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const colorClass = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.floor(Math.random() * 50) + 15; // 15px a 65px (Bem menores)
      const left = Math.floor(Math.random() * 100); // Distribuição horizontal
      const duration = Math.floor(Math.random() * 20) + 15; // 15s a 35s para subirem mais ativas
      const delay = Math.floor(Math.random() * -30); // Delay negativo para já começarem na tela
      const opacity = Math.random() * 0.15 + 0.1; // 0.1 a 0.25 sutil mas visível

      return {
        id: i,
        type,
        colorClass,
        size,
        left,
        duration,
        delay,
        opacity,
      };
    });

    setShapes(newShapes);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="background-shapes-container" style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={`shape-element shape-${shape.type} ${shape.colorClass}`}
          style={{
            width: `${shape.size}px`,
            height: shape.type === 'pill' ? `${shape.size / 2}px` : `${shape.size}px`,
            top: 0, // A animação controlará o eixo Y
            left: `${shape.left}%`,
            opacity: shape.opacity,
            animationDuration: `${shape.duration}s`,
            animationDelay: `${shape.delay}s`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}
