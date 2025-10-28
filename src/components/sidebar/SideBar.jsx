import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { RxDash } from "react-icons/rx";
import { Collapse } from "react-bootstrap";
import Logo from "../../assets/images/srivarulogo.png";
import "./SideBar.css";
import MenuItems from "./MenuItems";

const SideBar = () => {
  const [open, setOpen] = useState(null);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const role = user?.role_name?.trim() || "";

  // Role-based filter logic
  // Role-based filter logic
  let filteredMenuItems = MenuItems;

  if (role === "Engineer") {
    filteredMenuItems = MenuItems.map((item) => {
      // if (item.text === "Master") {
      //   // Only allow 'Parts' submenu
      //   return {
      //     ...item,
      //     submenu: item.submenu?.filter((sub) => sub.text === "Parts"),
      //   };
      // }
      // Hide specific items
      if (
        [
          "CSR",
          "CSR Mapping",
          "User",
          "Company",
          "Daily Generations",
          "Reports",
          "Master",
        ].includes(item.text)
      ) {
        return null; // Remove this menu item entirely
      }

      return item;
    }).filter(Boolean); // Remove null entries
  }

  const toggleSubMenu = (index) => {
    setOpen(open === index ? null : index);
  };
  const handleSideBar = () => {
    const isMobileOrTablet = window.innerWidth <= 991;

    if (isMobileOrTablet) {
      document.body.classList.toggle("toggle-sidebar");
    }
  };
  return (
    <aside id="side-bar" className="side-bar">
      <div>
        <div className="side-bar-header">
          <img src={Logo} alt="Logo" className="logo" />
        </div>
      </div>

      <div className="list-group">
        <ul>
          {filteredMenuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className="nav-link"
                onClick={(e) => {
                  if (item.submenu) {
                    e.preventDefault();
                    toggleSubMenu(index);
                  }
                  handleSideBar();
                }}
              >
                <span className="list-icon">{item.icon}</span>
                <span className="list-text">{item.text}</span>
                {item.submenu && (
                  <span className="arrow-icon">
                    {open === index ? (
                      <MdKeyboardArrowDown />
                    ) : (
                      <MdKeyboardArrowRight />
                    )}
                  </span>
                )}
              </NavLink>
              {item.submenu && (
                <Collapse in={open === index}>
                  <ul className="submenu-list">
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <NavLink to={subItem.path} className="nav-link">
                          <span className="list-icon">
                            <RxDash />
                          </span>
                          <span className="list-text">{subItem.text}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </Collapse>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SideBar;
