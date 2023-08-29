import mockAuth from '@react-native-firebase/auth';

jest.mock('@react-native-firebase/auth', () => {
    return {
        createUserWithEmailAndPassword: (Email, Password) => {
            if (Password === '' && Email === '') {
                return "Email and password can't be empty"
            } else if (Password === '') {
                return "Password can't be empty"
            } else if (Email === '') {
                return "Email can't be empty"
            } else if (Email != '' && Password != '') {
                return 'success'
            } else {
                return 'some thing went wrong'
            }
        }
    };
});


describe('Auth() Signup', () => {
    test("should return Email and password can't be empty", async () => {
        const response = await mockAuth.createUserWithEmailAndPassword('', '')
        expect(response).toBe("Email and password can't be empty")
    })
})