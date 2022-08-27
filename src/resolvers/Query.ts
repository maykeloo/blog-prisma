import { Context } from '../index'
import { Post } from '.prisma/client'
import { PostPayloadType } from './Mutation/post'

export const Query = {
    posts: async (_:any, __:any, { prisma }: Context): Promise<Post[]> => {
        const posts = await prisma.post.findMany({
            orderBy: [
                {
                    createdAt: "desc"
                },
            ]
        })
        return posts
    },
    post: async (_:any, { postId }: { postId: string }, { prisma }: Context): Promise<Post | PostPayloadType> => {
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })
        if (post) {
            return post
        } else {
            return {
                userErrors: [{
                    message: "You must provide a title and a content to create a post"
                }],
                post: null
            }
        }
    }
}