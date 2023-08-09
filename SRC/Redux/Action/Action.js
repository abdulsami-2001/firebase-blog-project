import { createActions } from 'reduxsauce'

export const { Types, Creators } = createActions({
    user: ['user'],
    userId: ['uid'],
    content: ['content'],
    allBlogs: ['allblogs'],
    userLike: ['userlike'],
    userBlogs: ['userblogs'],
    userState: ['userstateflag'],
    userComments: ['usercomments'],
    userFavorites: ['userfavorites'],
    blogViewsCount: ['blogviewscount'],

})
