import { PersonData } from "./person-data";

export interface Comment {
	id: string,
    text: string,
    personId: string,
    postId: string,
    createdAt: number,
    personInfo: PersonData
}