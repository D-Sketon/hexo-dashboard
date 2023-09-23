import React from 'react';

function Modal({ children }) {
  const backdrop = () => <div className='modal-backdrop in' />;

  const modal = () => {
    const style = { display: 'block' };
    return (
      <div
        className='modal in'
        tabIndex='-1'
        role='dialog'
        aria-hidden='false'
        ref={(modalRef) => modalRef}
        style={style}
      >
        <div className='modal-dialog'>
          <div className='modal-content'>{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {backdrop()}
      {modal()}
    </div>
  );
}

export default Modal;
