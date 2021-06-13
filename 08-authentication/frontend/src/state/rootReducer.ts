import { combineReducers } from "redux";
import authSlice from '../components/auth/authSlice';

const rootReducer = combineReducers({
  auth: authSlice
})

export default rootReducer
