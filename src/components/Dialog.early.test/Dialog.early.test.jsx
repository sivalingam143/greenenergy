import React from 'react'
import Dialog from '../Dialog';
import { fireEvent, render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";

// Mock the Buttons component
jest.mock("../Buttons", () => ({
  Buttons: ({ OnClick, classname, label }) => (
    <button className={classname} onClick={OnClick}>
      {label}
    </button>
  ),
}));

describe('Dialog() Dialog method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    test('should render the dialog with title and buttons when visible', () => {
      // Arrange
      const onConfirmMock = jest.fn();
      const onCancelMock = jest.fn();
      const dialogTitle = 'Confirm Action';

      // Act
      render(
        <Dialog
          isVisible={true}
          onConfirm={onConfirmMock}
          onCancel={onCancelMock}
          DialogTitle={dialogTitle}
        />
      );

      // Assert
      expect(screen.getByText(dialogTitle)).toBeInTheDocument();
      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
    });

    test('should call onConfirm with true when Yes button is clicked', () => {
      // Arrange
      const onConfirmMock = jest.fn();
      const onCancelMock = jest.fn();

      // Act
      render(
        <Dialog
          isVisible={true}
          onConfirm={onConfirmMock}
          onCancel={onCancelMock}
          DialogTitle="Confirm Action"
        />
      );
      fireEvent.click(screen.getByText('Yes'));

      // Assert
      expect(onConfirmMock).toHaveBeenCalledWith(true);
    });

    test('should call onCancel with false when No button is clicked', () => {
      // Arrange
      const onConfirmMock = jest.fn();
      const onCancelMock = jest.fn();

      // Act
      render(
        <Dialog
          isVisible={true}
          onConfirm={onConfirmMock}
          onCancel={onCancelMock}
          DialogTitle="Confirm Action"
        />
      );
      fireEvent.click(screen.getByText('No'));

      // Assert
      expect(onCancelMock).toHaveBeenCalledWith(false);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('should not render the dialog when isVisible is false', () => {
      // Arrange
      const onConfirmMock = jest.fn();
      const onCancelMock = jest.fn();

      // Act
      render(
        <Dialog
          isVisible={false}
          onConfirm={onConfirmMock}
          onCancel={onCancelMock}
          DialogTitle="Confirm Action"
        />
      );

      // Assert
      expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
      expect(screen.queryByText('Yes')).not.toBeInTheDocument();
      expect(screen.queryByText('No')).not.toBeInTheDocument();
    });

    test('should handle missing DialogTitle gracefully', () => {
      // Arrange
      const onConfirmMock = jest.fn();
      const onCancelMock = jest.fn();

      // Act
      render(
        <Dialog
          isVisible={true}
          onConfirm={onConfirmMock}
          onCancel={onCancelMock}
        />
      );

      // Assert
      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
    });
  });
});