import { HttpResponse, http } from 'msw';
import { setupWorker } from 'msw/browser';

const MOCKED_POSTS = [
  { id: 1, title: 'First post' },
  { id: 2, title: 'Second post' },
];

export const handlers = [
  http.get('https://simple2B.dummy/posts', () => {
    return HttpResponse.json(MOCKED_POSTS);
  }),
  http.post('https://simple2B.dummy/posts', async ({ request }) => {
    const newPost = (await request.json()) as { title: string };

    if (!newPost.title) {
      return HttpResponse.json(null, {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'X-Error-Message': 'Title is required',
        },
      });
    }

    const id = MOCKED_POSTS.length + 1;

    MOCKED_POSTS.push({ id, title: newPost.title });

    return HttpResponse.json(newPost, { status: 201 });
  }),
  http.delete('https://simple2B.dummy/posts/:id', ({ params }) => {
    const { id } = params;

    const deletedPost = MOCKED_POSTS.find((post) => post.id === Number(id));

    if (!deletedPost) {
      return HttpResponse.json(null, { status: 404 });
    }

    MOCKED_POSTS.splice(MOCKED_POSTS.indexOf(deletedPost), 1);

    return HttpResponse.json(deletedPost, {
      status: 200,
    });
  }),
];

export const worker = setupWorker(...handlers);
