import React from 'react'
import { Buttons } from './Buttons';
const Dialog = ({ isVisible, onConfirm, onCancel,DialogTitle }) => {
    if (!isVisible) return null;
  return (
    <>
         <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
                <p>{DialogTitle}</p>
                <Buttons OnClick={() => onConfirm(true)} classname="table-btn mx-2" label="Yes"/>
                <Buttons OnClick={() => onCancel(false)} classname="table-btn mx-2" label="No"/>
            </div>
        </div>
    </>
  )
}

export default Dialog