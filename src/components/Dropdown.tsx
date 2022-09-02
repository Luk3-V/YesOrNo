import React, { forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../store/store';
import { getProfile, userSignOut } from '../store/UserSlice'
import { MdAccountCircle, MdDarkMode, MdLogout } from "react-icons/md";
import Card from './Card'

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
    
    function DropdownItem(props: any) {
      return (
        <a className={'flex items-center py-2 px-4 rounded hover:bg-gray-200 cursor-pointer '+props.className} onClick={props.onClick}>
            {props.icon && 
            <div className='text-2xl inline-block mr-3 text-gray-700'>
                {props.icon}
            </div>}
            {props.children}
        </a>
      )
    }

    return (
        <Card className='!px-2 !py-2 w-52 absolute top-16 right-0' ref={ref}>
            <DropdownItem className="font-medium" onClick={handleProfile} icon={<MdAccountCircle />}>
                @{profile.name}
            </DropdownItem>
            <div className='block border-b border-gray-300 my-2'></div>
            <DropdownItem icon={<MdDarkMode />}>
                Dark Mode
            </DropdownItem>
            <DropdownItem onClick={handleLogOut} icon={<MdLogout />}>
                Log Out
            </DropdownItem>
        </Card>
    )
});
export default Dropdown;