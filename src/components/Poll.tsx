import fromnow from 'fromnow';
import React, { useEffect, useState } from 'react'
import { FaTrash, FaTrashAlt } from 'react-icons/fa';
import { HiDotsHorizontal, HiOutlineTrash, HiTrash } from 'react-icons/hi';
import { IoMdThumbsDown, IoMdThumbsUp } from 'react-icons/io'
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { PollState } from '../store/PollsSlice';
import { addPollVote, deletePoll, loadAllPolls } from '../store/PollsThunks';
import { AppDispatch } from '../store/store';
import { deleteUserPollID, getProfile } from '../store/UserSlice';
import { addUserVote } from '../store/UserThunks';
import { percentage } from '../util';
import Button from './Button'
import Card from './Card'
import Modal from './Modal';

const Bar = styled.span` 
    animation-name: grow;
    animation-duration: 500ms;

    @keyframes grow {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(0);
        }
    }
`;

function PollResult(props: any) {


    return (
        <div className={'relative w-1/2 font-bold text-gray-700  overflow-hidden ' }>
            <span className={"absolute block h-10 w-full z-10 rounded " + (props.vote ? "border-2 border-blue-500" : "border border-gray-500")}></span>
            <Bar className={"absolute block h-10 rounded " + (props.winner ? "bg-blue-200" : "bg-grey-300")} style={{width: props.percent+'%'}}></Bar>
            <div className="relative flex justify-between py-2 px-4 z-20">
                {props.children}
            </div>
        </div>
    );
} 

export default function Poll(props: any) {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const profile = useSelector(getProfile);
    const [loading, setLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [vote, setVote] = useState('');
    const totalVotes = props.data.yesVotes.length + props.data.noVotes.length;
    const yesPercentage = percentage(props.data.yesVotes.length, totalVotes);
    const noPercentage = percentage(props.data.noVotes.length, totalVotes);

    useEffect(() => {
        if(props.data.yesVotes.includes(profile.uid))
            setVote('yes');
        if(props.data.noVotes.includes(profile.uid))
            setVote('no');
        if(!profile.uid)
            setVote('');
    }, [profile]);

    const handleDelete = async () => {
        setLoading(true);
        await dispatch(deletePoll(props.data.pollID))
            .then((action: any) => dispatch(deleteUserPollID(action.payload)));
        
        setLoading(false); 
        setDeleteModal(false);
    }

    const handleVote = async (vote: string) => {
        if(!profile.uid) {
            navigate('/login');
            return;
        }

        setLoading(true);
        await dispatch(addPollVote({vote: vote, pollData: props.data, uid: profile.uid}))
            .then(() => {
                dispatch(addUserVote({vote: vote, pollID: props.data.pollID}));
            });
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

            {vote.length || (profile.uid && props.data.uid === profile.uid) ? 
            <div className="flex space-x-3">
                <PollResult percent={yesPercentage} winner={yesPercentage > noPercentage} vote={vote === 'yes'}>
                    <span><IoMdThumbsUp className="text-xl inline-block mr-3 align-middle"/>Yes</span>
                    <span>{yesPercentage}%</span> 
                </PollResult>
                <PollResult percent={noPercentage} winner={yesPercentage < noPercentage} vote={vote === 'no'}>
                    <span><IoMdThumbsDown className="text-xl inline-block mr-3 align-middle"/>No</span>
                    <span>{noPercentage}%</span>
                </PollResult>
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
