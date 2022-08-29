import { Context } from '../index'
import { Post, User, Profile } from '.prisma/client'
import { PostPayloadType } from './Mutation/post'

interface UserPayload {
    userErrors: {
        message: string
    }[],
    user: User | null;
}

interface ProfilePayload {
    userErrors: {
        message: string
    }[],
    profile: Profile | null; 
}

export const Query = {
    posts: async (_:any, __:any, { prisma }: Context): Promise<Post[]> => {
        const posts = await prisma.post.findMany({
            where: {
                published: true
            },
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
    },
    me: async (_:any, __:any, { prisma, userInfo }: Context): Promise<UserPayload> => {

        if(!userInfo) {
            return {
                userErrors: [
                    {
                        message: "User not found."
                    }
                ],
                user: null
            }
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userInfo.userId
            }
        })

        return {
            userErrors: [],
            user
        }
    },
    profile: async (_: any,{ userId }: { userId: string }, { prisma, userInfo }: Context) => {
        const isMyProfile = Number(userId) === userInfo?.userId;
    
        const profile = await prisma.profile.findUnique({
          where: {
            userId: Number(userId),
          },
        });
    
        if (!profile) return null;
    
        return {
          ...profile,
          isMyProfile,
        };
      },

}