import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { AppDispatch } from '../../store/store';
import { getProfile, updateUserProfile } from '../../store/UserSlice';
import { checkNameTaken, uploadImg } from '../../util';

export default function CreatProfile() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const profile = useSelector(getProfile);
    const [name, setName] = useState(profile.name);
    const [image, setImage] = useState<File>();
    const [imageValid, setImageValid] = useState(true);
    const [nameValid, setNameValid] = useState(false);
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

    const handleCreateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
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
        navigate("/");
    }

    return (
        <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
            <Card>
                <form>
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
                        <Input id="bio" type="textarea" rows="3" maxlength="100" />
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
                        {!imageValid && <span className='text-sm text-red-600'>Invalid File</span>}
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <Button className="w-full mb-2" disabled={!nameValid || !imageValid || loading} onClick={handleCreateProfile} >
                            Create Profile
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}

// sign up -> creates user 
// generates temp username & default profile
// stores in users & username DB
// open creat profile form
// form w/ username, pic & bio
// then updates user doc & replaces username doc