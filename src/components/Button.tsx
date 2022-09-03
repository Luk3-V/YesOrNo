import { forwardRef, ReactNode } from "react";

type Props = {
    onClick: (values: any) => void;
    children?: React.ReactNode;
    className?: string,
    disabled?: boolean,
    type?: 'solid' | 'clear' | 'outline' | 'circle',
    size?: 'sm' | 'md' | 'lg',
    icon?: ReactNode
};

const Button = forwardRef((props: Props, ref: any) => {
    let style = 'bg-blue-500 hover:bg-blue-700 text-white';
    let iconStyle= 'text-2xl inline-block mr-3 align-middle';

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

    if(props.type === 'circle')
        style = 'hover:bg-gray-200 text-blue-500 p-1 rounded-full';

    return (
        <button ref={ref} onClick={props.onClick} className={`font-bold rounded focus:shadow-outline ${style} ${props.className}`} disabled={props.disabled} >
            {props.icon && 
            <div className={iconStyle}>
                {props.icon}
            </div>}
            {props.children}
        </button>
    );
});
export default Button;