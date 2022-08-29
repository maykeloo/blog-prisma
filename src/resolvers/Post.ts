import { Context } from '../index'

interface PostParent {
    authorId: number,
}

export const Post = {
    user: async (parent: PostParent, __:any, { prisma }: Context) => {
        const user = await prisma.user.findUnique({
            where: {
                id: parent.authorId
            }
        })
        return user
    }
}