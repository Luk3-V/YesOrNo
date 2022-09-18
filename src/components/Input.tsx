import { forwardRef } from "react";

const Input = forwardRef((props: any, ref: any) => {
    let inputClasses = "border-gray-200 hover:border-gray-400 bg-gray-100 appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-2";
    let darkClasses = "dark:border-neutral-600 dark:hover:border-neutral-400 dark:bg-neutral-700"

    if(props.error) {
        inputClasses = "border-red-600 bg-gray-100 appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-2 focus:outline-red-600";
        darkClasses = "dark:border-red-600 dark:bg-neutral-700 dark:focus:outline-red-600";
    }

    return (
        <>
            {props.type === 'textarea' ? 
            <textarea 
                className={`${inputClasses} ${darkClasses} ${props.className}`}
                {...props}
                ref={ref}
            /> : 
            <input 
                className={`${inputClasses} ${darkClasses} ${props.className}`} 
                {...props}
                ref={ref}
            />}
        </>
    );
});
export default Input;