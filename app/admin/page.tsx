"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Upload, Save, Trash2 } from 'lucide-react';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    // Config State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    // Post State
    const [editingId, setEditingId] = useState<number | null>(null);
    const [photoUrl, setPhotoUrl] = useState('');
    const [postVideoUrl, setPostVideoUrl] = useState(''); // New video state
    const [photoTitle, setPhotoTitle] = useState('');
    const [photoDescription, setPhotoDescription] = useState('');
    const [extraPhotos, setExtraPhotos] = useState('');
    const [photos, setPhotos] = useState<any[]>([]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchConfig();
            fetchPhotos();
        }
    }, [isAuthenticated]);

    const checkAuth = () => {
        if (password === 'WITNESS_ADMIN' || password === process.env.NEXT_PUBLIC_ADMIN_PASS) {
            setIsAuthenticated(true);
        } else {
            alert('ACCESS DENIED');
        }
    };

    const fetchConfig = async () => {
        const { data } = await supabase.from('leaks_config').select('*').single();
        if (data) {
            setTitle(data.title);
            setDescription(data.description);
            setVideoUrl(data.main_video_url);
        }
    };

    const fetchPhotos = async () => {
        const { data } = await supabase.from('evidence_photos').select('*').order('created_at', { ascending: false });
        if (data) setPhotos(data);
    };

    const handleUpdateConfig = async () => {
        const { error } = await supabase.from('leaks_config').upsert({
            id: 1,
            title,
            description,
            main_video_url: videoUrl
        });
        if (error) alert('Error: ' + error.message);
        else alert('Config updated');
    };

    const handleSavePost = async () => {
        const galleryUrls = extraPhotos.split(/[\n,]+/).map(url => url.trim()).filter(url => url.length > 0);

        const postData = {
            url: photoUrl,
            video_url: postVideoUrl,
            title: photoTitle,
            description: photoDescription,
            caption: photoTitle,
            gallery: galleryUrls
        };

        let error;
        if (editingId) {
            // Update existing
            const { error: updateError } = await supabase
                .from('evidence_photos')
                .update(postData)
                .eq('id', editingId);
            error = updateError;
        } else {
            // Create new
            const { error: insertError } = await supabase
                .from('evidence_photos')
                .insert(postData);
            error = insertError;
        }

        if (error) alert('Error: ' + error.message);
        else {
            alert(editingId ? 'Post updated' : 'Post created');
            resetForm();
            fetchPhotos();
        }
    };

    const handleEditPhoto = (photo: any) => {
        setEditingId(photo.id);
        setPhotoUrl(photo.url || '');
        setPostVideoUrl(photo.video_url || '');
        setPhotoTitle(photo.title || '');
        setPhotoDescription(photo.description || '');
        setExtraPhotos((photo.gallery || []).join('\n'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeletePhoto = async (id: number) => {
        if (!confirm('Delete this post?')) return;
        const { error } = await supabase.from('evidence_photos').delete().eq('id', id);
        if (error) alert('Error: ' + error.message);
        else fetchPhotos();
    };

    const handleClearChat = async () => {
        if (!confirm('WARNING: This will delete ALL chat messages. Are you sure?')) return;
        const { error } = await supabase.from('comments').delete().neq('id', 0); // Delete all
        if (error) alert('Error: ' + error.message);
        else alert('Chat cleared');
    };

    const resetForm = () => {
        setEditingId(null);
        setPhotoUrl('');
        setPostVideoUrl('');
        setPhotoTitle('');
        setPhotoDescription('');
        setExtraPhotos('');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="border border-neon-red p-8 bg-gray-900 max-w-md w-full text-center space-y-4">
                    <Lock className="w-12 h-12 text-neon-red mx-auto mb-4 animate-pulse" />
                    <h1 className="text-2xl font-bold text-neon-red glitch-text">RESTRICTED AREA</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="ENTER PASSCODE"
                        className="w-full bg-black border border-gray-700 p-2 text-center text-neon-red focus:border-neon-red outline-none"
                    />
                    <button
                        onClick={checkAuth}
                        className="w-full bg-blood-red text-white py-2 font-bold hover:bg-neon-red transition-colors"
                    >
                        AUTHENTICATE
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8 min-h-screen bg-black text-white">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-bold text-neon-red">ADMIN CONSOLE</h1>
                <div className="flex gap-4">
                    <button onClick={handleClearChat} className="text-red-500 hover:text-red-400 font-bold border border-red-900 px-3 py-1 rounded bg-red-900/20">
                        CLEAR CHAT
                    </button>
                    <button onClick={() => setIsAuthenticated(false)} className="text-gray-500 hover:text-white">LOGOUT</button>
                </div>
            </div>

            {/* Config Section */}
            <section className="space-y-4 border border-gray-800 p-6 rounded bg-gray-900/50">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Save className="w-5 h-5" /> Main Configuration
                </h2>
                <div className="space-y-2">
                    <label className="block text-xs text-gray-500">Global Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-black border border-gray-700 p-2"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-xs text-gray-500">Global Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-black border border-gray-700 p-2 h-24"
                    />
                </div>
                <button
                    onClick={handleUpdateConfig}
                    className="bg-white text-black px-4 py-2 font-bold hover:bg-gray-200 text-sm"
                >
                    UPDATE GLOBAL CONFIG
                </button>
            </section>

            {/* Posts Management */}
            <section className="space-y-6 border border-gray-800 p-6 rounded bg-gray-900/50">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Upload className="w-5 h-5" /> {editingId ? 'Edit Post' : 'Create New Post'}
                </h2>

                {/* Form */}
                <div className="space-y-4 border-b border-gray-800 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-xs text-gray-500">Title</label>
                            <input
                                value={photoTitle}
                                onChange={(e) => setPhotoTitle(e.target.value)}
                                className="w-full bg-black border border-gray-700 p-2"
                                placeholder="Post Title"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs text-gray-500">Main Image URL (Required)</label>
                            <input
                                value={photoUrl}
                                onChange={(e) => setPhotoUrl(e.target.value)}
                                className="w-full bg-black border border-gray-700 p-2"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="col-span-full space-y-2">
                            <label className="block text-xs text-gray-500">Video URL (Optional - Replaces Image)</label>
                            <input
                                value={postVideoUrl}
                                onChange={(e) => setPostVideoUrl(e.target.value)}
                                className="w-full bg-black border border-gray-700 p-2"
                                placeholder="https://... (mp4/webm)"
                            />
                        </div>
                        <div className="col-span-full space-y-2">
                            <label className="block text-xs text-gray-500">Extra Photos (Gallery) - One URL per line</label>
                            <textarea
                                value={extraPhotos}
                                onChange={(e) => setExtraPhotos(e.target.value)}
                                className="w-full bg-black border border-gray-700 p-2 h-24 font-mono text-xs"
                                placeholder="https://...&#10;https://..."
                            />
                        </div>
                        <div className="col-span-full space-y-2">
                            <label className="block text-xs text-gray-500">Description</label>
                            <textarea
                                value={photoDescription}
                                onChange={(e) => setPhotoDescription(e.target.value)}
                                className="w-full bg-black border border-gray-700 p-2 h-24"
                                placeholder="Post content..."
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSavePost}
                            className="bg-neon-red text-white px-6 py-2 font-bold hover:bg-blood-red transition-colors flex-1 md:flex-none"
                        >
                            {editingId ? 'UPDATE POST' : 'PUBLISH POST'}
                        </button>
                        {editingId && (
                            <button
                                onClick={resetForm}
                                className="bg-gray-800 text-white px-6 py-2 font-bold hover:bg-gray-700 transition-colors"
                            >
                                CANCEL
                            </button>
                        )}
                    </div>
                </div>

                {/* List Posts */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-400">EXISTING POSTS</h3>
                    <div className="space-y-2">
                        {photos.map((photo) => (
                            <div key={photo.id} className="flex items-center gap-4 bg-black p-3 border border-gray-800 rounded hover:border-gray-600 transition-colors">
                                <img src={photo.url} alt="" className="w-12 h-12 object-cover rounded bg-gray-800" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-white truncate">{photo.title || 'Untitled'}</p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {photo.video_url && '🎥 '}
                                        {photo.description || photo.caption || 'No description'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditPhoto(photo)}
                                        className="p-2 text-blue-500 hover:bg-blue-900/20 rounded transition-colors"
                                        title="Edit Post"
                                    >
                                        <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeletePhoto(photo.id)}
                                        className="p-2 text-red-500 hover:bg-red-900/20 rounded transition-colors"
                                        title="Delete Post"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {photos.length === 0 && <p className="text-gray-500 italic text-sm">No posts found.</p>}
                    </div>
                </div>
            </section>
        </div>
    );
}
