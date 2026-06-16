import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createComment,
  deleteComment,
  getPostComments,
} from '../../api/comments';
import { Comment } from '../../types/Comment';

type CommentsState = {
  items: Comment[];
  loading: boolean;
  error: string | null;
};

const initialState: CommentsState = {
  items: [],
  loading: false,
  error: null,
} as CommentsState;

export const init = createAsyncThunk(
  'comments/fetch',
  async (postId: number) => {
    return getPostComments(postId);
  },
);

export const addComment = createAsyncThunk(
  'comments/add',
  async ({
    postId,
    name,
    email,
    body,
  }: {
    postId: number;
    name: string;
    email: string;
    body: string;
  }) => {
    return createComment({
      postId,
      name,
      email,
      body,
    });
  },
);

export const removeComment = createAsyncThunk(
  'comments/delete',
  async (commentId: number) => {
    await deleteComment(commentId);

    return commentId;
  },
);

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearError: state => ({ ...state, error: null }),
  },
  extraReducers: builder =>
    builder
      .addCase(init.pending, state => ({
        ...state,
        loading: true,
        error: null,
      }))
      .addCase(init.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        items: action.payload,
      }))
      .addCase(init.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.error.message ?? 'Unknown error',
      }))

      .addCase(addComment.pending, state => ({ ...state, error: null }))
      .addCase(addComment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => ({
        ...state,
        error: action.error.message ?? 'Could not add comment',
      }))

      .addCase(removeComment.fulfilled, (state, action) => ({
        ...state,
        items: state.items.filter(comment => comment.id !== action.payload),
      }))
      .addCase(removeComment.rejected, (state, action) => ({
        ...state,
        error: action.error.message ?? 'Could not delete comment',
      })),
});

export const { clearError } = commentsSlice.actions;
