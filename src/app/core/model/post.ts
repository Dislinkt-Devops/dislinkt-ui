import { Comment } from "./comment";
import { PersonData } from "./person-data";
import { Reaction } from "./reaction";

export interface Post {
    id: string,
    text: string,
    imageUrl: string,
    links: string[],
    personId: string,
    personInfo: PersonData,
    comments: Comment[],
    reactions: Reaction[],
    createdAt: number
}
    