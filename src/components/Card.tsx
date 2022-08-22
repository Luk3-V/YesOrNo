type Props = {
    children?: React.ReactNode;
    className?: string;
};

export default function Card(props: Props) {
    return (
        <div className={"bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 " + props.className}>
            {props.children}
        </div>
    );
}