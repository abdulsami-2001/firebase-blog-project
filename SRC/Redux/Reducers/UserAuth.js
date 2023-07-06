import { createReducer } from 'reduxsauce'
import { Types } from '../Action/Action'

export const INITIAL_STATE = {
    isUserLoggedIn: false,
    userIdentification: "",
    userBlogs: {},
    allBlogs: {
        ['Done is better than']: {
            Title: 'Done is better than perfect Done is better than perfect Done is better than perfect',
            Author: "Someone",
            Content: 'Blog Done is better than perfect, Done is better than perfect , Done is better than perfect , Done is better than perfect , , Done is better than perfect ,Done is better than perfect ,Blog Done is better than perfect, Done is better than perfect , Done is better than perfect , Done is better than perfect , , ',
            ImageUrl: "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png"

        },
        ['Venture Dive']: {
            Title: 'Venture Dive',
            Author: "Someone--",
            Content: 'Blog Venture Dive, Venture Dive , Venture Dive , Venture Dive , ,  Venture Dive , Venture Dive , ',
            ImageUrl: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png'

        },
        ['If you know, you know']: {
            Title: 'If you know, you know',
            Author: "Someone++",
            Content: 'Blog If you know, you know, If you know, you know , If you know, you know , If you know, you know , , If you know, you know ,If you know, you know , ',
            ImageUrl: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r5.png'
        },
    },
}

export const UserAuth = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: action.userstateflag,
        userIdentification: state.userIdentification,
        userBlogs: state.userBlogs,
        allBlogs: state.allBlogs,
    }
}

export const UserIdUpdate = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: action.uid,
        userBlogs: state.userBlogs,
        allBlogs: state.allBlogs,
    }
}

export const UserBlogsUpdate = (state = INITIAL_STATE, action) => {

    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        userBlogs: action.userblogs,
        allBlogs: state.allBlogs,
    }
}

export const allBlogsUpdate = (state = INITIAL_STATE, action) => {

    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        userBlogs: state.userBlogs,
        allBlogs: action.allblogs,
    }
}




export const HANDLER = {
    [Types.USER_STATE]: UserAuth,
    [Types.USER_ID]: UserIdUpdate,
    [Types.USER_BLOGS]: UserBlogsUpdate,
    [Types.ALL_BLOGS]: allBlogsUpdate,
}

export default createReducer(INITIAL_STATE, HANDLER)