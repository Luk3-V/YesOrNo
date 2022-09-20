import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import styled from "styled-components";

import Nav from "./components/Nav";
import SignUp from "./pages/SignUp/SignUp";
import LogIn from "./pages/LogIn/LogIn";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { getStatus, loadUserProfile } from "./store/UserSlice";
import { AppDispatch } from "./store/store";
import CreateProfile from "./pages/Create/CreateProfile";
import { FaGithub } from "react-icons/fa";

function LoggedInRoutes() {
  const status = useSelector(getStatus);
  return ( status === 'success' ? <Outlet /> : <Navigate to='/' /> );
}

function LoggedOutRoutes() {
  const status = useSelector(getStatus);
  return ( status !== 'success' ? <Outlet /> : <Navigate to='/' /> );
}

const Container = styled.div`
  margin: auto;
  display: flex;
  justify-content: center;

  padding: 6rem 30px 0 20px;
  max-width: 900px;
  @media only screen and (hover: none) and (pointer: coarse){
    padding: 6rem 20px 0 20px;
  }
`;

export default function App() {
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(true);

  auth.onAuthStateChanged(async (user) => {
    if(user)
      localStorage.setItem("signedin", user.uid);
    else
      localStorage.removeItem("signedin");
  });

  // on mount, load user in session
  useEffect(() => {
    console.log('app mount');
    const signedin = localStorage.getItem("signedin");
    if(signedin)
      dispatch(loadUserProfile(signedin)).then(() => setLoading(false));
    else 
      setLoading(false);
  }, []);

  return (
    <BrowserRouter>
      {!loading && <>
        <Nav />
        <Container>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/profile/:username/*' element={<Profile />} />
            <Route element={<LoggedOutRoutes />}>
              <Route path='/signup' element={<SignUp />} />
              <Route path='/login' element={<LogIn />} />
            </Route>
            <Route element={<LoggedInRoutes />}>
              <Route path='/create' element={<CreateProfile />} />
            </Route>
            <Route path='*' element={<>404 NOT FOUND</>} />
          </Routes>
        </Container>
      </>}
    </BrowserRouter>
  );
}