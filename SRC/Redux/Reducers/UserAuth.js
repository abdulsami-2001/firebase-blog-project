import { createReducer } from 'reduxsauce'
import { Types } from '../Action/Action'

export const INITIAL_STATE = {
    isUserLoggedIn: false,
    userIdentification: "",
    userBlogs: {},
}

export const UserAuth = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: action.userstateflag,
        userIdentification: state.userIdentification,
        userBlogs: state.userBlogs,
    }
}

export const UserIdUpdate = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: action.uid,
        userBlogs: state.userBlogs,
    }
}

export const UserBlogsUpdate = (state = INITIAL_STATE, action) => {

    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        userBlogs: action.userblogs
    }
}

export const HANDLER = {
    [Types.USER_STATE]: UserAuth,
    [Types.USER_ID]: UserIdUpdate,
    [Types.USER_BLOGS]: UserBlogsUpdate,
}

export default createReducer(INITIAL_STATE, HANDLER)