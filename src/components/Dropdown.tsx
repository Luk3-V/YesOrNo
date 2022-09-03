import React, { forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../store/store';
import { getProfile, userSignOut } from '../store/UserSlice'
import { MdAccountCircle, MdDarkMode, MdLogout } from "react-icons/md";
import Card from './Card'
import MenuItem from './MenuItem';

const Dropdown = forwardRef((props: any, ref: any) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const profile = useSelector(getProfile);

    const handleProfile = () => {
        props.setOpen(false);
        navigate('/profile/'+profile.name);
    }

    const handleLogOut = async (e:React.SyntheticEvent) => {
        await dispatch(userSignOut());
        props.setOpen(false);
        navigate('/');
    }

    return (
        <Card className='!px-2 !py-2 w-52 absolute top-16 right-0' ref={ref}>
            <MenuItem className="font-medium" onClick={handleProfile} icon={<MdAccountCircle />}>
                @{profile.name}
            </MenuItem>
            <div className='block border-b border-gray-300 my-2'></div>
            <MenuItem icon={<MdDarkMode />}>
                Dark Mode
            </MenuItem>
            <MenuItem onClick={handleLogOut} icon={<MdLogout />}>
                Log Out
            </MenuItem>
        </Card>
    )
});
export default Dropdown;