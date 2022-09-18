import { useEffect, useState } from "react";
import { FaCalendarAlt, FaPoll } from "react-icons/fa";
import { IoMdThumbsDown, IoMdThumbsUp } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Feed from "../../components/Feed";
import MenuItem from "../../components/MenuItem";
import Spinner from "../../components/Spinner";
import { PollState } from "../../store/PollsSlice";
import { AppDispatch } from "../../store/store";
import { addUserFollow, deleteUserFollow, getProfile, UserState } from "../../store/UserSlice";
import { getUserID, getUserPolls, getUserProfile } from "../../util";
import EditProfile from "./EditProfile";

function PrivateRoutes(props: any) {
    return ( props.isOwner ? <Outlet /> : <Navigate to={'/profile/'+props.username} /> );
  }

export default function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const profile = useSelector(getProfile);
    const { username } = useParams();
    const [user, setUser] = useState<UserState["profile"]>();
    const [userPolls, setUserPolls] = useState<PollState[]>([]);
    const [yesPolls, setYesPolls] = useState<PollState[]>([]);
    const [noPolls, setNoPolls] = useState<PollState[]>([]);
    const [filter, setFilter] = useState('user');
    const createdDate = new Date(profile.createdAt);
    const [isFollowing, setIsFollowing] = useState(false);

    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingPolls, setLoadingPolls] = useState(true);

    useEffect(() => {
        (async () => {
            const uid = await getUserID(username as string);
            if(uid) {
                const result = await getUserProfile(uid);
                if(result) {
                    setUser(result);
                    setIsFollowing(result.followers.includes(profile.uid));
                    setLoadingUser(false);
                }
            }
        })();
    }, [username, profile]);
    useEffect(() => {
        (async () => {
            if(user) {
                console.log('loading polls');
                setLoadingPolls(true);
                if(filter === 'user'){
                    if(user.polls.length) {
                        const polls = await getUserPolls(user.polls);
                        setUserPolls(polls);
                    } else {
                        setUserPolls([]);
                    }
                }
                if(filter === 'yes'){
                    if(user.yesVotes.length) {
                        const polls = await getUserPolls(user.yesVotes);
                        setYesPolls(polls);
                    } else {
                        setYesPolls([]);
                    }
                }
                if(filter === 'no'){
                    if(user.noVotes.length) {
                        const polls = await getUserPolls(user.noVotes);
                        setNoPolls(polls);
                    } else {
                        setNoPolls([]);
                    }
                }
                console.log('polls done');
                setLoadingPolls(false); 
            }
        })();
    }, [filter, user])

    const handleFollow = () => {
        if(user?.uid && !isFollowing)
            dispatch(addUserFollow({follower: profile.uid, following: user.uid}));
        else if(user?.uid && isFollowing)
            dispatch(deleteUserFollow({follower: profile.uid, following: user.uid}));
    }

    if(loadingUser)
        return (<Spinner loading={(loadingUser)} />);

    if(!user)
        return (<>User not found.</>);
    
    return (
        <>
            <div className="w-full">
                <Card className="mt-16">
                    <div className="flex justify-between items-end mb-4 relative -mt-16 md:-mt-20">
                        <div>
                            <img src={user.image} alt="" className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-md"/>
                        </div>
                        {profile.uid === user.uid ? 
                        <Button onClick={() => {navigate('/profile/'+username+'/edit')}}>Edit Profile</Button> : 
                        (!isFollowing ? 
                        <Button onClick={handleFollow}>Follow</Button> :
                        <Button onClick={handleFollow} type="outline">Unfollow</Button>)}
                    </div>
                    <div className="mb-2 flex items-end">
                        <h1 className="text-3xl font-semibold mr-6">@{user.name}</h1>
                        <span className="text-gray-600 dark:text-neutral-400 text-sm"><FaCalendarAlt className="mr-2 inline-block align-baseline"/>{'Joined ' + createdDate.getMonth() + ' ' + createdDate.getFullYear()}</span>
                    </div>
                    <p className="text-lg whitespace-pre-wrap">{user.bio}</p>
                    <div className="flex flex-col-reverse md:flex-row justify-between mt-5 text-gray-600 dark:text-neutral-400">
                        <div className="flex">  
                            <span className="text-inherit"><span className="text-black dark:text-white font-semibold">{user.polls.length}</span> Polls</span>
                            <div className="ml-3 pl-3 border-l border-gray-400 dark:border-neutral-500">
                                <span className="mr-2 text-inherit">Votes: </span>
                                <span className="mr-1 text-inherit"><span className="text-black dark:text-white font-semibold">{user.yesVotes.length}</span> Yes /</span>
                                <span className="text-inherit"><span className="text-black dark:text-white font-semibold">{user.noVotes.length}</span> No</span>
                            </div>
                        </div>
                        <div className="flex mb-3 md:mb-0">
                            <span className="text-inherit mr-3"><span className="text-black dark:text-white font-semibold">{user.followers.length}</span> Followers</span>
                            <span className="text-inherit"><span className="text-black dark:text-white font-semibold">{user.following.length}</span> Following</span>
                        </div>
                    </div>
                </Card>

                <div className="flex w-full flex-col-reverse md:flex-row mt-8">
                    <div className="grow md:pr-3">
                        <Feed polls={filter === 'user' ? userPolls : (filter === 'yes' ? yesPolls : noPolls)} loading={loadingPolls} />
                    </div>
                    <div>
                        <Card size="sm" className="w-full mb-6 flex md:w-52 md:mb-0 md:block">
                            <MenuItem icon={<FaPoll />} onClick={() => setFilter('user')} active={filter === 'user'} className="w-1/2 flex justify-center whitespace-nowrap overflow-hidden md:w-full md:justify-start">
                                Polls
                            </MenuItem>
                            <div className='hidden md:block border-b border-gray-300 dark:border-neutral-600 my-2'></div>
                            <MenuItem icon={<IoMdThumbsUp />} onClick={() => setFilter('yes')} active={filter === 'yes'} className="w-1/2 flex justify-center whitespace-nowrap overflow-hidden md:w-full md:justify-start md:mb-1">
                                Yes Votes
                            </MenuItem>
                            <MenuItem icon={<IoMdThumbsDown />} onClick={() => setFilter('no')} active={filter === 'no'} className="w-1/2 flex justify-center whitespace-nowrap overflow-hidden md:w-full md:justify-start">
                                No Votes
                            </MenuItem>
                        </Card>
                    </div>
                </div>
            </div>

            <Routes>
                <Route path='/' element={<></>} />
                <Route element={<PrivateRoutes isOwner={user.uid === profile.uid} username={username} />}>
                    <Route path='edit' element={<EditProfile />} />
                </Route>
                <Route path='*' element={<Navigate to={'/profile/'+username} />} />
            </Routes>
        </>
    );
}