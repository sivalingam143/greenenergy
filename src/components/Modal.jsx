import React from 'react';
import PageTitle from './PageTitle'; 
import Modal from 'react-bootstrap/Modal';
import { Buttons } from './Buttons';

const CustomModal = ({ show, 
    setShow, 
    pageTitle, 
    showButton, 
    submitButton, 
    label, 
    CancelLabel, 
    BodyComponent, 
    OnClick,
    Size,
    handleClose }) => {
    const handleModalClose = () => {
        setShow(false);
        if (handleClose) {
            handleClose();
        }
    };
    return (
        <div>
            <Modal show={show} onHide={handleModalClose} size={Size} backdrop="static">
                <div className="p-3 border-bottom">
                    <PageTitle PageTitle={pageTitle} showButton={showButton} OnClick={handleModalClose} />
                </div>
                <Modal.Body>
                    {BodyComponent}
                </Modal.Body>
                {submitButton && (
                    <Modal.Footer>
                            <>
                                <Buttons OnClick={handleModalClose} label={CancelLabel} classname="crud-btn" />
                                <Buttons OnClick={OnClick} label={label} classname="crud-btn" />
                            </>
                    </Modal.Footer>
                )}
            </Modal>
        </div>
    );
}

export default CustomModal;
