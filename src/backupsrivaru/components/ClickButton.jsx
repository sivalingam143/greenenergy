import React from 'react';
import { Button } from 'react-bootstrap';

// A reusable Button component with optional styling class and label
const CustomButton = React.memo(({ label, onClick, className = '', ...props }) => {
  return (
    <Button className={className} onClick={onClick} {...props}>
      {label}
    </Button>
  );
});

// Specific buttons based on CustomButton with preset classes
const ClickButton = React.memo(({ label, onClick }) => (
  <CustomButton className="crud-btn" label={label} onClick={onClick} />
));

const InstantCreate = React.memo(({ label, onClick }) => (
  <CustomButton className="crud-btn " label={label} onClick={onClick} />
));

const Buttons = React.memo(({ label, onClick }) => (
  <div className="add-new">
    <CustomButton label={label} onClick={onClick} className="pagination-btn"/>
  </div>
));

const Delete = React.memo(({ label, onClick }) => (
  <CustomButton className="delete" label={label} onClick={onClick} />
));

export { ClickButton, InstantCreate, Buttons, Delete };
