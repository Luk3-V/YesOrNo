import { useSelector } from "react-redux";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { getProfile } from "../../store/UserSlice";

export default function Profile() {
    const profile = useSelector(getProfile)

    return (
        <div className="w-full">
            <Card className="mt-16">
                <div className="flex justify-between items-end mb-4 relative -mt-20">
                    <div>
                        <img src={require("../../assets/user.png")} alt="" className="w-32 rounded-full shadow-md"/>
                    </div>
                    <Button onClick={() => {}}>Edit Profile</Button>
                </div>
                <h1 className="text-3xl font-semibold mb-2">@{profile.name}</h1>
                <p className="text-lg">{profile.bio}</p>
                <div className="flex mt-5 text-neutral-700">
                    <span className="text-inherit"><span className="font-medium">{profile.polls}</span> Polls</span>
                    <div className="ml-3 pl-3 border-l border-neutral-700">
                        <span className="mr-3 text-inherit"><span className="font-medium">{profile.followers}</span> Followers</span>
                        <span className="text-inherit"><span className="font-medium">{profile.following}</span> Following</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}