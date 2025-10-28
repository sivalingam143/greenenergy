import React from 'react'
import { MdArrowBack } from "react-icons/md";
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { Buttons, ClickButton } from './ClickButton';
const PageNav = ({ pagetitle }) => {
  const navigate = useNavigate();
  return (
    <div className='page-nav d-flex align-items-center'>
      <div>
        <Buttons className='' onClick={() => navigate(-1)} label={<MdArrowBack />}></Buttons>
      </div>
      <div className='nav-list'>{pagetitle}</div>
    </div>
  )
}

export default PageNav