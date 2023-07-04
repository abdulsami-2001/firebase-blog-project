import { createReducer } from 'reduxsauce'
import { Types } from '../Action/Action'

export const INITIAL_STATE = {
    isUserLoggedIn: false,
    userId: ""
}

export const UserAuth = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: action.userstateflag,
        userId: action.uid
    }
}

export const HANDLER = {
    [Types.USER_STATE]: UserAuth
}

export default createReducer(INITIAL_STATE, HANDLER)