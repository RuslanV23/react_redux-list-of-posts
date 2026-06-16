import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Post } from '../../types/Post';
import { getUserPosts } from '../../api/posts';

type PostsState =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; posts: Post[] }
  | { type: 'failed'; error: string };

const initialState: PostsState = { type: 'idle' } as PostsState;

export const init = createAsyncThunk('posts/fetch', async (userId: number) => {
  const posts = await getUserPosts(userId);

  return posts;
});

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(init.pending, () => {
        // console.log('fff');

        return { type: 'loading' };
      })
      .addCase(init.fulfilled, (_, action) => {
        return { type: 'success', posts: action.payload };
      })
      .addCase(init.rejected, (_, action) => {
        return {
          type: 'failed',
          error: action.error.message ?? 'Unknown error',
        };
      }),
});
