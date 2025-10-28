import React from 'react'
import { FaAngleRight, } from "react-icons/fa";
const MobileView = ({ sno, FactoryName, Place }) => {
    return (
        <div className='d-lg-none d-md-block d-xs-block'>
            <div className='mobile-view'>
                <div>{sno}</div>
                <div>
                    <div>{FactoryName}</div>
                    <div>{Place}</div>
                </div>
                <div className='action-button'><FaAngleRight /></div>
            </div>
        </div>
    )
}

export default MobileView