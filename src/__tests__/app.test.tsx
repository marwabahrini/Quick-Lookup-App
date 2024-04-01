import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App.tsx';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

test('renders App component', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));
    await act(async () => {
        render(<App />); });
    expect(screen.getByText('Quick Lookup App')).toBeInTheDocument();
});


