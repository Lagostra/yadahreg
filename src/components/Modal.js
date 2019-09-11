import React from 'react';

const Modal = ({ active, onClose, children, title }) => (
    <React.Fragment>
        {active && (
            <div className="modal__container">
                <div className="modal__box">
                    <div className="modal__header">
                        <span>{title ? title : ' '}</span>
                        <button
                            onClick={onClose}
                            className="modal__close"
                        >
                            <i className="fas fa-times" />
                        </button>
                    </div>
                    <div className="modal__content-container">
                        <div className="modal__content">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </React.Fragment>
);

export default Modal;
