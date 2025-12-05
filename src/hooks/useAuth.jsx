'use client'

import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';

const useAuth = () => {
    const authInfo = useContext(AuthContext);
    
    if (!authInfo) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return authInfo;
};

export default useAuth;