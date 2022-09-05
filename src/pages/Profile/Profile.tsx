import { useEffect, useState } from "react";
import { FaPoll } from "react-icons/fa";
import { IoMdThumbsDown, IoMdThumbsUp } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import MenuItem from "../../components/MenuItem";
import Poll from "../../components/Poll";
import { PollState } from "../../store/PollsSlice";
import { getProfile, initialState, UserState } from "../../store/UserSlice";
import { getUserID, getUserPolls, getUserProfile } from "../../util";

export default function Profile() {
    const navigate = useNavigate();
    const profile = useSelector(getProfile);
    const { username } = useParams();
    const [user, setUser] = useState<UserState["profile"]>();
    const [userPolls, setUserPolls] = useState<PollState[]>([]);

    useEffect(() => {
        (async () => {
            const uid = await getUserID(username as string);
            const result = await getUserProfile(uid);
            if(result) {
                setUser(result);

                if(result.polls.length) {
                    const polls = await getUserPolls(result.polls);
                    setUserPolls(polls);
                }
            }
        })();
    }, [username, profile]);

    const refresh = async () => {
        if(user) {
            const polls = await getUserPolls(user.polls);
            setUserPolls(polls);
        }
    }

    if(!user)
        return (<>User not found.</>);
    
    return (
        <>
            <div className="w-full">
                <Card className="mt-16">
                    <div className="flex justify-between items-end mb-4 relative -mt-20">
                        <div>
                            <img src={user.image} alt="" className="w-32 h-32 rounded-full shadow-md"/>
                        </div>
                        {profile.uid === user.uid ? <Button onClick={() => {navigate('/profile/'+username+'/edit')}}>Edit Profile</Button> : <Button onClick={() => {navigate('/')}}>Follow</Button>}
                    </div>
                    <h1 className="text-3xl font-semibold mb-2">@{user.name}</h1>
                    <p className="text-lg whitespace-pre-wrap">{user.bio}</p>
                    <div className="flex mt-5 text-gray-700">
                        <span className="text-inherit"><span className="font-medium">{user.pollCount}</span> Polls</span>
                        <div className="ml-3 pl-3 border-l border-gray-700">
                            <span className="mr-3 text-inherit"><span className="font-medium">{user.followers}</span> Followers</span>
                            <span className="text-inherit"><span className="font-medium">{user.following}</span> Following</span>
                        </div>
                    </div>
                </Card>

                <div className="flex mt-8">
                    <div className="grow pr-3">
                        {userPolls ? userPolls.map((poll) => 
                            <Poll key={poll.pollID} data={poll} className="mb-6" refresh={refresh}/>
                        ) : <></>}
                    </div>
                    <div>
                        <Card size="sm" className="w-52">
                            <MenuItem icon={<FaPoll />}>Polls</MenuItem>
                            <div className='block border-b border-gray-300 my-2'></div>
                            <MenuItem icon={<IoMdThumbsUp />}>Yes Votes</MenuItem>
                            <MenuItem icon={<IoMdThumbsDown />}>No Votes</MenuItem>
                        </Card>
                    </div>
                </div>
            </div>

            <Outlet />
        </>
    );
}