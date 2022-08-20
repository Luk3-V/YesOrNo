import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";

import type { RootState } from './store/store';
import { useSelector, useDispatch } from 'react-redux';
import { signup, signout, signin } from './store/UserSlice';

import Nav from "./components/Nav";
import SignUp from "./pages/SignUp/SignUp";
import LogIn from "./pages/LogIn/LogIn";

const Container = styled.div`
  padding-top: 6rem;
  max-width: 1200px;
  margin: auto;
  display: flex;
  justify-content: center;
`;

export default function App() {
  const count = useSelector((state: RootState) => state.user.value)
  const dispatch = useDispatch()
  
  const handleSignUp = (e:React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    dispatch(signup(target));
  }
  const handleLogOut = (e:React.SyntheticEvent) => {
    dispatch(signout());
  }
  const handleLogIn = (e:React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    dispatch(signin(target));
  }

  return (
    <BrowserRouter>
      <Nav handleLogOut={handleLogOut}/>
      <Container>
        <Routes>
          <Route path='/signup' element={<SignUp handleSignUp={handleSignUp}/>} />
          <Route path='/login' element={<LogIn handleLogIn={handleLogIn}/>} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}