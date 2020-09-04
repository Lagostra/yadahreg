import React from 'react';

const Modal = ({ active, onClose, children, title, headerStyle, containerStyle, contentStyle }) => (
  <React.Fragment>
    {active && (
      <div
        className="modal__container"
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            onClose();
          }
        }}
      >
        <div className="modal__box">
          <div className="modal__header" style={headerStyle}>
            <span>{title ? title : ' '}</span>
            <button onClick={onClose} className="modal__close">
              <i className="fas fa-times" />
            </button>
          </div>
          <div className="modal__content-container" style={containerStyle}>
            <div className="modal__content" style={contentStyle}>
              {children}
            </div>
          </div>
        </div>
      </div>
    )}
  </React.Fragment>
);

export default Modal;
