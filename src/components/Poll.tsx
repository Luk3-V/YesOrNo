import fromnow from 'fromnow';
import { useEffect, useState } from 'react'
import { FaRegCheckCircle, FaTrashAlt } from 'react-icons/fa';
import { IoMdThumbsDown, IoMdThumbsUp } from 'react-icons/io'
import { IoClose } from 'react-icons/io5';
import { MdOutlineHowToVote } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { addPollVote, deletePoll } from '../store/PollsSlice';
import { AppDispatch } from '../store/store';
import { deleteUserPollID, getProfile, addUserVote } from '../store/UserSlice';
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
        <div className={'relative font-bold text-gray-700 overflow-hidden sm:w-1/2 ' }>
            <span className={"absolute block h-10 w-full z-10 rounded border " + (props.winner ? (props.value === 'yes' ? "border-emerald-200 dark:border-emerald-800" : "border-rose-200 dark:border-rose-800") : "border-gray-300 dark:border-neutral-600")}></span>
            <Bar className={"absolute block h-10 rounded " + (props.winner ? (props.value === 'yes' ? "bg-emerald-100 dark:bg-emerald-950" : "bg-rose-100 dark:bg-rose-950") : "bg-gray-200 dark:bg-neutral-700")} style={{width: props.percent+'%'}}></Bar>
            <div className={"relative flex justify-between py-2 px-4 z-10 " + (props.winner ? (props.value === 'yes' ? "text-emerald-500" : "text-rose-500") : "text-gray-500 dark:text-neutral-400")}>
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
            <div className="flex relative">
                <img src={props.data.profileImage} alt="" className="w-12 h-12 rounded-full shadow mr-3 cursor-pointer" onClick={() => navigate("/profile/"+props.data.name)}/>
                
                <div className='grow'>
                    <div className='flex items-end'>
                        <a className='text-lg font-medium cursor-pointer hover:underline mr-2' onClick={() => navigate("/profile/"+props.data.name)}>@{props.data.name}</a>
                        <span className='leading-7 text-gray-500 dark:text-neutral-400'>— {fromnow(props.data.createdAt, { max:1, suffix:true })}</span>
                    </div>
                    
                    <div className='mb-4 flex items-end mt-1'>
                        <span className='grow text-2xl'>{props.data.question}</span>
                        <span className='text-gray-500 dark:text-neutral-400'><MdOutlineHowToVote className="inline-block mr-1 align-middle" />{totalVotes === 1 ? totalVotes+' vote' : totalVotes+' votes'}</span>
                    </div>
                    {props.data.image && <div className="mb-4 w-full flex justify-center bg-gray-50 dark:bg-neutral-750 rounded">
                        <img src={props.data.image} 
                            alt="poll image" className="max-h-64"
                        />
                    </div>}

                    {vote.length || (profile.uid && props.data.uid === profile.uid) ? 
                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                        <PollResult percent={yesPercentage} winner={yesPercentage > noPercentage} value={'yes'}>
                            <span><IoMdThumbsUp className="text-xl inline-block mr-3 align-middle"/>Yes{vote === 'yes' && <FaRegCheckCircle className="text-sm inline-block ml-2 align-middle"/>}</span>
                            <span>{yesPercentage}%</span> 
                        </PollResult>
                        <PollResult percent={noPercentage} winner={yesPercentage < noPercentage} value={'no'}>
                            <span><IoMdThumbsDown className="text-xl inline-block mr-3 align-middle"/>No{vote === 'no' && <FaRegCheckCircle className="text-sm inline-block ml-2 align-middle"/>}</span>
                            <span>{noPercentage}%</span>
                        </PollResult>
                    </div> :
                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                        <Button onClick={() => handleVote('yes')} type="outline" className='grow text-emerald-700 dark:text-emerald-400 dark:border-neutral-400 bg-emerald-100 dark:bg-emerald-950 hover:bg-emerald-200 dark:hover:bg-emerald-900' 
                        icon={<IoMdThumbsUp />} disabled={loading}>
                            Yes
                        </Button>
                        <Button onClick={() => handleVote('no')} type="outline" className='grow text-rose-700 dark:text-rose-400 dark:border-neutral-400 bg-rose-100 dark:bg-rose-950 hover:bg-rose-200 dark:hover:bg-rose-900' 
                        icon={<IoMdThumbsDown />} disabled={loading}>
                            No
                        </Button>
                    </div>}
                </div>

                {props.data.uid === profile.uid && 
                <Button onClick={() => setDeleteModal(true)} type='clear' size='sm' disabled={loading} className="absolute top-0 right-0">
                    <FaTrashAlt className='text-lg text-gray-700 dark:text-gray-200 my-1'/>
                </Button>}
            </div>

            
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
                    <Button onClick={handleDelete} className="grow" type="warning">
                        Delete
                    </Button>
                </div>
            </Modal>}
        </Card>
    )
}
