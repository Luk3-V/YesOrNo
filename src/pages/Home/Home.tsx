import { useSelector } from "react-redux";
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

export default function Home() {
    const navigate = useNavigate();
    const profile = useSelector(getProfile);

    return (
        <div className="flex w-full">
            <div className="grow pr-3">
                {profile.uid && <CreatePoll />}
                <Feed />
            </div>
            <div className="">
                <Card size="sm" className="w-52">
                    <MenuItem icon={<FaGlobe />}>All</MenuItem>
                    <MenuItem icon={<FaUserFriends />}>Following</MenuItem>
                </Card>
            </div>
        </div>
    );
}