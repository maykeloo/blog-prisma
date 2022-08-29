import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { Query, Profile, Mutation, Post, User } from "./resolvers";
import { PrismaClient, Prisma } from '@prisma/client'
import { getUserFromToken } from "./utils/getUserFromToken";

const prisma = new PrismaClient();

export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>,
    userInfo: {
        userId: number;
    } | null
}

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query, 
        Profile,
        Mutation,
        Post,
        User
    },
    context: async ({ req }): Promise<Context> => {
        const { headers } = req
        const { authorization } = headers
        const userInfo = await getUserFromToken(authorization!)

        return {
            prisma,
            userInfo
        }
    }
})

server.listen().then(({ url }) => {
    console.log(`Server ready on ${url}`)
}) 