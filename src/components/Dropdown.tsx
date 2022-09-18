import React, { forwardRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../store/store';
import { getProfile, userSignOut } from '../store/UserSlice'
import { MdAccountCircle, MdDarkMode, MdLightMode, MdLogout } from "react-icons/md";
import Card from './Card'
import MenuItem from './MenuItem';

const Dropdown = forwardRef((props: any, ref: any) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const profile = useSelector(getProfile);
    const [darkMode, setDarkMode] = useState(localStorage.getItem("dark") ? true : false);

    const handleProfile = () => {
        props.setOpen(false);
        navigate('/profile/'+profile.name);
    }
    
    const handleDarkMode = () => {
        document.body.classList.toggle('dark');
        if(!darkMode)
            localStorage.setItem("dark", "true");
        else
            localStorage.removeItem("dark");
        setDarkMode(!darkMode);
    }

    const handleLogOut = async (e:React.SyntheticEvent) => {
        await dispatch(userSignOut());
        props.setOpen(false);
        navigate('/');
    }

    return (
        <Card className='!px-2 !py-2 w-52 absolute top-16 right-0 !shadow-lg' ref={ref}>
            <MenuItem className="font-medium" onClick={handleProfile} icon={<MdAccountCircle />}>
                @{profile.name}
            </MenuItem>
            <div className='block border-b border-gray-300 dark:border-neutral-600 my-2'></div>
            <MenuItem icon={!darkMode ? <MdDarkMode /> : <MdLightMode />} onClick={handleDarkMode}>
                {!darkMode ? 'Dark Mode' : 'Light Mode'}
            </MenuItem>
            <MenuItem onClick={handleLogOut} icon={<MdLogout />}>
                Log Out
            </MenuItem>
        </Card>
    )
});
export default Dropdown;