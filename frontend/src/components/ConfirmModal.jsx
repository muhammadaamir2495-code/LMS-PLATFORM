import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

const ConfirmModal = ({ show, onHide, onConfirm, title, message, type = 'danger' }) => {
  return (
    <Modal show={show} onHide={onHide} centered className="premium-modal">
      <Modal.Body className="p-8 text-center bg-app">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`d-inline-flex align-items-center justify-content-center mb-6 rounded-circle bg-opacity-10`}
          style={{ width: '80px', height: '80px', backgroundColor: type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)' }}
        >
          <i className={`bi ${type === 'danger' ? 'bi-exclamation-triangle text-danger' : 'bi-question-circle text-primary'} fs-1`}></i>
        </motion.div>
        <h4 className="text-white fw-black mb-4">{title}</h4>
        <p className="text-dim mb-10">{message}</p>
        <div className="d-flex gap-3 justify-content-center">
          <button className="btn btn-ghost text-dim fw-bold text-xs tracking-widest px-8" onClick={onHide}>CANCEL</button>
          <button 
            className={`btn ${type === 'danger' ? 'btn-danger' : 'btn-premium'} px-8 py-2.5 text-xs fw-bold tracking-widest`} 
            onClick={() => { onConfirm(); onHide(); }}
          >
            CONFIRM
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmModal;
