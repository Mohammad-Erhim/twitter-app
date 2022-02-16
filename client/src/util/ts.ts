export interface User{
    _id: string,
    name: string,
    email: string,
    avatar?: string,
    cover?: string,
    created_at:string,
    updated_at: string,
    _v:number,
  } 

  export interface Tweet {
    _id: string,
    text: string,
    liked: boolean,
    likesCount: number,
    repliesCount: number,
    images: string[],
    userRef: string,
    createdAt: string,
    updatedAt: string,
    _v: number,
    
  }
  
  export interface Reply {
  
    _id: string,
    text: string,
    createdAt: string,
    updatedAt: string,
    userRef: string,
    tweetRef: string,
    _v: number,
  
  }