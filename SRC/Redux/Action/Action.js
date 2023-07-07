import { createActions } from 'reduxsauce'

export const { Types, Creators } = createActions({
    userState: ['userstateflag'],
    userId: ['uid'],
    userBlogs: ['userblogs'],
    allBlogs: ['allblogs'],
    userFavorites: ['userfavorites'],
})
