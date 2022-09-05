import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadAllPolls, getAllPolls, PollState } from '../store/PollsSlice'
import { AppDispatch } from '../store/store';
import Poll from './Poll';

export default function Feed() {
    const dispatch = useDispatch<AppDispatch>();
    const allPolls = useSelector(getAllPolls);

    useEffect(() => {
        dispatch(loadAllPolls());
    }, [])

    const refresh = () => {
        dispatch(loadAllPolls());
    }

    return (
        <div className='mt-10'>
            {allPolls.map((poll: any) => <Poll className="mt-6" key={poll.pollID} data={poll} refresh={refresh}/>)}
        </div>
    );
}
