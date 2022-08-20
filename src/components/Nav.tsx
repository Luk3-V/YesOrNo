import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

import Button from "./Button";

const NavWrapper = styled.div`
    position: fixed;
    width: 100%;
    border-bottom: 2px solid black;
    z-index: 2;
    padding: 0 20px;
`;

const NavDiv = styled.div`
    max-width: 1200px;
    height: 4rem;
    margin: auto;
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

interface Props {  
    handleLogOut: (values: any) => void
}
export default function Nav(props: Props) {
    const navitgate = useNavigate();

    return (
        <NavWrapper>
            <NavDiv>
                <button onClick={() => navitgate('/')} className="text-2xl font-medium text-primary">Pollify</button>
                <div>
                    <Button onClick={() => {}}>Create Poll</Button>
                    <Button onClick={() => navitgate('/signup')}>Signup</Button>
                    <Button onClick={() => navitgate('/login')}>Login</Button>
                    <Button onClick={props.handleLogOut}>Logout</Button>
                </div>
            </NavDiv>
        </NavWrapper>     
    );
}