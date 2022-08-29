import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";

import Nav from "./components/Nav";
import SignUp from "./pages/SignUp/SignUp";
import LogIn from "./pages/LogIn/LogIn";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/Profile/EditProfile";
import Modal from "./components/Modal";
import SignUpWrapper from "./pages/SignUp/SignUpWrapper";

const Container = styled.div`
  padding-top: 6rem;
  max-width: 900px;
  margin: auto;
  display: flex;
  justify-content: center;
  position: relative;
`;

export default function App() {

  return (
    <BrowserRouter>
      <Nav />
      <Container>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/edit-profile' element={<EditProfile />} />
          <Route path='/signup' element={<SignUpWrapper />} />
          <Route path='/login' element={<LogIn />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}