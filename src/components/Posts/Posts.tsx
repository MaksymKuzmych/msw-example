import { useEffect, useState } from 'react';

interface Post {
  id: number;
  title: string;
}

export const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const [newPostTitle, setNewPostTitle] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://simple2B.dummy/posts')
      .then((response) => response.json())
      .then((json) => setPosts(json));
  }, []);

  const deletePost = async (id: number) => {
    await fetch(`https://simple2B.dummy/posts/${id}`, {
      method: 'DELETE',
    });

    fetch('https://simple2B.dummy/posts')
      .then((response) => response.json())
      .then((json) => setPosts(json));
  };

  const postsLayout = posts.map((post) => {
    const deleteHandler = () => deletePost(post.id);

    return (
      <div key={post.id} data-testid='post'>
        <h2>{post.id}</h2>
        <p>{post.title}</p>
        <button onClick={deleteHandler}>Delete</button>
      </div>
    );
  });

  const addNewPost = async () => {
    try {
      const req = await fetch('https://simple2B.dummy/posts', {
        method: 'POST',
        body: JSON.stringify({ title: newPostTitle }),
      });

      if (req.status === 400) {
        throw new Error('Bad request');
      }

      setNewPostTitle('');

      fetch('https://simple2B.dummy/posts')
        .then((response) => response.json())
        .then((json) => setPosts(json));
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  return (
    <div>
      {postsLayout}
      <input
        value={newPostTitle}
        onChange={(e) => setNewPostTitle(e.target.value)}
        data-testid='myInput'
      />
      <button onClick={addNewPost} data-testid='button'>
        Add new post
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};
