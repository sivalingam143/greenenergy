import React from "react";
import { Space, TimePicker } from "antd";
import dayjs from "dayjs";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
const TextInputForm = ({
  textlabel,
  PlaceHolder,
  value,
  name,
  onKeyPress,
  className,
  onChange,
  readOnly,
  disabled = false,
  suffix_icon,
  prefix_icon,
  type,
  checked,
  isCheckbox,
  width,
}) => {
  return (
    <>
      {textlabel && (
        <Form.Label className="px-2 regular">{textlabel}</Form.Label>
      )}
      <div className="input-container">
        {prefix_icon && <span className="prefix-icon">{prefix_icon}</span>}
        {isCheckbox ? (
          <Form.Check
            type="checkbox"
            checked={checked}
            name={name}
            onChange={onChange}
            disabled={disabled}
            label={PlaceHolder}
          />
        ) : (
          <Form.Control
            type={type}
            placeholder={PlaceHolder}
            value={value}
            name={name}
            className={`${className} sea`}
            onChange={onChange}
            onKeyPress={onKeyPress}
            readOnly={readOnly}
            style={{ width: width }}
            disabled={disabled}
          />
        )}
        {suffix_icon && <span className="suffix-icon">{suffix_icon}</span>}
      </div>
    </>
  );
};

const TextArea = ({
  textlabel,
  placeholder = "",
  value,
  name,
  onKeyPress,
  className = "",
  onChange,
  rows = 4,
  disabled,
}) => {
  return (
    <div>
      {textlabel && (
        <Form.Label className="px-2 regular">{textlabel}</Form.Label>
      )}
      <Form.Control
        as="textarea"
        rows={rows}
        placeholder={placeholder}
        className={className}
        name={name}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        disabled={disabled}
      />
    </div>
  );
};

const DropDown = ({
  textlabel,
  placeholder,
  value,
  onChange,
  name,
  options = [],
  disabled = false,
}) => {
  const handleChange = (selectedOption) => {
    onChange({
      target: {
        name,
        value: selectedOption ? selectedOption.value : "",
      },
    });
  };

  return (
    <>
      {textlabel && (
        <Form.Label className="px-2 regular">{textlabel}</Form.Label>
      )}
      <Select
        options={options}
        placeholder={placeholder}
        value={options.find((option) => option.value === value) || null}
        onChange={handleChange}
        isClearable
        isDisabled={disabled}
      />
    </>
  );
};

export default DropDown;

const DropDownUI = ({
  textlabel,
  placeholder,
  value,
  onChange,
  name,
  options = [],
  disabled = false,
  width = "100%",
}) => {
  const handleChange = (selectedOption) => {
    onChange({
      target: {
        name,
        value: selectedOption ? selectedOption.value : "",
      },
    });
  };

  return (
    <div style={{ width }}>
      {textlabel && (
        <Form.Label className="px-2 regular">{textlabel}</Form.Label>
      )}
      <Select
        options={options}
        placeholder={placeholder}
        value={options.find((option) => option.value === value) || null}
        onChange={handleChange}
        isClearable
        isDisabled={disabled}
      />
    </div>
  );
};
const DatePick = ({
  textlabel,
  placeholder,
  value,
  name,
  onKeyPress,
  onChange,
  disabled,
}) => {
  // Validate incoming date
  const isValidDate = (dateString) => {
    if (!dateString || dateString === "0000-00-00") return false;
    const d = new Date(dateString);
    return !isNaN(d.getTime());
  };

  const selectedDate = isValidDate(value) ? new Date(value) : null;

  const handleChange = (date) => {
    if (onChange && date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      onChange(formattedDate);
    } else {
      onChange("");
    }
  };

  return (
    <div>
      {textlabel && (
        <Form.Label className="px-2 regular">{textlabel}</Form.Label>
      )}
      <DatePicker
        className="form-control w-100"
        placeholderText={placeholder}
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="dd/MM/yyyy"
        onKeyDown={onKeyPress}
        name={name}
        disabled={disabled}
        maxDate={new Date()}
      />
    </div>
  );
};

const formatDateDDMMYY = (dateInput) => {
  if (!dateInput) return "";

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return ""; // Invalid date

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  return `${day}-${month}-${year}`;
};
const TimePick = ({ textlabel, value, onChange, disabled }) => {
  const timeValue = value ? dayjs(value, "HH:mm") : null;

  const handleChange = (time, timeString) => {
    if (onChange) {
      onChange(timeString);
    }
  };

  return (
    <Space direction="vertical">
      {textlabel && (
        <Form.Label className="px-2 regular">{textlabel}</Form.Label>
      )}
      <TimePicker
        value={timeValue}
        onChange={handleChange}
        format="HH:mm"
        disabled={disabled}
      />
    </Space>
  );
};
const CheckBox = ({ textlabel, OnChange, boxlabel, checked, disabled }) => {
  return (
    <div>
      <div>
        {textlabel && (
          <Form.Label className="px-2 regular">{textlabel}</Form.Label>
        )}
      </div>
      <div className="check-box">
        <div className="tick-box">
          <TextInputForm
            type="checkbox"
            onChange={OnChange}
            isCheckbox={true}
            checked={checked}
            disabled={disabled}
          />
          <span className="mx-3">{boxlabel}</span>
        </div>
      </div>
    </div>
  );
};
export {
  TextInputForm,
  TextArea,
  DropDown,
  DropDownUI,
  DatePick,
  TimePick,
  CheckBox,
  formatDateDDMMYY,
};
