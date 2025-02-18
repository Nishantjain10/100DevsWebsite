import { Client, Databases } from 'appwrite';
import { ID } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);
const DATABASE_ID = '67afdbad80263aa6ad91';

async function initializeDatabase() {
    try {
        // Resources Collection
        const resourcesCollection = await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            'Resources',
            ["read(\"any\")", "create(\"any\")", "update(\"any\")", "delete(\"any\")"]
        );

        await databases.createStringAttribute(DATABASE_ID, resourcesCollection.$id, 'title', 100, true);
        await databases.createEnumAttribute(DATABASE_ID, resourcesCollection.$id, 'type', ['link', 'pdf', 'video'], true);
        await databases.createUrlAttribute(DATABASE_ID, resourcesCollection.$id, 'url', true);
        await databases.createStringAttribute(DATABASE_ID, resourcesCollection.$id, 'author', 36, true);
        await databases.createStringAttribute(DATABASE_ID, resourcesCollection.$id, 'authorName', 100, true);
        await databases.createStringAttribute(DATABASE_ID, resourcesCollection.$id, 'description', 1000, false);

        // Comments Collection
        const commentsCollection = await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            'Comments',
            ["read(\"any\")", "create(\"any\")", "update(\"any\")", "delete(\"any\")"]
        );

        await databases.createStringAttribute(DATABASE_ID, commentsCollection.$id, 'content', 1000, true);
        await databases.createStringAttribute(DATABASE_ID, commentsCollection.$id, 'author', 36, true);
        await databases.createStringAttribute(DATABASE_ID, commentsCollection.$id, 'authorName', 100, true);
        await databases.createStringAttribute(DATABASE_ID, commentsCollection.$id, 'postId', 36, true);
        await databases.createIntegerAttribute(DATABASE_ID, commentsCollection.$id, 'likes', false, 0, 0);

        // User Profiles Collection
        const profilesCollection = await databases.createCollection(
            DATABASE_ID,
            ID.unique(),
            'User Profiles',
            ["read(\"any\")", "create(\"any\")", "update(\"any\")", "delete(\"any\")"]
        );

        await databases.createStringAttribute(DATABASE_ID, profilesCollection.$id, 'userId', 36, true);
        await databases.createStringAttribute(DATABASE_ID, profilesCollection.$id, 'bio', 500, false);
        await databases.createStringAttribute(DATABASE_ID, profilesCollection.$id, 'avatar', 36, false);
        await databases.createStringAttribute(DATABASE_ID, profilesCollection.$id, 'socialLinks', 255, false, null, true);
        await databases.createStringAttribute(DATABASE_ID, profilesCollection.$id, 'skills', 100, false, null, true);

        // Create indexes
        await databases.createIndex(DATABASE_ID, resourcesCollection.$id, 'type_index', 'key', ['type']);
        await databases.createIndex(DATABASE_ID, resourcesCollection.$id, 'author_index', 'key', ['author']);
        await databases.createIndex(DATABASE_ID, commentsCollection.$id, 'post_author_index', 'key', ['postId', 'author']);
        await databases.createIndex(DATABASE_ID, profilesCollection.$id, 'userId_index', 'unique', ['userId']);

        console.log('Database initialization completed successfully!');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

export { initializeDatabase, DATABASE_ID }; 