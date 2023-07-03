import { createReducer } from 'reduxsauce'
import { Types } from '../Action/Action'

export const INITIAL_STATE = {
    isUserLoggedIn: false
}

export const UserState = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: action.userstateflag
    }
}

export const HANDLER = {
    [Types.USER_STATE]: UserState
}

export default createReducer(INITIAL_STATE, HANDLER)