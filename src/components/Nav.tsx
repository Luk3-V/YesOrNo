import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

import Button from "./Button";
import { useSelector } from "react-redux";
import { getProfile, getStatus } from "../store/UserSlice";
import { useRef, useState } from "react";
import { FaBell, FaHome } from "react-icons/fa";
import Dropdown from "./Dropdown";
import { MdThumbsUpDown } from "react-icons/md";

const NavWrapper = styled.div`
    position: fixed;
    width: 100%;
    z-index: 100;
    padding: 0 30px 0 20px;
    @media only screen and (hover: none) and (pointer: coarse){
        padding: 0 20px;
    }
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
    const buttonRef = useRef<HTMLElement>();

    const close = (e: Event)=>{
        if(open && !menuRef.current?.contains(e.target as any) && !buttonRef.current?.contains(e.target as any)){
          setOpen(false)
        }
    }
    document.addEventListener('mousedown', close);

    return (
        <NavWrapper className="shadow bg-white dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-600">
            <NavDiv>
                <a onClick={() => navigate('/')} className="flex items-center text-2xl font-medium text-primary cursor-pointer"><MdThumbsUpDown className="text-3xl mr-2"/>YesOrNo</a>
                <div>
                    {status === 'success' ? <>
                        <Button onClick={() => {navigate('/')}} type="circle">
                            <FaHome className="text-2xl inline-block m-2"/>
                        </Button>
                        <Button onClick={() => {}} type="circle">
                            <FaBell className="text-2xl inline-block m-2"/>
                        </Button>
                        <Button onClick={() => setOpen(!open)} type="circle" ref={buttonRef}>
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