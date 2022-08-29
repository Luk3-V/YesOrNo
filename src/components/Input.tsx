
export default function Input(props: any) {
    let inputClasses = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-2";

    if(props.error)
        inputClasses = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight border border-red-600 focus:outline-2 focus:outline-red-600";

    return (
        <>
            {props.type === 'textarea' ? 
            <textarea 
                className={inputClasses + ' ' + props.className}
                id={props.id} placeholder={props.placeholder} value={props.value} onChange={props.onChange} rows={props.rows} cols={props.cols}/> : 
            <input 
                className={inputClasses + ' ' + props.className} 
                id={props.id} type={props.type} placeholder={props.placeholder} value={props.value} onChange={props.onChange} minLength={props.minLength}
            />}
        </>
    );
}