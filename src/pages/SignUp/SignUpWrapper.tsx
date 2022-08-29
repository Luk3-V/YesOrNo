import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getIsNewUser, getStatus } from '../../store/UserSlice';
import CreatProfile from './CreatProfile';
import SignUp from './SignUp'

export default function SignUpWrapper() {
    const navigate = useNavigate();
    const status = useSelector(getStatus);
    const isNewUser = useSelector(getIsNewUser);
    // on update
    useEffect(() => {
        if(status === "success" && !isNewUser)
            navigate('/');
    }, [isNewUser]);

    return (
        <>
            {status === "success" ? <CreatProfile /> : <SignUp /> }
        </>  
    )
}
