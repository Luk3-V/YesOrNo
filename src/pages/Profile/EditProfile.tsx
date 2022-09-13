import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import { AppDispatch } from "../../store/store";
import { getProfile, updateUserProfile } from "../../store/UserSlice";
import { checkNameTaken, uploadImg } from "../../util";
import Profile from "./Profile";
import {CgClose} from "react-icons/cg";
import {IoClose} from "react-icons/io5"

export default function EditProfile() {
    const navigate = useNavigate();
    const profile = useSelector(getProfile);
    const dispatch = useDispatch<AppDispatch>();
    const [name, setName] = useState(profile.name);
    const [bio, setBio] = useState(profile.bio);
    const [image, setImage] = useState<File>();
    const [imageValid, setImageValid] = useState(true);
    const [nameValid, setNameValid] = useState(true);
    const [loading, setLoading] = useState(false);

    // on name update
    useEffect(() => {
        const regex = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if(!regex.test(name)) 
            setNameValid(false);
        else
            handleNameCheck(name, profile.uid, setNameValid, setLoading);
    }, [name]);

    const handleNameCheck = useCallback(
        debounce(checkNameTaken, 300),
        []
    );

    const handleImageChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = (target.files as FileList)[0];
        if(file && file['type'].split('/')[0] === 'image') {
            setImage(file);
            setImageValid(true);
        }
        else  
            setImageValid(false);
    }

    const handleEditProfile = async (e: Event) => {
        e.preventDefault();
        setLoading(true);
        
        const target = e.target as typeof e.target & {
            form: {
                name: { value: string },
                bio: { value:string }
            }
        };
        const imageURL = image ? await uploadImg(image as File, profile.uid) : profile.image;
        const newInfo = {
            name: target.form.name.value,
            bio: target.form.bio.value,
            image: imageURL
        };

        dispatch(updateUserProfile(newInfo));
        setLoading(false);
        navigate('/profile/'+name);
    }

    const handleDelete = (e: Event) => {
        e.preventDefault();
        // TODO close modal & confirm popup modal
    }

    return (
        <Modal>
            <form>
                <div className="flex justify-between mb-6">
                    <span className="text-2xl font-semibold">Edit Profile</span>
                    <Button type="clear" size='sm' className="text-2xl text-black" onClick={() => navigate('/profile/'+profile.name)}><IoClose /></Button>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Username
                    </label>
                    <Input id="name" type="text" placeholder="user123" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} error={!nameValid} />
                    {!nameValid && <span className='text-sm text-red-600'>Invalid Username</span>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                        Bio
                    </label>
                    <Input id="bio" type="textarea" rows="3" maxlength="100" value={bio} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBio(e.target.value)}/>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                        Profile Image
                    </label>
                    <div className="flex items-end relative">
                        <img src={image ? URL.createObjectURL(image) : profile.image} 
                            alt="profile image" className="w-16 h-16 rounded-full mr-3"
                        />
                        <Input id="image" type="file" rows="3" onChange={handleImageChange} error={!imageValid}/>      
                    </div>
                    {!imageValid && <span className='text-sm text-red-600 ml-20'>Invalid File</span>}
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Button className="w-full mb-3" disabled={!nameValid || !imageValid || loading} onClick={handleEditProfile} >
                        Save
                    </Button>
                    <Button className="w-full text-red-500 border-red-500 hover:bg-red-50" type="outline" onClick={handleDelete} disabled={loading}>
                        Delete Account
                    </Button>
                </div>
            </form>
        </Modal>
    );
}