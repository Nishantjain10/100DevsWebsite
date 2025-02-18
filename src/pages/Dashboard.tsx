import { useEffect, useState } from 'react';
import { account, databases, storage } from '../config/appwrite';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ID, Query } from 'appwrite';
import { DATABASE_ID, COLLECTION_IDS } from '../config/appwrite';

interface Comment {
  $id: string;
  content: string;
  author: string;
  authorName: string;
  createdAt: string;
}

interface Post {
  $id: string;
  title: string;
  content: string;
  author: string;
  authorName: string;
  createdAt: string;
  likes: number;
  shareCount: number;
  tags?: string[];
  comments?: Comment[];
}

interface Resource {
  $id: string;
  title: string;
  type: 'link' | 'pdf' | 'video';
  url: string;
  author: string;
  authorName: string;
}

type TabType = 'posts' | 'resources' | 'profile' | 'create';
type PostFilter = 'recent' | 'trending';

const TRENDING_MEME_POSTS: Post[] = [
  {
    $id: 'meme1',
    title: 'Why JavaScript is Like a Box of Chocolates',
    content: "You never know what you're gonna get...",
    author: 'meme-master',
    authorName: 'Console.log Enthusiast',
    createdAt: new Date().toISOString(),
    likes: 0,
    shareCount: 420,
    tags: [],
    comments: []
  },
  {
    $id: 'meme2',
    title: 'CSS: Where Dreams Go to Float',
    content: "Just spent 5 hours centering a div. Started with flex, moved to grid, ended up with margin: 0 auto. Sometimes I think CSS stands for Complete Styling Sorcery. 🧙‍♂️ #CSSBattles #DivLife",
    author: 'flex-master',
    authorName: 'Div Whisperer',
    createdAt: new Date().toISOString(),
    likes: 0,
    shareCount: 369,
    tags: [],
    comments: []
  },
  {
    $id: 'meme3',
    title: 'React UseState of Mind',
    content: "My component re-rendered so many times it started a boy band called 'Infinite Loop'. Now taking bookings for your next deployment! 🎸 #ReactJS #InfiniteRerender",
    author: 'hook-life',
    authorName: 'useState Philosopher',
    createdAt: new Date().toISOString(),
    likes: 0,
    shareCount: 666,
    tags: [],
    comments: []
  },
  {
    $id: 'meme4',
    title: 'Git Push & Pray Protocol',
    content: "Just force pushed to main because I'm a rebel. If anyone needs me, I'll be updating my LinkedIn profile. 🚀 #GitLife #YOLODeploy",
    author: 'git-master',
    authorName: 'Branch Breaker',
    createdAt: new Date().toISOString(),
    likes: 0,
    shareCount: 777,
    tags: [],
    comments: []
  },
];

export function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newResource, setNewResource] = useState({ title: '', type: 'link', url: '' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [postFilter, setPostFilter] = useState<PostFilter>('trending');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [openComments, setOpenComments] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await account.get();
        setUser(userData);
        await initializeTrendingPosts();
        await Promise.all([fetchPosts(), fetchResources()]);
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [navigate]);

  const initializeTrendingPosts = async () => {
    try {
      // Check if trending posts exist
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.POSTS,
        [Query.equal('tags', ['trend'])]
      );

      if (response.documents.length === 0) {
        // Create trending posts
        await Promise.all(TRENDING_MEME_POSTS.map(post => 
          databases.createDocument(
            DATABASE_ID,
            COLLECTION_IDS.POSTS,
            ID.unique(),
            {
              title: post.title,
              content: post.content,
              author: 'system',
              authorName: post.authorName,
              likes: 0,
              shareCount: post.shareCount,
              tags: ['trend'],
              comments: []
            }
          )
        ));
        toast.success('Trending posts initialized');
      }
    } catch (error) {
      console.error('Failed to initialize trending posts:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      if (postFilter === 'trending') {
        // Fetch trending posts
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_IDS.POSTS,
          [
            Query.equal('tags', ['trend']), // Use equal instead of search
            Query.orderDesc('shareCount')
          ]
        );
        setPosts(response.documents as Post[]);
      } else {
        // Fetch regular posts
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_IDS.POSTS,
          [
            Query.orderDesc('$createdAt')
          ]
        );

        // Filter out trending posts client-side
        const regularPosts = response.documents.filter(post => 
          !post.tags?.includes('trend')
        );

        setPosts(regularPosts as Post[]);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to fetch posts');
    }
  };

  const fetchResources = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.RESOURCES,
        [Query.orderDesc('$createdAt')]
      );
      setResources(response.documents as Resource[]);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      toast.error('Failed to fetch resources');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.POSTS,
        ID.unique(),
        {
          title: newPost.title,
          content: newPost.content,
          author: user.$id,
          authorName: user.name,
          likes: 0,
          shareCount: 0,
          tags: [],
          comments: []
        }
      );
      setNewPost({ title: '', content: '' });
      toast.success('Post created successfully!');
      fetchPosts();
    } catch (error) {
      console.error('Create post error:', error);
      toast.error('Failed to create post');
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.RESOURCES,
        ID.unique(),
        {
          title: newResource.title,
          type: newResource.type,
          url: newResource.url,
          author: user.$id,
          authorName: user.name,
        }
      );
      setNewResource({ title: '', type: 'link', url: '' });
      toast.success('Resource added successfully!');
      fetchResources();
    } catch (error) {
      toast.error('Failed to add resource');
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleLike = async (post: Post) => {
    if (postFilter === 'trending') {
      // Update local state for trending posts
      const updatedPosts = posts.map(p => 
        p.$id === post.$id ? { ...p, likes: (p.likes || 0) + 1 } : p
      );
      setPosts(updatedPosts);
      toast.success('Post liked!');
      return;
    }

    try {
      const newLikes = (post.likes || 0) + 1;
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.POSTS,
        post.$id,
        { likes: newLikes }
      );

      const updatedPosts = posts.map(p => 
        p.$id === post.$id ? { ...p, likes: newLikes } : p
      );
      setPosts(updatedPosts);
      toast.success('Post liked!');
    } catch (error) {
      console.error('Like error:', error);
      toast.error('Failed to like post');
    }
  };

  const handleComment = (post: Post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
  };

  const submitComment = async () => {
    if (!selectedPost || !commentText.trim()) return;

    try {
      const updatedComments = [
        ...(selectedPost.comments || []),
        `${user.name}: ${commentText}`
      ];

      if (postFilter === 'trending') {
        // Update local state for trending posts
        const updatedPosts = posts.map(p => 
          p.$id === selectedPost.$id ? { ...p, comments: updatedComments } : p
        );
        setPosts(updatedPosts);
      } else {
        // Update database for regular posts
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_IDS.POSTS,
          selectedPost.$id,
          { comments: updatedComments }
        );
        await fetchPosts();
      }

      setCommentText('');
      setShowCommentModal(false);
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleShare = async (post: Post) => {
    try {
      const shareUrl = `${window.location.origin}/post/${post.$id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.content.substring(0, 100) + '...',
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      }

      if (postFilter === 'trending') {
        // Update local state for trending posts
        const updatedPosts = posts.map(p => 
          p.$id === post.$id ? { ...p, shareCount: (p.shareCount || 0) + 1 } : p
        );
        setPosts(updatedPosts);
        return;
      }

      const newShareCount = (post.shareCount || 0) + 1;
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.POSTS,
        post.$id,
        { shareCount: newShareCount }
      );

      const updatedPosts = posts.map(p => 
        p.$id === post.$id ? { ...p, shareCount: newShareCount } : p
      );
      setPosts(updatedPosts);
    } catch (error) {
      toast.error('Failed to share post');
    }
  };

  const toggleComments = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setOpenComments(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const renderPost = (post: Post) => (
    <div key={post.$id} className="bg-white/20 p-6 rounded-xl hover:bg-white/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold">{post.title}</h3>
        {postFilter === 'trending' ? (
          <span className="bg-purple-500 px-2 py-1 rounded-full text-sm">🔥 {post.shareCount}</span>
        ) : (
          post.shareCount > 0 && (
            <span className="text-sm text-white/70">Shared {post.shareCount} times</span>
          )
        )}
      </div>
      <p className="text-sm opacity-70 mb-2">By {post.authorName}</p>
      <p className="text-gray-100">{post.content}</p>
      
      {/* Post actions */}
      <div className="mt-4 flex items-center space-x-4">
        <button 
          onClick={() => handleLike(post)}
          className="text-sm text-white/60 hover:text-white transition-colors flex items-center space-x-1"
        >
          <span>❤️</span>
          <span>{post.likes || 0}</span>
        </button>
        <button 
          onClick={(e) => handleComment(post)}
          className="text-sm text-white/60 hover:text-white transition-colors flex items-center space-x-1"
        >
          <span>💭</span>
          <span>{(post.comments?.length || 0)}</span>
        </button>
        <button 
          onClick={() => handleShare(post)}
          className="text-sm text-white/60 hover:text-white transition-colors flex items-center space-x-1"
        >
          <span>🔄</span>
          <span>{post.shareCount || 0}</span>
        </button>
        {post.comments && post.comments.length > 0 && (
          <button 
            onClick={(e) => toggleComments(post.$id, e)}
            className="text-sm text-white/60 hover:text-white transition-colors flex items-center space-x-1"
          >
            <span>{openComments.includes(post.$id) ? '🔼' : '🔽'}</span>
            <span>Comments ({post.comments.length})</span>
          </button>
        )}
      </div>

      {/* Comments section with accordion */}
      {post.comments && post.comments.length > 0 && openComments.includes(post.$id) && (
        <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold">Comments ({post.comments.length})</h4>
          </div>
          {Array.isArray(post.comments) && post.comments.map((comment, index) => {
            // Handle both string and object comments
            const commentText = typeof comment === 'string' 
              ? comment 
              : `${comment.authorName}: ${comment.content}`;
            
            return (
              <div 
                key={`${post.$id}-comment-${index}`}
                className="bg-white/10 p-3 rounded-lg transition-all duration-300"
              >
                <p className="text-sm">{commentText}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderPosts = () => {
    const currentPosts = posts;
    
    return (
      <>
        {!postFilter.startsWith('trending') && (
          <div className="bg-white/20 p-6 rounded-xl mb-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Share Your Thoughts!</h3>
              <p className="text-gray-100 mb-4">Got something to say? Join the conversation!</p>
              <button
                onClick={() => setActiveTab('create')}
                className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold px-6 py-3 rounded-full shadow-lg transform transition hover:scale-105"
              >
                ✍️ Create a Post
              </button>
            </div>
          </div>
        )}
        {currentPosts.map((post) => renderPost(post))}
      </>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'create':
        return (
          <div className="space-y-8">
            <div className="bg-white/20 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <input
                  type="text"
                  placeholder="Post title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  required
                />
                <textarea
                  placeholder="Write your post..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 h-32"
                  required
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition duration-300"
                >
                  Post
                </button>
              </form>
            </div>

            <div className="bg-white/20 p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Share a Resource</h2>
              <form onSubmit={handleCreateResource} className="space-y-4">
                <input
                  type="text"
                  placeholder="Resource title"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  required
                />
                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource({ ...newResource, type: e.target.value as 'link' | 'pdf' | 'video' })}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                >
                  <option value="link">Link</option>
                  <option value="pdf">PDF</option>
                  <option value="video">Video</option>
                </select>
                <input
                  type="url"
                  placeholder="Resource URL"
                  value={newResource.url}
                  onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  required
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition duration-300"
                >
                  Share Resource
                </button>
              </form>
            </div>
          </div>
        );

      case 'posts':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Community Posts</h2>
              <div className="flex space-x-2 bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setPostFilter('trending')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    postFilter === 'trending'
                      ? 'bg-purple-500 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  🔥 Trending
                </button>
                <button
                  onClick={() => setPostFilter('recent')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    postFilter === 'recent'
                      ? 'bg-purple-500 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  🕒 Recent
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {renderPosts()}
            </div>
          </div>
        );

      case 'resources':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Shared Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource) => (
                <div key={resource.$id} className="bg-white/20 p-6 rounded-xl">
                  <h3 className="text-xl font-bold">{resource.title}</h3>
                  <p className="text-sm opacity-70 mb-2">By {resource.authorName}</p>
                  <p className="text-sm mb-2">Type: {resource.type}</p>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-300 hover:text-yellow-400 underline"
                  >
                    View Resource
                  </a>
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="bg-white/20 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={user.name}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  className="w-full px-4 py-2 rounded-lg bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  disabled
                />
              </div>
              {/* Add more profile fields as needed */}
            </div>
          </div>
        );
    }
  };

  const CommentModal = () => (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={() => setShowCommentModal(false)}
    >
      <div 
        className="bg-white/90 rounded-xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Reply to {selectedPost?.authorName}'s post
        </h3>
        <input
          type="text"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          placeholder="Write your comment..."
          className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
          autoFocus
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => setShowCommentModal(false)}
            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submitComment}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [postFilter, user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600">
      {/* Main Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 h-screen sticky top-0 bg-black/30 backdrop-blur-md p-4 flex flex-col space-y-4 border-r border-white/10">
          {/* Logo */}
          <div className="flex items-center space-x-2 px-4 py-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-xl">100</span>
            </div>
            <span className="font-bold text-xl text-white">devs</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full px-4 py-3 rounded-full flex items-center space-x-3 transition-colors ${
                activeTab === 'posts' 
                  ? 'bg-white/20 text-white font-bold' 
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <span>🏠</span>
              <span>Home</span>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`w-full px-4 py-3 rounded-full flex items-center space-x-3 transition-colors ${
                activeTab === 'resources' 
                  ? 'bg-white/20 text-white font-bold' 
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <span>📚</span>
              <span>Resources</span>
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`w-full px-4 py-3 rounded-full flex items-center space-x-3 transition-colors ${
                activeTab === 'create' 
                  ? 'bg-white/20 text-white font-bold' 
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <span>✍️</span>
              <span>Create</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full px-4 py-3 rounded-full flex items-center space-x-3 transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-white/20 text-white font-bold' 
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <span>👤</span>
              <span>Profile</span>
            </button>
          </nav>

          {/* Post Button */}
          <button
            onClick={() => setActiveTab('create')}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold px-4 py-3 rounded-full transition-colors"
          >
            New Post
          </button>

          {/* User Profile */}
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{user.name[0]}</span>
                </div>
                <div className="text-sm">
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-white/60">@{user.name.toLowerCase().replace(/\s/g, '')}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-white/60 hover:text-white"
              >
                🚪
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen border-x border-white/10 bg-black/30 backdrop-blur-md">
          {/* Header */}
          <div className="sticky top-0 bg-black/40 backdrop-blur-md border-b border-white/10 p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-white">
                {activeTab === 'posts' && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setPostFilter('trending')}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        postFilter === 'trending' 
                          ? 'bg-white/20 text-white' 
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      🔥 Trending
                    </button>
                    <button
                      onClick={() => setPostFilter('recent')}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        postFilter === 'recent' 
                          ? 'bg-white/20 text-white' 
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      ⏰ Recent
                    </button>
                  </div>
                )}
                {activeTab === 'resources' && 'Resources'}
                {activeTab === 'create' && 'Create'}
                {activeTab === 'profile' && 'Profile'}
              </h1>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4">
            {activeTab === 'posts' && renderPosts()}
            {activeTab !== 'posts' && renderTabContent()}
          </div>
        </div>

        {/* Right Sidebar (optional) */}
        <div className="w-80 h-screen sticky top-0 bg-black/30 backdrop-blur-md p-4 hidden lg:block">
          {/* Search */}
          <div className="bg-white/10 rounded-full px-4 py-2 mb-4">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent w-full text-white placeholder-white/60 focus:outline-none"
            />
          </div>

          {/* Trending Topics */}
          <div className="bg-white/10 rounded-xl p-4">
            <h2 className="text-white font-bold mb-4">Trending Topics</h2>
            <div className="space-y-4">
              <div className="text-white/80 hover:text-white cursor-pointer">
                <div className="text-sm text-white/60">#JavaScript</div>
                <div className="font-bold">Why JavaScript is Like a Box of Chocolates</div>
                <div className="text-sm text-white/60">420 posts</div>
              </div>
              {/* Add more trending topics */}
            </div>
          </div>
        </div>
      </div>

      {/* Comment Modal */}
      {showCommentModal && <CommentModal />}
    </div>
  );
} 