export interface PostType {
  _id: string;
  title: string;
  description: string;
  image: string;
  createdAt: Date;
  createdBy: string;
  likes: [];
  comments: [];
}
