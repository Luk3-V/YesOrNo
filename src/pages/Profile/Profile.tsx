import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { getProfile, initialState } from "../../store/UserSlice";
import { getUserID, getUserProfile } from "../../util";

export default function Profile() {
    const navigate = useNavigate();
    const profile = useSelector(getProfile);
    const { username } = useParams();
    const [user, setUser] = useState<typeof initialState.profile | null >(null);

    useEffect(() => {
        // check if current
        // else load user
        (async () => {
            const uid = await getUserID(username as string);
            const result = await getUserProfile(uid);
            setUser(result as any);
        })();
    }, [username, profile]);

    if(!user)
        return (<></>);
    
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
            </div>
            {user.polls}
            <Outlet />
        </>
    );
}