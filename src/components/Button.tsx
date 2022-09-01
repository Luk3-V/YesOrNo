
type Props = {
    onClick: (values: any) => void;
    children?: React.ReactNode;
    className?: string,
    disabled?: boolean,
    type?: 'solid' | 'clear' | 'outline',
    size?: 'sm' | 'md' | 'lg'
};

export default function Button(props: Props) {
    let style = 'bg-blue-500 hover:bg-blue-700 text-white';

    if(props.type === 'clear')
        style = 'hover:bg-gray-200 text-blue-500';

    if(props.type === 'outline')
        style = 'border border-gray-500 hover:bg-gray-100 text-gray-700';

    if(props.disabled)
        style = 'bg-blue-200 text-neutral-50';

    if(props.size === 'sm')
        style += ' py-1 px-2';
    else
        style += ' py-2 px-4';

    return (
        <button onClick={props.onClick} className={`font-bold rounded focus:shadow-outline ${style} ${props.className}`} disabled={props.disabled} >
            {props.children}
        </button>
    );
}