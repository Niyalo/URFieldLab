'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { getYearBySlug, getWorkingGroups, getAuthorsByYear, getArticlesByAuthor, WorkingGroup, Author, Article, getAuthorById } from '@/sanity/sanity-utils';
import Image from 'next/image';
import React from 'react';
import ArticleForm from '@/components/ArticleForm'; // Import the new component
import Link from 'next/link';

type Props = {
    params: Promise<{ year: string }>;
};

export default function DashboardPage({ params }: Props) {
    const unwrappedParams = React.use(params);
    const { user, isLoading, login, logout } = useAuth();
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [yearData, setYearData] = useState<{ _id: string, slug: { current: string } } | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [authorProfile, setAuthorProfile] = useState<Author | null>(null);

    // State for article management
    const [view, setView] = useState<'dashboard' | 'create' | 'editList' | 'editForm'>('dashboard');
    const [userArticles, setUserArticles] = useState<Article[]>([]);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [availableWGs, setAvailableWGs] = useState<WorkingGroup[]>([]);
    const [availableAuthors, setAvailableAuthors] = useState<Author[]>([]);
    const [isPublishing, setIsPublishing] = useState(false); // New state for loading
     
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
        } else {
            setAuthorProfile(null);
        }
    }, [view, user]);

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
    const formData = new FormData(e.currentTarget);

    if (!yearData) {
      setError("Could not determine the event year. Please try again later.");
      return;
    }
    formData.append('yearId', yearData._id);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: formData, // Send FormData directly
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setIsSigningUp(false);
      } else {
        setError(data.message || 'An error occurred during signup.');
      }
    } catch {
      setError('An unexpected error occurred.');
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const formData = new FormData(e.currentTarget);
    const login_name = formData.get('login_name') as string;
    const password = formData.get('password') as string;

    try {
      const data = await login(login_name, password);
      if (data.error) {
        setError(data.error);
      }
    } catch {
      setError('An unexpected error occurred.');
    }
  };

    const handlePublishArticle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsPublishing(true);

    if (!yearData || !user) {
        setError("Cannot publish article: missing year or user data.");
        setIsPublishing(false);
        return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append('yearId', yearData._id);
    
    const authorIds = JSON.parse(formData.get('authors') as string);
    if (!authorIds.includes(user._id)) {
        authorIds.unshift(user._id);
    }
    formData.set('authors', JSON.stringify(authorIds));

    const wgIds = JSON.parse(formData.get('workingGroups') as string);
    formData.set('workingGroups', JSON.stringify(wgIds));

    const fileMap = (e.currentTarget as any).fileMap as Map<string, File>;
    fileMap.forEach((file, key) => {
        formData.append(key, file);
    });

    const bodyContent = formData.get('body');
    if (bodyContent) {
        formData.set('body', bodyContent);
    }

    if (editingArticle) {
        formData.append('articleId', editingArticle._id);
    }

    try {
        const res = await fetch('/api/articles', {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();
        if (res.ok) {
            setMessage(data.message);
            setView('dashboard');
            setEditingArticle(null);
        } else {
            setError(data.message || 'An error occurred during publishing.');
            // Keep the form open on error so the user can see what went wrong
        }
    } catch {
        setError('An unexpected error occurred.');
    } finally {
        setIsPublishing(false);
    }
  };
  const openEditForm = (article: Article) => {
    setEditingArticle(article);
    setView('editForm');
  }

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
                    src={user.pictureURL || '/default-avatar.png'}
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
      <main className="max-w-7xl mx-auto p-8 sm:p-12">
        {!user ? (
          <div className="flex justify-center">
            {/* Login/Signup Form remains the same */}
          </div>
        ) : (
          <div>
            {view === 'dashboard' && (
                <div>
                    <h2 className="text-3xl font-bold">Welcome, {user.name}!</h2>
                    <p>This is your dashboard. What would you like to do?</p>
                    {message && <p className="my-4 text-center text-green-500">{message}</p>}
                    {error && <p className="my-4 text-center text-red-500">{error}</p>}
                    <div className="mt-8 flex gap-4">
                        <button onClick={() => { setView('create'); setMessage(''); setError(''); }} className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create Article</button>
                        <button onClick={() => setView('editList')} className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700">Edit My Articles</button>
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
          </div>
        )}
      </main>
    </div>
  );
}
