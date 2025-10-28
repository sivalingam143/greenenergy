import React, { useState, useEffect } from "react";
import { Form, Modal } from "react-bootstrap";
import Select from "react-select";
import { InstantCreate, ClickButton } from "./ClickButton";
import { BiPlus } from "react-icons/bi";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

// Base input component used by TextInputForm and TextForm
const BaseInput = ({
  name,
  type,
  suffix_icon,
  prefix_icon,
  labelname,
  value,
  onChange,
  readOnly,
  placeholder,
  onKeyDown,
  autoFocus,
  disabled,
  onKeyPress,
  inputClassName = "form-cntrl",
}) => (
  <>
    {labelname && (
      <div className="pb-2">
        <label>{labelname}</label>
      </div>
    )}
    <div className="form-icon">
      <Form.Group>
        {prefix_icon && <span className="prefix-icon">{prefix_icon}</span>}
        <input
          type={type}
          name={name}
          className={`form-control ${inputClassName} w-100 ${
            prefix_icon && suffix_icon
              ? "form-control-padboth"
              : prefix_icon
              ? "form-control-padleft"
              : suffix_icon
              ? "form-control-padright"
              : ""
          }`}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          disabled={disabled}
          onKeyPress={onKeyPress}
          readOnly={readOnly}
        />
        {suffix_icon && <span className="suffix-icon">{suffix_icon}</span>}
      </Form.Group>
    </div>
  </>
);

const TextInputForm = (props) => (
  <BaseInput {...props} inputClassName="form-cntrl" />
);

const TextForm = (props) => (
  <BaseInput {...props} inputClassName="form-cntrlogin" />
);

const DropDown = ({
  placeholder,
  optionlist,
  labelname,
  modeltitle = "create",
  value,
  onChange,
  name,
  onClick,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // Handle change - Single select assumed
  const handleChange = (selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : null;
    if (selectedValue !== value) {
      onChange({ ...value, [name]: selectedValue });
    }
  };

  const selectedOption = optionlist.find((opt) => opt.value === value) || null;

  return (
    <>
      <div className="pb-2 px-3">{labelname && <label>{labelname}</label>}</div>
      <div className="w-100 d-flex">
        <Select
          placeholder={placeholder}
          options={optionlist}
          value={selectedOption}
          isMulti={false}
          className="w-100"
          onChange={handleChange}
          onClick={onClick}
        />
        <InstantCreate
          label={<BiPlus />}
          className="instant-add"
          onClick={handleShowModal}
        />
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header>
            <Modal.Title>
              {modeltitle} {labelname || "Model"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TextInputForm placeholder={placeholder} labelname={labelname} />
          </Modal.Body>
          <Modal.Footer>
            <ClickButton label="Cancel" onClick={handleCloseModal}>
              Close
            </ClickButton>
            <ClickButton label="Submit" onClick={handleCloseModal}>
              Save Changes
            </ClickButton>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

const DropDownUI = ({
  optionlist = [],
  className,
  name,
  labelname,
  placeholder,
  value,
  onChange,
  onKeyDown,
  autoFocus,
  disabled,
  isMulti = false,
}) => {
  // Handle change for single or multi selects
  const handleChange = (selectedOption) => {
    if (isMulti) {
      // For multi-select, selectedOption is an array
      const selectedValues = selectedOption
        ? selectedOption.map((opt) => opt.value)
        : [];
      onChange({ ...value, [name]: selectedValues });
    } else {
      const selectedValue = selectedOption ? selectedOption.value : null;
      onChange({ ...value, [name]: selectedValue });
    }
  };

  // Find selectedOption(s) based on value(s)
  const selectedOption = isMulti
    ? optionlist.filter((opt) =>
        value ? value[name]?.includes(opt.value) : false
      )
    : optionlist.find((opt) => opt.value === (value ? value[name] : null)) ||
      null;

  return (
    <>
      {labelname && (
        <div className="pb-2">
          <label>{labelname}</label>
        </div>
      )}
      <div className="w-100 d-flex">
        <Select
          placeholder={placeholder}
          options={optionlist}
          value={selectedOption}
          isMulti={isMulti}
          className={`w-100 ${className || ""}`}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          disabled={disabled}
        />
      </div>
    </>
  );
};

const Calender = ({ setLabel, selectedDate, calenderlabel }) => {
  const parseDate = (dateStr) => {
    if (!dateStr || dateStr === "0000-00-00") {
      return null;
    }
    return new Date(dateStr);
  };

  const [startDate, setStartDate] = useState(parseDate(selectedDate));

  useEffect(() => {
    setStartDate(parseDate(selectedDate));
  }, [selectedDate]);

  return (
    <>
      <div className="pb-2 px-3">
        <label>{calenderlabel}</label>
      </div>
      <DatePicker
        selected={startDate}
        onChange={(date) => {
          setStartDate(date);
          setLabel(date);
        }}
        dateFormat="dd-MM-yyyy"
        className="w-100 form-cntrl form-control"
        placeholderText="Select Date"
      />
    </>
  );
};

const Time = ({ labelname }) => {
  const [time, setTime] = useState("00:00");
  return (
    <div>
      <div className="pb-2 px-3">{labelname && <label>{labelname}</label>}</div>
      <TimePicker
        onChange={setTime}
        value={time}
        disableClock={true}
        format="HH:mm"
        hourPlaceholder="HH"
        minutePlaceholder="MM"
        className="form-cntrl w-100"
      />
    </div>
  );
};

export { TextInputForm, DropDown, Calender, DropDownUI, Time, TextForm };
