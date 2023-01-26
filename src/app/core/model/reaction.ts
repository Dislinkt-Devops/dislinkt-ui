import { PersonData } from "./person-data";

export enum TYPE {
	Like = 'LIKE',
	Dislike = 'DISLIKE'
}

export interface Reaction {
	id: string,
    type: TYPE,
    personId: string,
    postId: string,
    personInfo: PersonData
}