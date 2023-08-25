import 'react-native'
import React from 'react';
import Login from './Login';
import { render, fireEvent } from '@testing-library/react-native'

// jest.mock('./Login')

test('renders correctly', async () => {
    const { getAllByText } = render(<Login />)
    console.log('getAllByText ', getAllByText)
})

// it('renders correctly', () => {
//     console.log('onPress ', jest.fn())
// });

// Warning on empty input on email
// Warning on empty input on password
// Warning on empty input on email and password
// //


// test('renders correctly', async () => {
//     const { getByLabelText, getByText } = await render(<Login />);

//     // Find input fields by their labels and simulate user input
//     const emailInput = getByLabelText('Email');
//     const passwordInput = getByLabelText('Password');

//     fireEvent.changeText(emailInput, 'test@example.com');
//     fireEvent.changeText(passwordInput, 'password123');

//     // Find and press the login button
//     const loginButton = getByText('Login');
//     fireEvent.press(loginButton);

//     // Add your assertions here to verify the expected outcomes
//     // For example, you could check if a success message is displayed

//     // Example assertion:
//     // const successMessage = getByText('Login Successful');
//     // expect(successMessage).toBeTruthy();
// });







