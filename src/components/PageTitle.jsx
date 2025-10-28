import React from 'react';
import { Buttons } from './Buttons';
import { FaTimes } from "react-icons/fa";

const PageTitle = ({ PageTitle, showButton = true ,OnClick}) => {
  return (
    <>
      <div className='d-flex justify-content-between align-items-center'>
        <div>
          <h5 className='regular m-0'>{PageTitle}</h5>
        </div>
        {/* Conditionally render the button */}
        {showButton && (
          <div>
            <Buttons classname='icon-only' label={<FaTimes size={20} />} OnClick={OnClick} />
          </div>
        )}
      </div>
    </>
  );
}

export default PageTitle;
