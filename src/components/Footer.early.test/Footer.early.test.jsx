import React from 'react'
import Footer from '../Footer';
import { fireEvent, render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";

// Mock the Buttons component
jest.mock("../Buttons", () => ({
  Buttons: ({ label, OnClick, classname }) => (
    <button className={classname} onClick={OnClick}>
      {label}
    </button>
  ),
}));

describe('Footer() Footer method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    test('renders Footer with two buttons', () => {
      // Arrange
      const labelOne = 'Button One';
      const labelTwo = 'Button Two';
      const labelOneClick = jest.fn();
      const labelTwoClick = jest.fn();

      // Act
      render(
        <Footer
          LabelOne={labelOne}
          LabelTwo={labelTwo}
          LabelOneClick={labelOneClick}
          LabelTwoClick={labelTwoClick}
        />
      );

      // Assert
      expect(screen.getByText(labelOne)).toBeInTheDocument();
      expect(screen.getByText(labelTwo)).toBeInTheDocument();
    });

    test('calls the correct function when the first button is clicked', () => {
      // Arrange
      const labelOne = 'Button One';
      const labelOneClick = jest.fn();

      // Act
      render(
        <Footer
          LabelOne={labelOne}
          LabelTwo="Button Two"
          LabelOneClick={labelOneClick}
          LabelTwoClick={() => {}}
        />
      );

      fireEvent.click(screen.getByText(labelOne));

      // Assert
      expect(labelOneClick).toHaveBeenCalledTimes(1);
    });

    test('calls the correct function when the second button is clicked', () => {
      // Arrange
      const labelTwo = 'Button Two';
      const labelTwoClick = jest.fn();

      // Act
      render(
        <Footer
          LabelOne="Button One"
          LabelTwo={labelTwo}
          LabelOneClick={() => {}}
          LabelTwoClick={labelTwoClick}
        />
      );

      fireEvent.click(screen.getByText(labelTwo));

      // Assert
      expect(labelTwoClick).toHaveBeenCalledTimes(1);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('renders Footer with empty labels', () => {
      // Arrange
      const labelOneClick = jest.fn();
      const labelTwoClick = jest.fn();

      // Act
      render(
        <Footer
          LabelOne=""
          LabelTwo=""
          LabelOneClick={labelOneClick}
          LabelTwoClick={labelTwoClick}
        />
      );

      // Assert
      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument();
    });

    test('handles null click handlers gracefully', () => {
      // Arrange
      const labelOne = 'Button One';
      const labelTwo = 'Button Two';

      // Act
      render(
        <Footer
          LabelOne={labelOne}
          LabelTwo={labelTwo}
          LabelOneClick={null}
          LabelTwoClick={null}
        />
      );

      // Assert
      const buttonOne = screen.getByText(labelOne);
      const buttonTwo = screen.getByText(labelTwo);

      fireEvent.click(buttonOne);
      fireEvent.click(buttonTwo);

      // No errors should occur, and no functions should be called
      expect(buttonOne).toBeInTheDocument();
      expect(buttonTwo).toBeInTheDocument();
    });
  });
});