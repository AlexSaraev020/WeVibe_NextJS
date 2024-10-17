export interface UserType {
    _id: string;
    username: string;
    email: string;
    password: string;
    bio: string;
    image: string;
    createdAt: Date;
    posts: [];
  }
  