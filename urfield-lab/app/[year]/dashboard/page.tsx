'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { getYearBySlug, getWorkingGroups, getAuthorsByYear, getArticlesByAuthor, WorkingGroup, Author, Article, getAuthorById, getUnverifiedArticles, getUnverifiedAuthors } from '@/sanity/sanity-utils';
import Image from 'next/image';
import React from 'react';
import ArticleForm from '@/components/ArticleForm'; // Import the new component
import Link from 'next/link';
import ArticlePreview from '@/components/ArticlePreview';
import ArticleBody from '@/components/ArticleBody';

type Props = {
    params: Promise<{ year: string }>;
};

export default function DashboardPage({ params }: Props) {
  const unwrappedParams = React.use(params);
  const { user, isLoading, login, logout, signup } = useAuth();
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [yearData, setYearData] = useState<{ _id: string, slug: { current: string } } | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [authorProfile, setAuthorProfile] = useState<Author | null>(null);
    const loginFormRef = useRef<HTMLFormElement>(null);
    const signupFormRef = useRef<HTMLFormElement>(null);

    // State for article management
    const [view, setView] = useState<'dashboard' | 'create' | 'editList' | 'editForm' | 'verifyArticles' | 'verifyAuthors'>('dashboard');
    const [userArticles, setUserArticles] = useState<Article[]>([]);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [availableWGs, setAvailableWGs] = useState<WorkingGroup[]>([]);
    const [availableAuthors, setAvailableAuthors] = useState<Author[]>([]);
    const [isPublishing, setIsPublishing] = useState(false); // New state for loading
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Admin state
    const [unverifiedArticles, setUnverifiedArticles] = useState<Article[]>([]);
    const [unverifiedAuthors, setUnverifiedAuthors] = useState<Author[]>([]);
    const [previewData, setPreviewData] = useState<Article | null>(null);
    const [previewType, setPreviewType] = useState<'preview' | 'body' | null>(null);
     
    useEffect(() => {
        if (unwrappedParams.year) {
            getYearBySlug(unwrappedParams.year).then(data => {
                setYearData(data);
                if (data) {
                    getWorkingGroups(data._id).then(setAvailableWGs);
                    getAuthorsByYear(data._id).then(setAvailableAuthors);
                }
            });
        }
    }, [unwrappedParams.year]);

    useEffect(() => {
        if (user?._id) {
            getAuthorById(user._id).then(setAuthorProfile);
            if (view === 'editList') {
                getArticlesByAuthor(user._id).then(setUserArticles);
            }
            if (authorProfile?.isAdmin && yearData) {
                if (view === 'verifyArticles') {
                    getUnverifiedArticles(yearData._id).then(setUnverifiedArticles);
                }
                if (view === 'verifyAuthors') {
                    getUnverifiedAuthors(yearData._id).then(setUnverifiedAuthors);
                }
            }
        } else {
            setAuthorProfile(null);
        }
    }, [view, user, authorProfile?.isAdmin, yearData]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);


 const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    if (!yearData) {
      setError("Could not determine the event year. Please try again later.");
      setIsSubmitting(false);
      return;
    }
    formData.append('yearId', yearData._id);

    const result = await signup(formData);

    if (result.success) {
        setMessage(result.message || 'Signup successful!');
        signupFormRef.current?.reset();
        setIsSigningUp(false); // Go back to login view
    } else {
        setError(result.error || 'An unknown error occurred.');
    }
    setIsSubmitting(false);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const login_name = formData.get('login_name') as string;
    const password = formData.get('password') as string;

    const result = await login(login_name, password);

    if (result.success) {
      setMessage('Login successful!');
      loginFormRef.current?.reset();
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
    setIsSubmitting(false);
  };

  const handlePublishArticle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsPublishing(true);

        if (!yearData || !user) {
            setError("Cannot publish: Missing user or year information.");
            setIsPublishing(false);
            return;
        }

        const formData = new FormData(e.currentTarget);
        formData.append('yearId', yearData._id);
        
        // Ensure the current user is always in the author list
        const authorIds = JSON.parse(formData.get('authors') as string);
        if (!authorIds.includes(user._id)) {
            authorIds.unshift(user._id);
        }
        formData.set('authors', JSON.stringify(authorIds));

        // Add existing article ID if editing
        if (editingArticle?._id) {
            formData.append('articleId', editingArticle._id);
        }
        
        // The fileMap is attached to the form element in ArticleForm.tsx
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fileMap = (e.currentTarget as any).fileMap as Map<string, File>;
        if (fileMap) {
            // Append files using their block _key as the field name, which the API expects
            fileMap.forEach((file, key) => {
                formData.append(key, file, file.name);
            });
        }

        try {
            // Use the correct API endpoint
            const response = await fetch('/api/articles', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                // Use the error message from the API response
                throw new Error(result.message || 'Failed to publish article');
            }

            setMessage('Article published successfully!');
            setView('dashboard');
            setEditingArticle(null);
            // Refresh user articles
            const updatedArticles = await getArticlesByAuthor(user._id);
            setUserArticles(updatedArticles);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred during publishing.');
        } finally {
            setIsPublishing(false);
        }
    };

  const handleVerifyDocument = async (documentId: string, type: 'author' | 'article') => {
    setMessage('');
    setError('');
    try {
        const res = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documentId, type }),
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Verification failed');
        }

        setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} verified successfully!`);
        if (type === 'article') {
            setUnverifiedArticles(prev => prev.filter(a => a._id !== documentId));
        } else {
            setUnverifiedAuthors(prev => prev.filter(a => a._id !== documentId));
        }
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  const openEditForm = (article: Article) => {
    setEditingArticle(article);
    setView('editForm');
  }

  const PreviewModal = () => {
    if (!previewData || !previewType) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={() => setPreviewData(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-bold">{previewType === 'preview' ? 'Article Preview' : 'Article Body Preview'}</h3>
                    <button onClick={() => setPreviewData(null)} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-2xl font-bold">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto flex-grow">
                    {previewType === 'preview' && (
                        <ArticlePreview article={previewData} yearSlug={unwrappedParams.year} imageOrder="md:order-last" textOrder="md:order-first" />
                    )}
                    {previewType === 'body' && (
                        <ArticleBody body={previewData.body || []} youtubeVideoUrl={previewData.youtubeVideoUrl} />
                    )}
                </div>
            </div>
        </div>
    );
  };

  // Custom Navbar for Dashboard
  const DashboardNav = () => (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <Link 
                href="/studio" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
            >
                Content Management
            </Link>
          </div>
          {user && (
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center gap-3">
                <span className="text-gray-800 dark:text-gray-200 hidden sm:block">{user.name}</span>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition">
                  <Image
                    className="h-8 w-8 rounded-full object-cover"
                    src={user.pictureURL || '/default profile pic.webp'}
                    alt="User avatar"
                    width={32}
                    height={32}
                  />
                </button>
              </div>
              {isDropdownOpen && authorProfile && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900 truncate">{authorProfile.name}</p>
                      <p className="text-sm text-gray-500 truncate">{authorProfile.email}</p>
                      {authorProfile.role && <p className="text-sm text-gray-500 truncate">{authorProfile.role}</p>}
                    </div>
                    <button
                      onClick={() => { logout(); setIsDropdownOpen(false); }}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div>
      <DashboardNav />
      <PreviewModal />
      <main className="max-w-7xl mx-auto p-8 sm:p-12">
        {!user ? (
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {isSigningUp ? (
                <form ref={signupFormRef} onSubmit={handleSignup} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                  <h2 className="text-2xl mb-4 text-center font-bold">Sign Up</h2>
                  {error && <p className="my-4 text-center text-red-500">{error}</p>}
                  {message && <p className="my-4 text-center text-green-500">{message}</p>}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Full Name</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" name="name" type="text" placeholder="Full Name" required />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login_name_signup">Login Name</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="login_name_signup" name="login_name" type="text" placeholder="Login Name" required autoComplete="username" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email (Optional)</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" name="email" type="email" placeholder="Email" autoComplete="email" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password_signup">Password</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password_signup" name="password" type="password" placeholder="******************" required autoComplete="new-password" />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">Role (e.g., Researcher) (Optional)</label>
                      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="role" name="role" type="text" placeholder="Role" />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="institute">Institute (Optional)</label>
                      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="institute" name="institute" type="text" placeholder="Institute" />
                  </div>
                  <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">Bio (Optional)</label>
                      <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24" id="bio" name="bio" placeholder="A short biography..."></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="picture">Profile Picture (Optional)</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="picture" name="picture" type="file" accept="image/*" />
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-400" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                    </button>
                    <button type="button" onClick={() => { setIsSigningUp(false); setError(''); setMessage(''); loginFormRef.current?.reset(); }} className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800" disabled={isSubmitting}>
                      Already have an account?
                    </button>
                  </div>
                </form>
              ) : (
                <form ref={loginFormRef} onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                  <h2 className="text-2xl mb-4 text-center font-bold">Login</h2>
                  {error && <p className="my-4 text-center text-red-500">{error}</p>}
                  {message && <p className="my-4 text-center text-green-500">{message}</p>}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login_name">Login Name</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="login_name" name="login_name" type="text" placeholder="Login Name" required autoComplete="username" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" name="password" type="password" placeholder="******************" required autoComplete="current-password" />
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-400" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </button>
                    <button type="button" onClick={() => { setIsSigningUp(true); setError(''); setMessage(''); signupFormRef.current?.reset(); }} className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800" disabled={isSubmitting}>
                      Register as an Author
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div>
            {view === 'dashboard' && (
                <div>
                    <h2 className="text-3xl font-bold">Welcome, {user.name}!</h2>
                    <p>This is your dashboard. What would you like to do?</p>
                    {message && <p className="my-4 text-center text-green-500">{message}</p>}
                    {error && <p className="my-4 text-center text-red-500">{error}</p>}
                    <div className="mt-8 flex gap-4 flex-wrap">
                        <button onClick={() => { setView('create'); setMessage(''); setError(''); }} className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create Article</button>
                        <button onClick={() => setView('editList')} className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700">Edit My Articles</button>
                        {authorProfile?.isAdmin && (
                            <>
                                <button onClick={() => setView('verifyArticles')} className="py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Verify Articles</button>
                                <button onClick={() => setView('verifyAuthors')} className="py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Verify Authors</button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {(view === 'create' || view === 'editForm') && (
                <div className="flex justify-center">
                    <ArticleForm
                        key={editingArticle?._id || 'create'}
                        article={editingArticle}
                        availableAuthors={availableAuthors}
                        availableWGs={availableWGs}
                        user={user}
                        yearSlug={unwrappedParams.year}
                        onSubmit={handlePublishArticle}
                        onCancel={() => { setView('dashboard'); setEditingArticle(null); }}
                        isPublishing={isPublishing}
                    />
                </div>
            )}

            {view === 'editList' && (
                <div>
                    <h2 className="text-2xl font-bold">Edit My Articles</h2>
                    <button onClick={() => setView('dashboard')} className="text-sm text-blue-600 hover:underline mt-2 mb-4">Back to Dashboard</button>
                    <div className="space-y-4">
                        {userArticles.length > 0 ? (
                            userArticles.map(article => (
                                <div key={article._id} className="p-4 border rounded-md flex justify-between items-center">
                                    <span>{article.title}</span>
                                    <button onClick={() => { openEditForm(article); setMessage(''); setError(''); }} className="py-1 px-3 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">Edit</button>
                                </div>
                            ))
                        ) : (
                            <p>You have not been listed as an author on any articles for this year.</p>
                        )}
                    </div>
                </div>
            )}

            {view === 'verifyArticles' && authorProfile?.isAdmin && (
                 <div>
                    <h2 className="text-2xl font-bold">Verify Articles</h2>
                    <button onClick={() => setView('dashboard')} className="text-sm text-blue-600 hover:underline mt-2 mb-4">Back to Dashboard</button>
                    <div className="space-y-4">
                        {unverifiedArticles.length > 0 ? (
                            unverifiedArticles.map(article => (
                                <div key={article._id} className="p-4 border rounded-md flex justify-between items-center">
                                    <span>{article.title}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setPreviewData(article); setPreviewType('preview'); }} className="py-1 px-3 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600">Preview</button>
                                        {article.hasBody && <button onClick={() => { setPreviewData(article); setPreviewType('body'); }} className="py-1 px-3 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600">Body</button>}
                                        <button onClick={() => handleVerifyDocument(article._id, 'article')} className="py-1 px-3 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">Verify</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No unverified articles found for this year.</p>
                        )}
                    </div>
                </div>
            )}

            {view === 'verifyAuthors' && authorProfile?.isAdmin && (
                 <div>
                    <h2 className="text-2xl font-bold">Verify Authors</h2>
                    <button onClick={() => setView('dashboard')} className="text-sm text-blue-600 hover:underline mt-2 mb-4">Back to Dashboard</button>
                    <div className="space-y-4">
                        {unverifiedAuthors.length > 0 ? (
                            unverifiedAuthors.map(author => (
                                <div key={author._id} className="p-4 border rounded-md flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Image src={author.pictureURL || '/default profile pic.webp'} alt={author.name} width={40} height={40} className="rounded-full" />
                                        <span>{author.name}</span>
                                    </div>
                                    <button onClick={() => handleVerifyDocument(author._id, 'author')} className="py-1 px-3 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">Verify</button>
                                </div>
                            ))
                        ) : (
                            <p>No unverified authors found for this year.</p>
                        )}
                    </div>
                </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
