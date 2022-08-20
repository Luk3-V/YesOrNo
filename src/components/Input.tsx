
export default function Input(props: any) {
    return (
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline" id={props.id} type={props.type} placeholder={props.placeholder} />
    );
}