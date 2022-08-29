import { Context } from '../index'

interface UserParent {
    id: number,
}

export const User = {
    posts: async (parent: UserParent, __:any, { prisma, userInfo }: Context) => {
        const isOwnPost = parent.id === userInfo?.userId

        if(isOwnPost) {
            return prisma.post.findMany({
                where: {
                    authorId: parent.id
                },
                orderBy: [
                    {
                        createdAt: "desc"
                    }
                ]
            }) 
        } else {
            return prisma.post.findMany({
                where: {
                    authorId: parent.id,
                    published: true
                },
                orderBy: [
                    {
                        createdAt: "desc"
                    }
                ]
            })
        }
    }
}