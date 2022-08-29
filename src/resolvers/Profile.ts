import { Context } from '../index'

interface ProfileParent {
    id: number,
    bio: string,
    userId: number
}


export const Profile = {
    user: async (parent: ProfileParent, __:any, { prisma }: Context) => {
        const user = await prisma.user.findUnique({
            where: {
                id: parent.userId
            }
        })
    }
}