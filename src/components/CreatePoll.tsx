import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FaSmile, FaTrashAlt } from 'react-icons/fa'
import { IoMdText } from 'react-icons/io'
import { IoImageSharp } from 'react-icons/io5'
import { HiEmojiHappy } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { addUserPollID, getProfile } from '../store/UserSlice'
import Button from './Button'
import Input from './Input'
import MenuItem from './MenuItem'
import { AppDispatch } from '../store/store'
import { createPoll, uploadImg } from '../util'
import Card from './Card'
import { loadAllPolls } from '../store/PollsThunks'

export default function CreatePoll() {
    const dispatch = useDispatch<AppDispatch>();
    const profile = useSelector(getProfile);
    const [textValid, setTextValid] = useState(false);
    const [question, setQuestion] = useState<string>('');
    const [image, setImage] = useState<File | null>();
    const [imageValid, setImageValid] = useState(true);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // on question update
    useEffect(() => {
        const regex = /\w+/;

        if(!regex.test(question)) 
            setTextValid(false);
        else
            setTextValid(true);
    }, [question]);

    const handleImageClick = () => {
        inputRef.current?.click();
    }

    const handleImageChange = (e: ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        const file = (target.files as FileList)[0];

        if(!file)
            return;
        else if(file['type'].split('/')[0] === 'image') {
            setImage(file);
            setImageValid(true);
        }
        else {
            setImageValid(false);
            setImage(null);
        }
    }

    const handleCreatePoll = async () => {
        setLoading(true);

        const imageURL = image ? await uploadImg(image as File, profile.uid) : null;

        const pollID = await createPoll(question, imageURL, profile);
        if(pollID) {
            dispatch(addUserPollID(pollID));
            dispatch(loadAllPolls());
        }
        setQuestion('');
        setImage(null);
        setLoading(false);
    }


    return (
        <Card size="sm" className='mb-10'>
            <div className="flex">
                <img src={profile.image} alt="" className="w-12 h-12 rounded-full shadow-sm mr-3"/>
                <div className="grow">
                    <Input id="question" type="text" placeholder="Ask the world a question..." value={question} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}/>
                    {image && <div className="mt-3 w-full flex justify-center bg-gray-100 rounded relative">
                        <Button onClick={() => setImage(null)} type='clear' size='sm' className='absolute top-2 right-2'>
                            <FaTrashAlt className='text-xl text-gray-700 my-1'/>
                        </Button>
                         <img src={URL.createObjectURL(image)} 
                            alt="poll image" className="max-h-64"
                        />
                    </div>}
                </div>
            </div>
            <div className='block border-b border-gray-300 my-4'></div>
            <div className="flex justify-between">
                <div className="flex">
                    <Button onClick={handleImageClick} size="sm" type="clear" className='mr-3'><IoImageSharp className='text-2xl'/></Button>
                    <Button onClick={() => {}} size="sm" type="clear" className='mr-3'><HiEmojiHappy className='text-2xl'/></Button>
                </div>
                <Button onClick={handleCreatePoll} disabled={!textValid || loading}>Poll It!</Button>
            </div>
            <input ref={inputRef} className="hidden" type="file" onChange={handleImageChange} />
            {!imageValid && <span className='text-sm text-red-600'>Invalid File</span>}
        </Card>
    )
}

// add poll to polls
// add doc id to users polls array
