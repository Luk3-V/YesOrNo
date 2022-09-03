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

    return (
        <div className='mt-10'>
            {allPolls.map((poll: any, i: number) => <Poll className="mt-10" key={i} data={poll} />)}
        </div>
    );
}
