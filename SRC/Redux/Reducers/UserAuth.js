import { createReducer } from 'reduxsauce'
import { Types } from '../Action/Action'

export const INITIAL_STATE = {
    content: '',
    isUserLoggedIn: false,
    userIdentification: "",
    userLike: {},
    userComments: {},
    userBlogs: {},
    userFavorites: {},
    allBlogs: {
        ['Done is better than']: {
            Title: 'Done is better than perfect Done is better than perfect Done is better than perfect',
            Author: "Someone",
            Content: 'Blog Done is better than perfect, Done is better than perfect , Done is better than perfect , Done is better than perfect , , Done is better than perfect ,Done is better than perfect ,Blog Done is better than perfect, Done is better than perfect , Done is better than perfect , Done is better than perfect',
            ImageUrl: "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png"

        },
        ['Venture Dive']: {
            Title: 'Venture Dive',
            Author: "Someone--",
            Content: 'Blog Venture Dive, Venture Dive , Venture Dive , Venture Dive , Venture Dive , Venture Dive',
            ImageUrl: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png'

        },
        ['Blog Testing Purpose']: {
            Title: 'Blog Testing Purpose',
            Author: "Someone++",
            Content: 'Blog Testing Purpose, Blog Testing Purpose , Blog Testing Purpose , Blog Testing Purpose , Blog Testing Purpose ,Blog Testing Purpose',
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
        userFavorites: state.userFavorites,
        allBlogs: state.allBlogs,
        content: state.content,
        userLike: state.userLike,
        userComments: state.userComments,
    }
}

export const UserIdUpdate = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: action.uid,
        userBlogs: state.userBlogs,
        userFavorites: state.userFavorites,
        allBlogs: state.allBlogs,
        content: state.content,
        userLike: state.userLike,
        userComments: state.userComments,
    }
}

export const UserBlogsUpdate = (state = INITIAL_STATE, action) => {

    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        userBlogs: action.userblogs,
        userFavorites: state.userFavorites,
        allBlogs: state.allBlogs,
        content: state.content,
        userLike: state.userLike,
        userComments: state.userComments,
    }
}

export const allBlogsUpdate = (state = INITIAL_STATE, action) => {

    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        userBlogs: state.userBlogs,
        userFavorites: state.userFavorites,
        allBlogs: action.allblogs,
        content: state.content,
        userLike: state.userLike,
        userComments: state.userComments,
    }
}


export const UserFavoritesUpdate = (state = INITIAL_STATE, action) => {

    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        userBlogs: state.userBlogs,
        userFavorites: action.userfavorites,
        allBlogs: state.allBlogs,
        content: state.content,
        userLike: state.userLike,
        userComments: state.userComments,
    }
}
export const Content = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        userBlogs: state.userBlogs,
        userFavorites: state.userFavorites,
        allBlogs: state.allBlogs,
        content: action.content,
        userLike: state.userLike,
        userComments: state.userComments,
    }
}

export const UserLikeUpdate = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        userBlogs: state.userBlogs,
        userFavorites: state.userFavorites,
        allBlogs: state.allBlogs,
        content: state.content,
        userLike: action.userlike,
        userComments: state.userComments,
    }
}

export const UserCommentsUpdate = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        userBlogs: state.userBlogs,
        userFavorites: state.userFavorites,
        allBlogs: state.allBlogs,
        content: state.content,
        userLike: state.userLike,
        userComments: action.usercomments,
    }
}

export const HANDLER = {
    [Types.USER_STATE]: UserAuth,
    [Types.USER_ID]: UserIdUpdate,
    [Types.USER_BLOGS]: UserBlogsUpdate,
    [Types.ALL_BLOGS]: allBlogsUpdate,
    [Types.USER_FAVORITES]: UserFavoritesUpdate,
    [Types.CONTENT]: Content,
    [Types.USER_LIKE]: UserLikeUpdate,
    [Types.USER_COMMENTS]: UserCommentsUpdate,
}

export default createReducer(INITIAL_STATE, HANDLER)