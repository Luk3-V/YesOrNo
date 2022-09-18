import { forwardRef } from "react";

type Props = {
    children?: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
};

const Card = forwardRef((props: Props, ref: any) => {
    let style = "shadow-sm rounded-md border bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 ";

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