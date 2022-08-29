import styled from "styled-components";

const ModalWrapper = styled.div`
    position: fixed;
    z-index: 5;
    background-color: rgba(0, 0, 0, .6);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;  
`;

type Props = {
    children?: React.ReactNode;
    className?: string;
};

export default function Modal(props: Props) {
    return (
        <ModalWrapper>
            <div className={"bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 " + props.className}>
                {props.children}
            </div>
        </ModalWrapper>
    );
}