
type Props = {
    onClick: (values: any) => void;
    children?: React.ReactNode;
    className?: string,
    [key: string]: any;
};

export default function Button(props: Props) {
    return (
        <button onClick={props.onClick} className={`text-md font-medium text-primary rounded-full border-solid border-2 border-current px-3 py-1 ${props.className}`}>
            {props.children}
        </button>
    );
}