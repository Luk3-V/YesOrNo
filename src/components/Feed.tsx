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
