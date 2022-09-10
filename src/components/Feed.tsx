import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadAllPolls, getAllPolls, PollState, loadFollowingPolls, getFollowingPolls } from '../store/PollsSlice'
import { AppDispatch } from '../store/store';
import { getProfile } from '../store/UserSlice';
import Poll from './Poll';
import Spinner from './Spinner';


export default function Feed(props: any) {

    return (
        <div className=''>
            {props.polls.map((poll: any) => <Poll className="mb-6" key={poll.pollID} data={poll}/>)}
            <Spinner loading={props.loading} />
        </div>
    );
}
