'use client';
import React, { useState, useEffect } from 'react';

export function KeepNotes() {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');

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
      <button className="keep-toggle" onClick={() => setIsOpen(!isOpen)} title="Bloco de Notas">
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
