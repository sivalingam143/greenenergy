import React from 'react'
import { Buttons } from '../Buttons';
import { fireEvent, render } from '@testing-library/react';
import "@testing-library/jest-dom";

describe('Buttons() Buttons method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should render the button with the correct label', () => {
      // Test to ensure the button renders with the provided label
      const { getByText } = render(<Buttons label="Click Me" />);
      expect(getByText('Click Me')).toBeInTheDocument();
    });

    it('should call the OnClick handler when clicked', () => {
      // Test to ensure the OnClick handler is called when the button is clicked
      const handleClick = jest.fn();
      const { getByText } = render(<Buttons label="Click Me" OnClick={handleClick} />);
      fireEvent.click(getByText('Click Me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should apply the correct class based on status', () => {
      // Test to ensure the correct class is applied based on the status prop
      const { getByText } = render(<Buttons label="Click Me" status="Active" />);
      expect(getByText('Click Me')).toHaveClass('active');
    });

    it('should apply additional class names passed via classname prop', () => {
      // Test to ensure additional class names are applied
      const { getByText } = render(<Buttons label="Click Me" classname="extra-class" />);
      expect(getByText('Click Me')).toHaveClass('extra-class');
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should not apply any status class if status is undefined', () => {
      // Test to ensure no status class is applied if status is undefined
      const { getByText } = render(<Buttons label="Click Me" />);
      expect(getByText('Click Me')).not.toHaveClass('active');
      expect(getByText('Click Me')).not.toHaveClass('inactive');
      expect(getByText('Click Me')).not.toHaveClass('invited');
    });

    it('should not throw an error if OnClick is not provided', () => {
      // Test to ensure no error is thrown if OnClick is not provided
      const { getByText } = render(<Buttons label="Click Me" />);
      fireEvent.click(getByText('Click Me'));
      // No assertion needed, just ensuring no error is thrown
    });

    it('should handle an unknown status gracefully', () => {
      // Test to ensure an unknown status does not apply any class
      const { getByText } = render(<Buttons label="Click Me" status="Unknown" />);
      expect(getByText('Click Me')).not.toHaveClass('active');
      expect(getByText('Click Me')).not.toHaveClass('inactive');
      expect(getByText('Click Me')).not.toHaveClass('invited');
    });
  });
});