'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function GlobalKeepNotes() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');
  
  // Position state (null means default CSS bottom-right)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 320, height: 260 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({ startX: 0, startY: 0, initX: 0, initY: 0 });

  useEffect(() => {
    setMounted(true);
    // Load saved notes content
    const savedNote = localStorage.getItem('global_keep_notes');
    if (savedNote) setNote(savedNote);

    // Load saved position
    const savedPos = localStorage.getItem('global_keep_pos');
    if (savedPos) {
      try {
        setPosition(JSON.parse(savedPos));
      } catch (e) {}
    }

    // Load saved size
    const savedSize = localStorage.getItem('global_keep_size');
    if (savedSize) {
      try {
        setSize(JSON.parse(savedSize));
      } catch (e) {}
    }

    // Load saved open state
    const savedOpen = localStorage.getItem('global_keep_open');
    if (savedOpen) {
      setIsOpen(savedOpen === 'true');
    }

    // Listen for custom event from sidebar or shortcuts
    const handleCustomToggle = () => {
      setIsOpen(prev => {
        const next = !prev;
        localStorage.setItem('global_keep_open', String(next));
        return next;
      });
    };
    window.addEventListener('toggle_global_keep_notes', handleCustomToggle);
    return () => window.removeEventListener('toggle_global_keep_notes', handleCustomToggle);
  }, []);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    localStorage.setItem('global_keep_notes', e.target.value);
  };

  const toggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);
    localStorage.setItem('global_keep_open', String(next));
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    const currentX = position ? position.x : window.innerWidth - (isOpen ? size.width : 56) - 24;
    const currentY = position ? position.y : window.innerHeight - (isOpen ? size.height : 56) - 24;
    
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: currentX,
      initY: currentY
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      const newX = Math.max(10, Math.min(window.innerWidth - 60, dragStartRef.current.initX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 60, dragStartRef.current.initY + dy));
      
      const newPos = { x: newX, y: newY };
      setPosition(newPos);
      localStorage.setItem('global_keep_pos', JSON.stringify(newPos));
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const resetPosition = () => {
    setPosition(null);
    localStorage.removeItem('global_keep_pos');
  };

  const pathname = usePathname();

  if (!mounted) return null;
  if (!pathname.startsWith('/admin')) return null;

  const stylePosition: React.CSSProperties = position
    ? { left: `${position.x}px`, top: `${position.y}px`, right: 'auto', bottom: 'auto' }
    : { right: '24px', bottom: '24px' };

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9999,
        userSelect: isDragging ? 'none' : 'auto',
        ...stylePosition,
      }}
    >
      {!isOpen ? (
        /* Minimized Draggable Bubble */
        <button
          onMouseDown={handleMouseDown}
          onClick={toggleOpen}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: 'var(--md-primary)',
            color: '#FFFFFF',
            border: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            cursor: isDragging ? 'grabbing' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s ease',
          }}
          title="Abrir Anotações (Arraste para mover)"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>edit_note</span>
        </button>
      ) : (
        /* Expanded Draggable & Resizable Window */
        <div
          style={{
            width: `${size.width}px`,
            height: `${size.height}px`,
            backgroundColor: 'var(--md-surface)',
            border: '1px solid var(--md-border)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            resize: 'both',
          }}
        >
          {/* Header Draggable */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              backgroundColor: 'var(--md-primary)',
              color: '#FFFFFF',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>open_with</span>
              <span>Anotações</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={resetPosition}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', opacity: 0.8, cursor: 'pointer', display: 'flex' }}
                title="Restaurar posição no canto"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>restart_alt</span>
              </button>
              <button
                onClick={toggleOpen}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', opacity: 0.9, cursor: 'pointer', display: 'flex' }}
                title="Minimizar"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
              </button>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            value={note}
            onChange={handleNoteChange}
            placeholder="Digite suas anotações... Salvo automaticamente."
            style={{
              flex: 1,
              width: '100%',
              padding: '12px',
              border: 'none',
              outline: 'none',
              resize: 'none',
              backgroundColor: 'var(--md-surface)',
              color: 'var(--md-on-surface)',
              fontSize: '13px',
              fontFamily: 'inherit',
              lineHeight: 1.5,
            }}
          />
        </div>
      )}
    </div>
  );
}
