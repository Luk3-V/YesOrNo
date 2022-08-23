import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";

import Nav from "./components/Nav";
import SignUp from "./pages/SignUp/SignUp";
import LogIn from "./pages/LogIn/LogIn";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";

const Container = styled.div`
  padding-top: 6rem;
  max-width: 900px;
  margin: auto;
  display: flex;
  justify-content: center;
`;

export default function App() {

  return (
    <BrowserRouter>
      <Nav />
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