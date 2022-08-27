import { Post } from '.prisma/client'
import { Context } from '../../index'
import { canUserMutatePost } from '../../utils/canUserMutatePost'

interface PostArgs {
    post: {
        title?: string,
        content?: string,
    }
    postId: string
}

export interface PostPayloadType {
    userErrors: {
        message: string
    }[],
    post: Post | null,
}

export const post = {
    postCreate: async (_: any, { post: p }: PostArgs, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        const { title, content } = p

        if(!userInfo) {
            return {
                userErrors: [
                    {
                        message: "Forbidden access"
                    }
                ],
                post: null
            }
        }

        if(!title || !content) {
            return {
                userErrors: [{
                    message: "You must provide a title and a content to create a post"
                }],
                post: null
            }
        }
        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: userInfo.userId
            }
        })
        return {
            userErrors: [],
            post
        }
    },
    postUpdate: async (_: any, { postId, post }: PostArgs, { prisma, userInfo }: Context) => {
        const { title, content } = post
        const error = await canUserMutatePost({ userId: userInfo!.userId, postId: postId, prisma });

        if(error) return error

        if(!title && !content) {
            return {
                userErrors: [
                    {
                        message: "Need to have at least one field to update."
                    }
                ],
                post: null
            }
        }
        
        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })
         
        if(!existingPost) {
            return {
                userErrors: [
                    {
                        message: "Post does not exist."
                    }
                ],
                post: null
            }
        }

        let payloadToUpdate = {
            title, content
        }

        if(!title) delete payloadToUpdate.title
        if(!content) delete payloadToUpdate.content

        return {
            userErrors: [],
            post: prisma.post.update({
                data: {
                 ...payloadToUpdate
                },
                where: {
                    id: Number(postId)
                }
            })
        }
    },
    postDelete: async (_:any, { postId }: PostArgs, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        const error = await canUserMutatePost({ userId: userInfo!.userId, postId: postId, prisma });

        if(error) return error

        if(!existingPost) {
            return {
                userErrors: [
                    {
                        message: "Post does not exist."
                    }
                ],
                post: null
            }
        }
        await prisma.post.delete({
            where: {
                id: Number(postId)
            }
        })

        return {
            userErrors: [],
            post: existingPost
        }
    },
    postPublish: async (_: any, { postId }: PostArgs, { prisma, userInfo }: Context) => {
        const error = await canUserMutatePost({ userId: userInfo!.userId, postId: postId, prisma });

        if(error) return error
         
        if(!userInfo) {
            return {
                userErrors: [
                    {
                        message: "Post does not exist."
                    }
                ],
                post: null
            }
        }

        const postToTogglePublish = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        return {
            userErrors: [],
            post: prisma.post.update({
                data: {
                 published: !postToTogglePublish?.published
                },
                where: {
                    id: Number(postId)
                }
            })
        }
    },
}