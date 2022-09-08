import { createPortal } from "react-dom";
import styled from "styled-components";

const ModalWrapper = styled.div`
    position: absolute;
    z-index: 100;
    background-color: rgba(0, 0, 0, .6);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;  
`;

type Props = {
    children?: React.ReactNode;
    className?: string;
};

export default function Modal(props: Props) {
    return createPortal(
        <ModalWrapper>
            <div className={"bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 " + props.className}>
                {props.children}
            </div>
        </ModalWrapper>,
        document.getElementById("modal_root") as Element
    );
}