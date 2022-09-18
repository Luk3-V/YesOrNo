import { useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import Card from "./Card";

const ModalWrapper = styled.div`
    position: fixed;
    z-index: 100;
    background-color: rgba(0, 0, 0, .6);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center; 
    padding: 0 20px;
`;

type Props = {
    children?: React.ReactNode;
    className?: string;
};

export default function Modal(props: Props) {
    useEffect(() => {
        document.body.style.overflowY = "hidden";
        return () => {
            document.body.style.overflowY = "overlay";
        }
    }, []);

    return createPortal(
        <ModalWrapper>
            <Card className="shadow-lg">
                {props.children}
            </Card>
        </ModalWrapper>,
        document.getElementById("modal_root") as Element
    );
}