import { combineReducers } from "redux";
import authSlice from '../components/auth/authSlice';
import { backendApi } from './backendApi';

const rootReducer = combineReducers({
  auth: authSlice,
  [backendApi.reducerPath]: backendApi.reducer
})

export default rootReducer
