enum Privacy {
	Public = 'PUBLIC',
	Private = 'PRIVATE'
}

export interface PersonInfo {
	bio: string,
	dateOfBirth: string,
	firstName: string;
	gender: string,
	id: string,
	lastName: string,
	phoneNumber: string,
	privacy: Privacy
}