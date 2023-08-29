import 'react-native'
import React from 'react';
import LoginDemo from './LoginDemo'
import { render, fireEvent } from '@testing-library/react-native'
import renderer from 'react-test-renderer'


// it('renders correctly', () => {
//     console.log('onPress ', jest.fn())
// });

// Warning on empty input on email
// Warning on empty input on password
// Warning on empty input on email and password
// //

test('should render correctly', () => {
    const { getByTestId, getByText } = render(<LoginDemo />)

    const emailTI = getByTestId('email')
    const passwordTI = getByTestId('password')
    const button = getByTestId('login')
    // const loginButton = button?.props

    // console.log('button', button)

    fireEvent.changeText(emailTI, 'sami.siddiq@venturedive.com');
    fireEvent.changeText(passwordTI, 'password123');

    fireEvent.press(button);

    // const emailText = getByTestId('emailText')

    // console.log('emailText ', emailText.children)

    // const passwordText = getByText('password123')
    const emailText = getByTestId('emailText')
    const passwordText = getByTestId('passwordText')

    expect(...emailText.children).toBe('sami.siddiq@venturedive.com')
    // expect(...passwordText.children).toBe('password123')


})


// test('renders correctly', async () => {
//     const { getByLabelText, getByText } = render(<LoginDemo />);

//     // Find input fields by their labels and simulate user input
//     const emailInput = getByLabelText('Email');
//     const passwordInput = getByLabelText('Password');

//     // Find and press the login button
//     const loginButton = getByText('Login');

//     console.log('loginButton ', loginButton)

//     fireEvent.changeText(emailInput, 'test@example.com');
//     fireEvent.changeText(passwordInput, 'password123');

//     fireEvent.press(loginButton);

//     // Add your assertions here to verify the expected outcomes
//     // For example, you could check if a success message is displayed

//     // Example assertion:
//     // const successMessage = getByText('Login Successful');
//     // expect(successMessage).toBeTruthy();
// });







