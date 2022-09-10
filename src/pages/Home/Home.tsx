import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import Dropdown from "../../components/Dropdown";
import Input from "../../components/Input";
import MenuItem from "../../components/MenuItem";
import { getProfile } from "../../store/UserSlice";
import { MdLocalFireDepartment, MdOutlineStar } from "react-icons/md";
import { IoMdArrowRoundUp, IoMdText } from "react-icons/io";
import { IoImagesSharp } from "react-icons/io5";
import { FaUserFriends, FaGlobe } from "react-icons/fa";
import CreatePoll from "../../components/CreatePoll";
import Feed from "../../components/Feed";
import { useEffect, useState } from "react";
import { getAllPolls, getFollowingPolls, loadAllPolls, loadFollowingPolls } from "../../store/PollsSlice";
import { AppDispatch } from "../../store/store";

export default function Home() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const profile = useSelector(getProfile);
    const [filter, setFilter] = useState('all');
    const allPolls = useSelector(getAllPolls);
    const followingPolls = useSelector(getFollowingPolls);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if(filter === 'all')
            dispatch(loadAllPolls())
                .then(() => setLoading(false));
        else if(filter === 'following')
            dispatch(loadFollowingPolls(profile.following))
                .then(() => setLoading(false));
    }, [filter])

    return (
        <div className="flex w-full">
            <div className="grow pr-3">
                {profile.uid && <CreatePoll />}
                <Feed polls={filter === 'all' ? allPolls : followingPolls} loading={loading}/>
            </div>
            <div className="">
                <Card size="sm" className="w-52">
                    <MenuItem icon={<FaGlobe />} onClick={() => setFilter('all')}>All</MenuItem>
                    <MenuItem icon={<FaUserFriends />} onClick={() => setFilter('following')}>Following</MenuItem>
                </Card>
            </div>
        </div>
    );
}