import { createReducer } from 'reduxsauce'
import { Types } from '../Action/Action'

export const INITIAL_STATE = {
    user: {},
    content: '',
    userLike: {},
    userBlogs: {},
    usersData: {},
    editContent: {},
    userComments: {},
    blogViewsCount: {},
    isUserLoggedIn: false,
    userIdentification: "",
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
        user: state.user,
        userBlogs: state.userBlogs,
        allBlogs: state.allBlogs,
        content: state.content,
        userLike: state.userLike,
        userComments: state.userComments,
        blogViewsCount: state.blogViewsCount,
        editContent: state.editContent,
        usersData: state.usersData,
    }
}

export const UserIdUpdate = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: action.uid,
        user: state.user,
        userBlogs: state.userBlogs,
        allBlogs: state.allBlogs,
        content: state.content,
        userLike: state.userLike,
        userComments: state.userComments,
        blogViewsCount: state.blogViewsCount,
        editContent: state.editContent,
        usersData: state.usersData,
    }
}

export const UserBlogsUpdate = (state = INITIAL_STATE, action) => {

    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        user: state.user,
        userBlogs: action.userblogs,
        allBlogs: state.allBlogs,
        content: state.content,
        userLike: state.userLike,
        userComments: state.userComments,
        blogViewsCount: state.blogViewsCount,
        editContent: state.editContent,
        usersData: state.usersData,
    }
}

export const allBlogsUpdate = (state = INITIAL_STATE, action) => {

    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        userBlogs: state.userBlogs,
        user: state.user,
        allBlogs: action.allblogs,
        content: state.content,
        userLike: state.userLike,
        userComments: state.userComments,
        blogViewsCount: state.blogViewsCount,
        editContent: state.editContent,
        usersData: state.usersData,
    }
}

export const Content = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        userBlogs: state.userBlogs,
        user: state.user,
        allBlogs: state.allBlogs,
        content: action.content,
        userLike: state.userLike,
        userComments: state.userComments,
        blogViewsCount: state.blogViewsCount,
        editContent: state.editContent,
        usersData: state.usersData,
    }
}

export const UserLikeUpdate = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        userBlogs: state.userBlogs,
        user: state.user,
        allBlogs: state.allBlogs,
        content: state.content,
        userLike: action.userlike,
        userComments: state.userComments,
        blogViewsCount: state.blogViewsCount,
        editContent: state.editContent,
        usersData: state.usersData,
    }
}

export const UserCommentsUpdate = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        user: state.user,
        userBlogs: state.userBlogs,
        allBlogs: state.allBlogs,
        content: state.content,
        userLike: state.userLike,
        userComments: action.usercomments,
        blogViewsCount: state.blogViewsCount,
        editContent: state.editContent,
        usersData: state.usersData,
    }
}


export const User = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        user: action.user,
        userBlogs: state.userBlogs,
        allBlogs: state.allBlogs,
        content: state.content,
        userLike: state.userLike,
        userComments: state.userComments,
        blogViewsCount: state.blogViewsCount,
        editContent: state.editContent,
        usersData: state.usersData,
    }
}


export const BlogViewsCount = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        user: state.user,
        userBlogs: state.userBlogs,
        allBlogs: state.allBlogs,
        content: state.content,
        userLike: state.userLike,
        userComments: state.userComments,
        blogViewsCount: action.blogviewscount,
        editContent: state.editContent,
        usersData: state.usersData,
    }
}



export const EditContent = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        user: state.user,
        userBlogs: state.userBlogs,
        allBlogs: state.allBlogs,
        content: state.content,
        userLike: state.userLike,
        userComments: state.userComments,
        blogViewsCount: state.blogViewsCount,
        editContent: action.editcontent,
        usersData: state.usersData,
    }
}



export const UsersData = (state = INITIAL_STATE, action) => {
    return {
        ...state,
        isUserLoggedIn: state.isUserLoggedIn,
        userIdentification: state.userIdentification,
        user: state.user,
        userBlogs: state.userBlogs,
        allBlogs: state.allBlogs,
        content: state.content,
        userLike: state.userLike,
        userComments: state.userComments,
        blogViewsCount: state.blogViewsCount,
        editContent: state.editContent,
        usersData: action.usersdata,
    }
}



export const HANDLER = {
    [Types.USER]: User,
    [Types.CONTENT]: Content,
    [Types.USER_STATE]: UserAuth,
    [Types.USER_ID]: UserIdUpdate,
    [Types.USERS_DATA]: UsersData,
    [Types.USER_LIKE]: UserLikeUpdate,
    [Types.ALL_BLOGS]: allBlogsUpdate,
    [Types.EDIT_CONTENT]: EditContent,
    [Types.USER_BLOGS]: UserBlogsUpdate,
    [Types.BLOG_VIEWS_COUNT]: BlogViewsCount,
    [Types.USER_COMMENTS]: UserCommentsUpdate,
}

export default createReducer(INITIAL_STATE, HANDLER)