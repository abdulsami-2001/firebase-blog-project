import mockAuth from '@react-native-firebase/auth';
import UpdateDemo from './UpdateDemo'
import { fireEvent, render } from '@testing-library/react-native'

jest.mock('@react-native-firebase/auth', () => {
    return {
        currentUser: {
            updateProfile: (newName) => (
                "Name Update Successfully"
            )
        }
    }
})


describe('Should render correctly - Update Profile', () => {
    test('Should change name of the user', async () => {
        const { getByTestId } = render(<UpdateDemo />)
        const button = getByTestId('button')
        const NewNameTI = getByTestId('NewNameTI')


        fireEvent.changeText(NewNameTI, 'Samim')
        fireEvent.press(button)

        // console.log('NewNameTI ', NewNameTI.props.value)

        const response = await mockAuth.currentUser.updateProfile(NewNameTI?.props?.value || '')
        // console.log('response ', response)

        expect(response).toBe('Name Update Successfully')

    })
})

// test('testing multiple timers', () => {
//     // jest.useFakeTimers(); // setup file ma sbsy oper dala wa ha, on top hi rkhna hota ha isy, tree ( component ) render hony sy pehly chl jana chahiye ye. ideal ha 

//     const timer1Callback = jest.fn();
//     const timer2Callback = jest.fn();

//     // Set up two timers
//     setTimeout(timer1Callback, 1000);
//     setTimeout(timer2Callback, 2000);

//     // Neither timer has run yet
//     expect(timer1Callback).not.toBeCalled();
//     expect(timer2Callback).not.toBeCalled();

//     jest.runAllTimers();
//     // Advance timers by running all of them

//     // Now, both timers should have run
//     expect(timer1Callback).toBeCalled();
//     expect(timer2Callback).toBeCalled();
// });
