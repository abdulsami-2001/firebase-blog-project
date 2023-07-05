import { createReducer } from 'reduxsauce'
import { Types } from '../Action/Action'

export const INITIAL_STATE = {
    isUserLoggedIn: false,
    userIdentification: ""
}

export const UserAuth = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: action.userstateflag,
        userIdentification: state.userIdentification
    }
}

export const UserIdUpdate = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: action.uid
    }
}

export const HANDLER = {
    [Types.USER_STATE]: UserAuth,
    [Types.USER_ID]: UserIdUpdate,
}

export default createReducer(INITIAL_STATE, HANDLER)