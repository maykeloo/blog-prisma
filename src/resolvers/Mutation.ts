import { Context } from '../index'
import { Post } from '.prisma/client'

interface PostCreateArgs {
    title: string,
    content: string
}

interface PostPayloadType {
    userErrors: {
        message: string
    }[],
    post: Post | null
}

export const Mutation = {
    postCreate: async (_: any, { title, content }: PostCreateArgs, { prisma }: Context): Promise<PostPayloadType> => {
        const post = await prisma.post.create({
            data: {
                title,
                content
            }
        })
        return {
            userErrors: [],
            post
        }
    },
}