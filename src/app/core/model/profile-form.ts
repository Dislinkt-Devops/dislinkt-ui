export interface ProfileForm {
	firstName: string,
	lastName: string,
	phoneNumber: string,
	dateOfBirth: string,
	gender: 'MALE' | 'FEMALE',
	bio: string,
	privacy: 'PUBLIC' | 'PRIVATE',
}