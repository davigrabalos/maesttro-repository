'use client';
import React, { useState, useEffect } from 'react';

interface KeepNotesProps {
  forceOpen?: boolean;
  onForceClose?: () => void;
}

export function KeepNotes({ forceOpen = false, onForceClose }: KeepNotesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');

  // Sync with external forceOpen state
  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (!next && onForceClose) onForceClose();
  };

  useEffect(() => {
    const saved = localStorage.getItem('admin_keep_notes');
    if (saved) setNote(saved);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    localStorage.setItem('admin_keep_notes', e.target.value);
  };

  return (
    <div className={`keep-notes-widget ${isOpen ? 'open' : ''}`}>
      <button className="keep-toggle" onClick={handleToggle} title="Bloco de Notas">
        <span className="material-symbols-outlined">{isOpen ? 'close' : 'edit_note'}</span>
      </button>
      {isOpen && (
        <div className="keep-content">
          <div className="keep-header">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>sticky_note_2</span>
            Anotações
          </div>
          <textarea
            value={note}
            onChange={handleChange}
            placeholder="Digite aqui... Salvo automaticamente no seu navegador."
            className="keep-textarea"
          />
        </div>
      )}
    </div>
  );
}
