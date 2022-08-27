import { post } from "./post";
import { Auth } from "./auth";

export const Mutation = {
    ...post,
    ...Auth,
}