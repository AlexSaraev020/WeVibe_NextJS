export interface UserType {
    _id: string;
    username: string;
    email: string;
    bio: string;
    image: string;
    createdAt?: Date;
    posts?: [];
    followers?: string[];
    following?: string[];
  }
  