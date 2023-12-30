import React from "react";
import Modal from "react-bootstrap/Modal"

const ChooseBillingShippingAddress = ({showChooseModal, handleChooseModalClose}) => {

    return (
        <div>
            <Modal show={showChooseModal} onHide={handleChooseModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Billing Address Modal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Your billing address form goes here */}
                    <div>
                        
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {/*
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    */}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ChooseBillingShippingAddress;