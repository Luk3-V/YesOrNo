import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, getStatus, userSignOut } from "../store/UserSlice";
import { AppDispatch } from "../store/store";
import { useEffect } from "react";

const NavWrapper = styled.div`
    position: fixed;
    width: 100%;
    z-index: 2;
    padding: 0 20px;
    background-color: white;
`;

const NavDiv = styled.div`
    max-width: 1200px;
    height: 4rem;
    margin: auto;
    align-items: center;
    display: flex;
    justify-content: space-between;
    div button {
        margin-left: 1.2rem;
    }
`;

interface Props {  
    
}
export default function Nav(props: Props) {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const profile = useSelector(getProfile);
    const status = useSelector(getStatus);

    // on update
    useEffect(() => {
        if(status === 'idle')
            navigate('/');
    }, [status]);

    const handleLogOut = (e:React.SyntheticEvent) => {
        dispatch(userSignOut());
    }

    return (
        <NavWrapper className="shadow-md">
            <NavDiv>
                <button onClick={() => navigate('/')} className="text-2xl font-medium text-primary">Pollify</button>
                <div>
                    {profile.uid ? <>
                        <Button onClick={() => {}}>Create Poll</Button>
                        <Button onClick={() => navigate('/profile')}>{profile.name}</Button>
                        <Button onClick={handleLogOut}>Logout</Button>
                    </> : <>
                        <button onClick={() => navigate('/login')} className="font-semibold text-blue-500 hover:text-blue-700">Log In</button>
                        <Button onClick={() => navigate('/signup')}>Sign Up</Button>
                    </>}
                </div>
            </NavDiv>
        </NavWrapper>     
    );
}