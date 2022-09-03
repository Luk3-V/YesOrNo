import { forwardRef, Ref } from "react";

type Props = {
    children?: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
};

const Card = forwardRef((props: Props, ref: any) => {
    let style = "bg-white shadow-md rounded-md";

    if(props.size === 'sm')
        style += " px-4 py-4";
    else
        style += " px-8 py-8";

    return (
        <div className={style + ' ' + props.className} ref={ref}>
            {props.children}
        </div>
    );
});
export default Card;