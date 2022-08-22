import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";

import { AppDispatch, RootState } from './store/store';
import { useSelector, useDispatch } from 'react-redux';

import Nav from "./components/Nav";
import SignUp from "./pages/SignUp/SignUp";
import LogIn from "./pages/LogIn/LogIn";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import { userSignOut } from "./store/UserSlice";

const Container = styled.div`
  padding-top: 6rem;
  max-width: 900px;
  margin: auto;
  display: flex;
  justify-content: center;
`;

export default function App() {
  const user = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()
  
  const handleLogOut = (e:React.SyntheticEvent) => {
    dispatch(userSignOut());
  }

  return (
    <BrowserRouter>
      <Nav handleLogOut={handleLogOut}/>
      <Container>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<LogIn />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}