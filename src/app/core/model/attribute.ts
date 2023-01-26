export enum Type {
  SKILLS = 'SKILLS',
  EDUCATION = 'EDUCATION',
  EXPERIENCE = 'EXPERIENCE',
}

export interface Attribute {
  id?: string;
  attributeName: string;
  attributeValue: string;
  attributeType: Type;
}
