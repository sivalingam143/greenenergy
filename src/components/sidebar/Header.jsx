import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { MdLogout } from "react-icons/md";
import { TbUserSquareRounded } from "react-icons/tb";
import { ActionButton, Buttons } from "../Buttons";
import { RiMenu3Fill } from "react-icons/ri";
import { HiOutlineUser } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Dialog from "../Dialog";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../services/LoginService";
const Header = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const handleClose = () => {
    setShowConfirmDialog(true);
  };
  const handleLogout = (confirm) => {
    setShowConfirmDialog(false);
    if (confirm) {
      dispatch(logoutUser())
        .then(() => {
          console.log("Logged out successfully");
          Navigate("/");
        })
        .catch((error) => {
          console.error("Logout failed:", error);
          alert(error);
        });
      console.log("logout Success");
    }
  };
  const options = [
    { label: "Logout", icon: <MdLogout size={20} />, onClick: handleClose },
  ];
  const handleSideBar = () => {
    document.body.classList.toggle("toggle-sidebar");
  };
  const storedValue = sessionStorage.getItem('username');
  return (
    <>

      <Navbar expand="sm" className="bg-body-tertiary pos-fixed top-navbar">
        <Container fluid className="px-lg-5">
          <Buttons
            classname="icon-only"
            label={
              <>
                <RiMenu3Fill />
              </>
            }
            OnClick={handleSideBar}
          />
        
            <Nav className="ms-auto">
              <div className="profile">
                
               <Buttons
                  classname="icon-only"
                  label={
                    <>
                     <MdLogout size={20} />
                    </>
                  } 
                  OnClick={handleClose}
                />
              </div>
            </Nav>
        </Container>
      </Navbar>
      <>
        <Dialog
          DialogTitle="Are you sure you want to logout?"
          isVisible={showConfirmDialog}
          onConfirm={handleLogout}
          onCancel={() => handleLogout(false)}
        />
      </>

    </>
  );
};

export default Header;
