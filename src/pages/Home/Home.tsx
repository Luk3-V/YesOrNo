import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/Card";
import MenuItem from "../../components/MenuItem";
import { getProfile } from "../../store/UserSlice";
import { FaUserFriends, FaGlobe } from "react-icons/fa";
import CreatePoll from "../../components/CreatePoll";
import Feed from "../../components/Feed";
import { useEffect, useState } from "react";
import { getAllPolls, getFollowingPolls, loadAllPolls, loadFollowingPolls } from "../../store/PollsSlice";
import { AppDispatch } from "../../store/store";
import { HiGlobe } from "react-icons/hi";

export default function Home() {
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
        <div className="flex w-full flex-col-reverse md:flex-row">
            <div className="grow md:pr-3">
                {profile.uid && <CreatePoll />}
                <Feed polls={filter === 'all' ? allPolls : followingPolls} loading={loading}/>
            </div>
            <div className="">
                <Card size="sm" className="w-full mb-6 flex md:w-52 md:mb-0 md:block">
                    <MenuItem icon={<HiGlobe />} onClick={() => setFilter('all')} active={filter === 'all'} className="w-1/2 flex justify-center md:w-full md:justify-start md:mb-1">
                        All
                    </MenuItem>
                    <MenuItem icon={<FaUserFriends />} onClick={() => setFilter('following')} active={filter === 'following'} className="w-1/2 flex justify-center md:w-full md:justify-start">
                        Following
                    </MenuItem>
                </Card>
            </div>
        </div>
    );
}