import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, getStatus, userSignOut } from "../store/UserSlice";
import { AppDispatch } from "../store/store";
import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import Dropdown from "./Dropdown";

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
    position: relative;
    div button {
        margin-left: .75rem;
    }
`;

export default function Nav() {
    const navigate = useNavigate();
    const profile = useSelector(getProfile);
    const status = useSelector(getStatus);
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLElement>();

    const close = (e: Event)=>{
        if(menuRef.current && open && !menuRef.current.contains(e.target as any)){
          setOpen(false)
        }
    }
    document.addEventListener('mousedown', close);

    return (
        <NavWrapper className="shadow-sm">
            <NavDiv>
                <button onClick={() => navigate('/')} className="text-2xl font-medium text-primary">something</button>
                <div>
                    {status === 'success' ? <>
                        <Button onClick={() => {}}>Create Poll</Button>
                        <Button onClick={() => {}} type="clear">
                            <FaBell className="text-2xl inline-block"/>
                        </Button>
                        <Button onClick={() => setOpen(!open)} type="circle">
                            <img className="inline-block w-10 h-10 rounded-full" src={profile.image}/>
                        </Button>
                        
                    </> : <>
                        <Button onClick={() => navigate('/login')} type="clear">Log In</Button>
                        <Button onClick={() => navigate('/signup')}>Sign Up</Button>
                    </>}
                </div>
                {open && <Dropdown setOpen={setOpen} ref={menuRef}/>}
            </NavDiv>
        </NavWrapper>     
    );
}