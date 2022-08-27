import { gql } from "apollo-server";

export const typeDefs = gql`
    type Query {
        posts: [Post!]!
        post(postId: ID!): Post!
    }

    type Mutation {
        postCreate(post: PostInput!): PostPayload!
        postUpdate(postId: ID!, post: PostInput): PostPayload!
        postDelete(postId: ID!): PostPayload
        postPublish(postId: ID!): PostPayload
        signUp(user: SignUpInput!): UserPayload!
        signIn(user: SignInInput!): UserPayload!
    }

    type Post {
        id:         ID!
        title:      String!
        content:    String!
        published:  Boolean!
        createdAt:  String!     
        user:       User
    }

    type User {
        id:         ID!
        email:      String!   
        name:       String!
        password:   String!
        createdAt:  String!   
        profile:    Profile!
        posts:      [Post!]!
    }

    type Profile {
        id:         ID!
        bio:        String!
        user:       User!
    }

    type UserError {
        message:    String!
    }

    type PostPayload {
        userErrors: [UserError!]!
        post:        Post
    }

    type UserPayload {
        userErrors: [UserError!]!
        token: String
    }

    input SignUpInput {
        name:       String!
        email:      String!   
        password:   String!
        bio:        String!
    }

    input SignInInput {
        email:      String!
        password:   String!
    }

    input PostInput {
        title: String
        content: String
    }
`; 