import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CommandPalette = ({ show, onClose, onAction }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const commands = [
    { id: 'nav-dashboard', title: 'Go to Dashboard', section: 'Navigation', icon: 'bi-grid', action: () => navigate('/admin-dashboard') },
    { id: 'nav-courses', title: 'Manage Courses', section: 'Navigation', icon: 'bi-book', action: () => navigate('/courses') },
    { id: 'act-user', title: 'Create New User', section: 'Actions', icon: 'bi-person-plus', action: () => onAction('create-user') },
    { id: 'act-course', title: 'Create New Course', section: 'Actions', icon: 'bi-plus-circle', action: () => onAction('create-course') },
    { id: 'act-stats', title: 'Refresh Statistics', section: 'Actions', icon: 'bi-arrow-clockwise', action: () => onAction('refresh') },
    { id: 'theme-toggle', title: 'Toggle Light/Dark Mode', section: 'System', icon: 'bi-moon', action: () => onAction('toggle-theme') },
  ];

  const filteredCommands = query === '' 
    ? commands 
    : commands.filter(c => c.title.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (show) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [show]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!show) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [show, filteredCommands, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="command-palette-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="command-palette"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="command-input-wrapper">
              <i className="bi bi-search text-gray-400"></i>
              <input 
                ref={inputRef}
                type="text" 
                className="command-input" 
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="command-shortcut">ESC</div>
            </div>
            
            <div className="command-results">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((c, idx) => (
                  <div 
                    key={c.id} 
                    className={`command-item ${idx === selectedIndex ? 'selected' : ''}`}
                    onClick={() => { c.action(); onClose(); }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="command-item-icon">
                      <i className={`bi ${c.icon}`}></i>
                    </div>
                    <div>
                      <div className="fw-semibold text-small">{c.title}</div>
                      <div className="text-xs opacity-60">{c.section}</div>
                    </div>
                    {idx === selectedIndex && <div className="command-shortcut">ENTER</div>}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted text-xs">
                  No commands found for "{query}"
                </div>
              )}
            </div>
            
            <div className="p-3 bg-gray-50 border-top d-flex gap-4 justify-content-center">
              <div className="text-xs text-gray-400"><kbd className="bg-white border rounded px-1 me-1">↑↓</kbd> Navigate</div>
              <div className="text-xs text-gray-400"><kbd className="bg-white border rounded px-1 me-1">Enter</kbd> Select</div>
              <div className="text-xs text-gray-400"><kbd className="bg-white border rounded px-1 me-1">Esc</kbd> Close</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
