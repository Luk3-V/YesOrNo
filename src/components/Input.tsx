import { forwardRef, Ref } from "react";

const Input = forwardRef((props: any, ref: any) => {
    let inputClasses = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-2";

    if(props.error)
        inputClasses = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight border border-red-600 focus:outline-2 focus:outline-red-600";

    return (
        <>
            {props.type === 'textarea' ? 
            <textarea 
                className={inputClasses + ' ' + props.className}
                {...props}
                ref={ref}
            /> : 
            <input 
                className={inputClasses + ' ' + props.className} 
                {...props}
                ref={ref}
            />}
        </>
    );
});
export default Input;