import fromnow from 'fromnow';
import React, { useEffect, useState } from 'react'
import { FaTrash, FaTrashAlt } from 'react-icons/fa';
import { HiDotsHorizontal, HiOutlineTrash, HiTrash } from 'react-icons/hi';
import { IoMdThumbsDown, IoMdThumbsUp } from 'react-icons/io'
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addPollVote, loadAllPolls } from '../store/PollsThunks';
import { AppDispatch } from '../store/store';
import { deleteUserPollID, getProfile } from '../store/UserSlice';
import { deletePoll, percentage } from '../util';
import Button from './Button'
import Card from './Card'
import Modal from './Modal';

export default function Poll(props: any) {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const profile = useSelector(getProfile);
    const [loading, setLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [vote, setVote] = useState('');
    const totalVotes = props.data.yesVotes.length + props.data.noVotes.length;

    useEffect(() => {
        if(props.data.yesVotes.includes(profile.uid))
            setVote('yes');
        if(props.data.noVotes.includes(profile.uid))
            setVote('no');
    }, []);

    const handleDelete = async () => {
        setLoading(true);
        if(await deletePoll(props.data.pollID)) {
            await dispatch(deleteUserPollID(props.data.pollID))
            props.refresh();
        }
        setLoading(false);    
    }

    const handleVote = async (vote: string) => {
        setLoading(true);
        const args = {
            vote: vote,
            pollData: props.data,
            uid: profile.uid
        }
        await dispatch(addPollVote(args));
        setLoading(false);  
    }

    return (
        <Card size='sm' className={props.className}>
            <div className="mb-4 flex">
                <img src={props.data.profileImage} alt="" className="w-12 h-12 rounded-full shadow-sm mr-3 cursor-pointer" onClick={() => navigate("/profile/"+props.data.name)}/>
                <div className='grow'>
                    <a className='text-lg font-medium cursor-pointer hover:underline' onClick={() => navigate("/profile/"+props.data.name)}>@{props.data.name}</a>
                    <span className='block text-gray-500'>{fromnow(props.data.createdAt, { max:1, suffix:true })}</span>
                </div>
                <div>
                    {props.data.uid === profile.uid && 
                    <Button onClick={() => setDeleteModal(true)} type='clear' size='sm' disabled={loading}>
                        <FaTrashAlt className='text-xl text-gray-700 my-1'/>
                    </Button>}
                </div>
            </div>
            <div className='mb-4 flex'>
                <span className='grow text-2xl'>{props.data.question}</span>
                <span className='text-gray-500'>{totalVotes === 1 ? totalVotes+' vote' : totalVotes+' votes'}</span>
            </div>

            {vote.length || props.data.uid === profile.uid ? 
            <div className="flex space-x-3">
                <Button onClick={() => {}} type="outline" className='grow' icon={<IoMdThumbsUp />} disabled={loading}>
                    Yes {percentage(props.data.yesVotes.length, totalVotes)}%
                </Button>
                <Button onClick={() => {}} type="outline" className='grow' icon={<IoMdThumbsDown />} disabled={loading}>
                    No {percentage(props.data.noVotes.length, totalVotes)}%
                    </Button>
            </div> :
            <div className="flex space-x-3">
                <Button onClick={() => handleVote('yes')} type="outline" className='grow' icon={<IoMdThumbsUp />} disabled={loading}>Yes</Button>
                <Button onClick={() => handleVote('no')} type="outline" className='grow' icon={<IoMdThumbsDown />} disabled={loading}>No</Button>
            </div>}
            
            {deleteModal && 
            <Modal>
                <div className="flex justify-between mb-6">
                    <span className="text-2xl font-semibold">Delete Poll?</span>
                    <Button type="clear" size='sm' className="text-2xl text-black" onClick={() => setDeleteModal(false)}><IoClose /></Button>
                </div>
                <span className='text-lg'>Your poll and all it's votes will be gone forever.</span>
                <div className='flex mt-4 space-x-3'>
                    <Button onClick={() => setDeleteModal(false)} className="grow" type="outline">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} className="grow text-red-500 border-red-500 hover:bg-red-50" type="outline">
                        Delete
                    </Button>
                </div>
            </Modal>}
        </Card>
    )
}
