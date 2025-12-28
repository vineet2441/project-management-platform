import React from 'react';
import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';

type Props ={ children: React.ReactNode};

const ProtectedRoute:React.FC<Props>=({children})=>{
  const isAuthenticated= useSelector((s:RootState)=>s.auth.isAuthenticated);
  return isAuthenticated ? <> {children}</>: <Navigate to="/login" replace
/>};
export default ProtectedRoute;