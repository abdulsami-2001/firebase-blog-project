import { render, fireEvent } from '@testing-library/react-native'
import ForgetPasswordDemo from './ForgetPasswordDemo'


describe('should render correct', () => {
    test('should render forget password', () => {
        const { getByTestId } = render(<ForgetPasswordDemo />)
        const emailTI = getByTestId('email')
        const result = getByTestId('result')
        const button = getByTestId('Request Code')

        fireEvent.changeText(emailTI, 'a@b.com')
        fireEvent.press(button)

        console.log('result ', result.children)

        expect(result.children[1]).toBe('Valid Email Address')
        // expect(result.children[1]).toBe("Invalid: @ cannot be the first character")

    })
})