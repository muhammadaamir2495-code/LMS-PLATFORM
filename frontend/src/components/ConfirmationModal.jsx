import React, { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';

const ConfirmationModal = ({ show, onHide, onConfirm, title, message, confirmText = "DELETE", loading = false }) => {
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = (e) => {
    e.preventDefault();
    if (inputValue === confirmText) {
      onConfirm();
      setInputValue('');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0 px-6 pt-6">
        <Modal.Title className="fw-bold text-danger d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-triangle"></i> {title}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleConfirm}>
        <Modal.Body className="px-6 py-4">
          <p className="text-muted small mb-6">{message}</p>
          <Form.Group className="mb-0">
            <Form.Label className="text-xs fw-bold text-uppercase text-muted mb-2">
              Type <span className="text-danger">"{confirmText}"</span> to confirm
            </Form.Label>
            <Form.Control 
              className="form-control"
              type="text" 
              placeholder={confirmText}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 px-6 pb-6 pt-2">
          <button type="button" className="btn btn-ghost" onClick={onHide}>Cancel</button>
          <button 
            type="submit" 
            className="btn btn-primary bg-danger border-danger px-8" 
            disabled={inputValue !== confirmText || loading}
          >
            {loading ? 'Processing...' : 'Confirm Action'}
          </button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ConfirmationModal;
