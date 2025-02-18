export interface Post {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    title: string;
    content: string;
    author: string;
    authorName: string;
    likes: number;
    shareCount: number;
    tags?: string[];
    comments?: string[];
}

export interface Resource {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    title: string;
    type: 'link' | 'pdf' | 'video';
    url: string;
    author: string;
    authorName: string;
    description?: string;
}

export interface Comment {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    content: string;
    author: string;
    authorName: string;
    postId: string;
    likes: number;
}

export interface UserProfile {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    userId: string;
    bio?: string;
    avatar?: string;
    socialLinks?: string[];
    skills?: string[];
} 