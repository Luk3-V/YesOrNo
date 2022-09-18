import { forwardRef, ReactNode } from "react";

type Props = {
    onClick: (values: any) => void;
    children?: React.ReactNode;
    className?: string,
    disabled?: boolean,
    type?: 'solid' | 'clear' | 'outline' | 'circle' | 'warning',
    size?: 'sm' | 'md' | 'lg',
    icon?: ReactNode
};

const Button = forwardRef((props: Props, ref: any) => {
    let style = 'rounded bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white';
    let iconStyle= 'text-xl inline-block mr-3 align-middle';

    if(props.type === 'clear')
        style = 'rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-500 dark:text-blue-400';

    if(props.type === 'outline')
        style = 'rounded border border-gray-700 dark:border-gray-100 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 ';

    if(props.type === 'warning')
        style = 'rounded border text-red-500 dark:text-red-500 border-red-500 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-950 ';

    if(props.disabled)
        style = 'bg-blue-200 dark:bg-gray-700 text-gray-50 dark:text-gray-400 rounded';

    if(props.size === 'sm')
        style += ' py-1 px-2';
    else
        style += ' py-2 px-4';

    if(props.type === 'circle')
        style = 'hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-full';

    return (
        <button ref={ref} onClick={props.onClick} className={`font-bold focus:shadow-outline ${style} ${props.className}`} disabled={props.disabled} >
            {props.icon && 
            <div className={iconStyle}>
                {props.icon}
            </div>}
            {props.children}
        </button>
    );
});
export default Button;