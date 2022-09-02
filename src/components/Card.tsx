import { forwardRef, Ref } from "react";

type Props = {
    children?: React.ReactNode;
    className?: string;
};

const Card = forwardRef((props: Props, ref: any) => {
    return (
        <div className={"bg-white shadow-md rounded-md px-8 py-8 " + props.className} ref={ref}>
            {props.children}
        </div>
    );
});
export default Card;