import { gql } from "apollo-server";

export const typeDefs = gql`
    type Query {
        hello: String!
    }

    type Mutation {
        postCreate(title: String!, content: String!, authorId: ID!): PostPayload!
    }

    type Post {
        id:         ID!
        title:      String!
        content:    String!
        published:  Boolean!
        createdAt:  String!     
        user:       User!
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
`; 