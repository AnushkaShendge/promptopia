'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Profile from '@components/Profile';

const MyProfile = () => {
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);
    const router = useRouter();

    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`);
    };

    const handleDelete = async (post) => {
        const hasConfirmed = confirm('Are you sure you want to delete this prompt?');
        if (hasConfirmed) {
            try {
                const res = await fetch(`/api/prompt/${post._id}`, {
                    method: 'DELETE',
                });
                if (res.ok) { 
                    const filteredPrompts = posts.filter((p) => p._id !== post._id);
                    setPosts(filteredPrompts);
                } else {
                    console.error("Failed to delete prompt.");
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    async function fetchPrompts() {
        try {
            const res = await fetch(`/api/users/${session?.user.id}/posts`);
            const data = await res.json();
            setPosts(data);
        } catch (e) {
            console.error("Error fetching prompts:", e);
        }
    }

    useEffect(() => {
        if (session?.user.id) fetchPrompts();
    }, [session?.user.id]);

    return (
        <Profile
            name="My"
            desc="Welcome to your personal profile"
            data={posts}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />
    );
};

export default MyProfile;
