import { databases, DATABASE_ID, COLLECTION_IDS } from '../config/appwrite';
import { ID, Query } from 'appwrite';
import type { Post, Resource, Comment, UserProfile } from '../types/database';

// Posts
export const getPosts = async () => {
    try {
        console.log('Fetching posts with:', {
            databaseId: DATABASE_ID,
            collectionId: COLLECTION_IDS.POSTS,
            projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID // Debug log
        });
        
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_IDS.POSTS,
            [Query.orderDesc('$createdAt')]
        );
        return response.documents as Post[];
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
};

export const createPost = async (data: Omit<Post, '$id' | '$createdAt' | '$updatedAt'>) => {
    try {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTION_IDS.POSTS,
            ID.unique(),
            data
        );
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

// Resources
export const getResources = async () => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_IDS.RESOURCES,
            [Query.orderDesc('$createdAt')]
        );
        return response.documents as Resource[];
    } catch (error) {
        console.error('Error fetching resources:', error);
        return [];
    }
};

export const createResource = async (data: Omit<Resource, '$id' | '$createdAt' | '$updatedAt'>) => {
    try {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTION_IDS.RESOURCES,
            ID.unique(),
            data
        );
    } catch (error) {
        console.error('Error creating resource:', error);
        throw error;
    }
};

// Comments
export const getPostComments = async (postId: string) => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_IDS.COMMENTS,
            [
                Query.equal('postId', postId),
                Query.orderDesc('$createdAt')
            ]
        );
        return response.documents as Comment[];
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
};

export const createComment = async (data: Omit<Comment, '$id' | '$createdAt' | '$updatedAt'>) => {
    try {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTION_IDS.COMMENTS,
            ID.unique(),
            data
        );
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
};

// User Profiles
export const getUserProfile = async (userId: string) => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_IDS.PROFILES,
            [Query.equal('userId', userId)]
        );
        return response.documents[0] as UserProfile;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
};

export const createUserProfile = async (data: Omit<UserProfile, '$id' | '$createdAt' | '$updatedAt'>) => {
    try {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTION_IDS.PROFILES,
            ID.unique(),
            data
        );
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
};

// Initialize collections if they don't exist
export const initializeCollections = async () => {
    try {
        // Check if collections exist first to avoid errors
        const collections = await databases.listCollections(DATABASE_ID);
        const existingCollections = collections.collections.map(c => c.$id);

        // Create Resources collection if it doesn't exist
        if (!existingCollections.includes(COLLECTION_IDS.RESOURCES)) {
            await databases.createCollection(
                DATABASE_ID,
                COLLECTION_IDS.RESOURCES,
                'Resources',
                ["read(\"any\")", "create(\"any\")", "update(\"any\")", "delete(\"any\")"]
            );
        }

        // Create Comments collection if it doesn't exist
        if (!existingCollections.includes(COLLECTION_IDS.COMMENTS)) {
            await databases.createCollection(
                DATABASE_ID,
                COLLECTION_IDS.COMMENTS,
                'Comments',
                ["read(\"any\")", "create(\"any\")", "update(\"any\")", "delete(\"any\")"]
            );
        }

        // Create Profiles collection if it doesn't exist
        if (!existingCollections.includes(COLLECTION_IDS.PROFILES)) {
            await databases.createCollection(
                DATABASE_ID,
                COLLECTION_IDS.PROFILES,
                'User Profiles',
                ["read(\"any\")", "create(\"any\")", "update(\"any\")", "delete(\"any\")"]
            );
        }

        console.log('Collections initialized successfully');
    } catch (error) {
        console.error('Error initializing collections:', error);
    }
};

// Call this when your app starts
initializeCollections(); 