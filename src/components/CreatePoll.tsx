import React, { useEffect, useRef, useState } from 'react'
import { FaSmile } from 'react-icons/fa'
import { IoMdText } from 'react-icons/io'
import { IoImageSharp } from 'react-icons/io5'
import { HiEmojiHappy } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import { addUserPollID, getProfile } from '../store/UserSlice'
import Button from './Button'
import Input from './Input'
import MenuItem from './MenuItem'
import { AppDispatch } from '../store/store'
import { createPoll } from '../util'
import Card from './Card'
import { loadAllPolls } from '../store/PollsThunks'

export default function CreatePoll() {
    const dispatch = useDispatch<AppDispatch>();
    const profile = useSelector(getProfile);
    const [isValid, setIsValid] = useState(false);
    const [question, setQuestion] = useState<string>('');

    // on question update
    useEffect(() => {
        const regex = /\w+/;

        if(!regex.test(question)) 
            setIsValid(false);
        else
            setIsValid(true);
    }, [question]);

    const handleCreatePoll = async (e: Event) => {
        e.preventDefault();

        const pollID = await createPoll(question, null, profile);
        if(pollID) {
            dispatch(addUserPollID(pollID));
            dispatch(loadAllPolls());
        }
        setQuestion('');
    }

    return (
        <Card size="sm" className='mb-10'>
            <div className="flex justify-between">
                <img src={profile.image} alt="" className="w-12 h-12 rounded-full shadow-sm mr-3"/>
                <Input id="question" type="text" placeholder="Ask the world a question..." value={question} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}/>
            </div>
            <div className='block border-b border-gray-300 my-4'></div>
            <div className="flex justify-between">
                <div className="flex">
                    <Button onClick={() => {}} size="sm" type="clear" className='mr-3'><IoImageSharp className='text-2xl'/></Button>
                    <Button onClick={() => {}} size="sm" type="clear" className='mr-3'><HiEmojiHappy className='text-2xl'/></Button>
                </div>
                <Button onClick={handleCreatePoll} disabled={!isValid}>Poll It!</Button>
            </div>
        </Card>
    )
}

// add poll to polls
// add doc id to users polls array
