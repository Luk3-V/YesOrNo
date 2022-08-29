import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Input from "../../components/Input";
import { getProfile } from "../../store/UserSlice";

export default function EditProfile() {
    const navigate = useNavigate();
    const profile = useSelector(getProfile);

    return (
        <div className="w-full">
            <Card className="mt-16">
                <form>
                    <div className="flex justify-between items-end mb-4 relative -mt-20">
                        <div>
                            <img src={require("../../assets/user.png")} alt="" className="w-32 rounded-full shadow-md"/>
                        </div>
                        <Button onClick={() => {navigate('/profile')}}>Save</Button>
                    </div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <Input className="text-3xl font-semibold mb-2" id="name" type="name" value={profile.name} />
                    <p className="text-lg">{profile.bio}</p>
                    <div className="flex mt-5 text-gray-700">
                        <span className="text-inherit"><span className="font-medium">{profile.polls}</span> Polls</span>
                        <div className="ml-3 pl-3 border-l border-gray-700">
                            <span className="mr-3 text-inherit"><span className="font-medium">{profile.followers}</span> Followers</span>
                            <span className="text-inherit"><span className="font-medium">{profile.following}</span> Following</span>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
}