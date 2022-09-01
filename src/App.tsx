import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import styled from "styled-components";

import Nav from "./components/Nav";
import SignUp from "./pages/SignUp/SignUp";
import LogIn from "./pages/LogIn/LogIn";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/Profile/EditProfile";
import Modal from "./components/Modal";
import SignUpWrapper from "./pages/SignUp/SignUpWrapper";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, getStatus, loadUserProfile } from "./store/UserSlice";
import { AppDispatch } from "./store/store";

function LoggedInRoutes() {
  const status = useSelector(getStatus);
  return ( status === 'success' ? <Outlet /> : <Navigate to='/' /> );
}

function LoggedOutRoutes() {
  const status = useSelector(getStatus);
  return ( status === 'idle' ? <Outlet /> : <Navigate to='/' /> );
}

const Container = styled.div`
  padding-top: 6rem;
  max-width: 900px;
  margin: auto;
  display: flex;
  justify-content: center;
`;

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector(getProfile);

  const [loading, setLoading] = useState(true);

  auth.onAuthStateChanged(async (user) => {
    if(user)
      localStorage.setItem("signedin", user.uid);
    else
      localStorage.removeItem("signedin");
  });

  // on mount, load user in session
  useEffect(() => {
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
            <Route path='/profile/:username' element={<Profile />}>
              <Route path='edit' element={<EditProfile />} />
            </Route>
            <Route element={<LoggedOutRoutes />}>
              <Route path='/signup' element={<SignUpWrapper />} />
              <Route path='/login' element={<LogIn />} />
            </Route>
            <Route path='*' element={<>404 NOT FOUND</>} />
          </Routes>
        </Container>
      </>}
    </BrowserRouter>
  );
}