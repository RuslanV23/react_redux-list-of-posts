import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createComment,
  deleteComment,
  getPostComments,
} from '../../api/comments';
import { Comment } from '../../types/Comment';

type CommentsState = {
  items: Comment[];
  loaded: boolean;
  hasError: string | null;
};

const initialState: CommentsState = {
  items: [],
  loaded: false,
  hasError: null,
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
        loaded: false,
        hasError: null,
      }))
      .addCase(init.fulfilled, (state, action) => ({
        ...state,
        loaded: true,
        items: action.payload,
      }))
      .addCase(init.rejected, (state, action) => ({
        ...state,
        loaded: true,
        hasError: action.error.message ?? 'Unknown error',
      }))

      .addCase(addComment.pending, state => ({ ...state, hasError: null }))
      .addCase(addComment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => ({
        ...state,
        hasError: action.error.message ?? 'Could not add comment',
      }))

      .addCase(removeComment.fulfilled, (state, action) => ({
        ...state,
        items: state.items.filter(comment => comment.id !== action.payload),
      }))
      .addCase(removeComment.rejected, (state, action) => ({
        ...state,
        hasError: action.error.message ?? 'Could not delete comment',
      })),
});

export const { clearError } = commentsSlice.actions;
