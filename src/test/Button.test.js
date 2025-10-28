// ButtonsActionButton.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Buttons, ActionButton } from '../components/Buttons'; 
import { HiOutlineDotsVertical } from 'react-icons/hi';

describe('Buttons component', () => {
  test('renders the button with the correct label', () => {
    render(<Buttons label="Click me" />);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('applies the correct class based on status', () => {
    const { rerender } = render(<Buttons label="Test" status="Invited" />);
    expect(screen.getByText('Test')).toHaveClass('invited');

    rerender(<Buttons label="Test" status="Inactive" />);
    expect(screen.getByText('Test')).toHaveClass('inactive');

    rerender(<Buttons label="Test" status="Active" />);
    expect(screen.getByText('Test')).toHaveClass('active');
  });

  test('calls the onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Buttons label="Click me" OnClick={handleClick} />);
    const buttonElement = screen.getByText(/click me/i);
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('ActionButton component', () => {
  const options = [
    { label: 'Edit', onClick: jest.fn(), icon: <HiOutlineDotsVertical /> },
    { label: 'Delete', onClick: jest.fn(), icon: <HiOutlineDotsVertical /> },
  ];

  test('renders the dropdown button', () => {
    render(<ActionButton options={options} />);
    const dropdownToggle = screen.getByRole('button');
    expect(dropdownToggle).toBeInTheDocument();
  });

  test('renders all dropdown items with correct labels and icons', () => {
    render(<ActionButton options={options} />);
    fireEvent.click(screen.getByRole('button'));

    options.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  test('calls the correct onClick handler when an option is clicked', () => {
    render(<ActionButton options={options} />);
    fireEvent.click(screen.getByRole('button'));

    options.forEach(option => {
      const item = screen.getByText(option.label);
      fireEvent.click(item);
      expect(option.onClick).toHaveBeenCalledTimes(1);
    });
  });
});
