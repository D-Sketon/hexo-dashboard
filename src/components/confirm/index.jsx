import React, { useRef, useEffect } from 'react';
import Modal from '../modal';

function Confirm({
  message,
  description,
  confirmLabel = 'OK',
  abortLabel = 'Cancel',
  abort = () => {},
  confirm = () => {},
}) {
  useEffect(() => {
    confirmButtonRef.current.focus();
  }, []);

  const modalBody = description ? (
    <div className='modal-body'>{description}</div>
  ) : null;

  const confirmButtonRef = useRef(null);

  return (
    <Modal>
      <div className='modal-header'>
        <h4 className='modal-title'>{message}</h4>
      </div>
      {modalBody}
      <div className='modal-footer'>
        <div className='text-right'>
          <button
            role='abort'
            type='button'
            className='btn btn-default'
            onClick={abort}
          >
            {abortLabel}
          </button>
          {' '}
          <button
            role='confirm'
            type='button'
            className='btn btn-primary'
            ref={confirmButtonRef}
            onClick={confirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default Confirm;
