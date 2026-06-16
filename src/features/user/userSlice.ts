import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '../../types/User';
import { getUsers } from '../../api/users';

type UserState =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; users: User[] }
  | { type: 'failed'; error: string };

const initialState: UserState = { type: 'idle' } as UserState;

export const init = createAsyncThunk('user/fetch', async () => {
  const users = await getUsers();

  return users;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(init.pending, () => {
        // console.log('hhh');

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
