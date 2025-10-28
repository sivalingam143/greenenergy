import React from "react";

import Dropdown from "react-bootstrap/Dropdown";
const Buttons = ({ label, OnClick, classname, status, disabled = false }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "Invited":
        return "invited";
      case "Inactive":
        return "inactive";
      case "Active":
        return "active";
      default:
        return "";
    }
  };

  return (
    <div>
      <button
        onClick={OnClick}
        disabled={disabled}
        className={`${classname} ${getStatusClass(status)}`}
      >
        {label}
      </button>
    </div>
  );
};

const ActionButton = ({ options, label, colorClass = "btn-primary" }) => {
  return (
    <div className="action-button"> 
      <Dropdown className="menu-dropdown">
        <Dropdown.Toggle className={`btn menu-dropdown ${colorClass}`}>
          {label}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {options.map((option, index) => (
            <Dropdown.Item key={index} onClick={option.onClick}>
              {option.icon && <span className="mx-3">{option.icon}</span>}
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div >
  );
};

export { Buttons, ActionButton };
