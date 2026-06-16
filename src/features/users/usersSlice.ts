import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '../../types/User';
import { getUsers } from '../../api/users';

type UsersState =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; users: User[] }
  | { type: 'failed'; error: string };

const initialState: UsersState = { type: 'idle' } as UsersState;

export const init = createAsyncThunk('users/fetch', async () => {
  const users = await getUsers();

  return users;
});

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(init.pending, () => {
        return { type: 'loading' };
      })
      .addCase(init.fulfilled, (_, action) => {
        return { type: 'success', users: action.payload };
      })
      .addCase(init.rejected, (_, action) => {
        return {
          type: 'failed',
          error: action.error.message ?? 'Unknown error',
        };
      }),
});
