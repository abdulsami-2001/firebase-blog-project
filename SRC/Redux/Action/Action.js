import { createActions } from 'reduxsauce'

export const { Types, Creators } = createActions({
    user: ['user'],
    userId: ['uid'],
    content: ['content'],
    allBlogs: ['allblogs'],
    userLike: ['userlike'],
    userBlogs: ['userblogs'],
    usersData: ['usersdata'],
    userState: ['userstateflag'],
    editContent: ['editcontent'],
    userComments: ['usercomments'],
    blogViewsCount: ['blogviewscount'],
})
