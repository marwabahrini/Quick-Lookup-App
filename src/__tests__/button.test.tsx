import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../components/Button';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

// test for rendering button component
test('renders Button component', () => {
    const { getByText } = render(<Button onClick={() => {}} disabled={false} />);
    const buttonElement = getByText('Show information');
    expect(buttonElement).toBeInTheDocument();
});

// test for triggering onclick handler when clicked
test('triggers onClick handler when clicked', () => {
    const onClickMock = jest.fn();
    const { getByText } = render(<Button onClick={onClickMock} disabled={false} />);
    const buttonElement = getByText('Show information');
    fireEvent.click(buttonElement);
    expect(onClickMock).toHaveBeenCalled();
});

// test for disabling button when disabled prop is true
test('disables Button when disabled prop is true', () => {
    const { getByText } = render(<Button onClick={() => {}} disabled={true} />);
    const buttonElement = getByText('Show information') as HTMLButtonElement; // Type assertion
    expect(buttonElement.disabled).toBe(true);
});
