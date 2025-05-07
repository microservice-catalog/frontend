// src/App.jsx
import React from 'react';
import {Route, Routes} from 'react-router-dom';
import LoginPageContainer from "./pages/login/LoginPageContainer.jsx";
import HeaderContainer from "./components/header/HeaderContainer.jsx";
import RegisterPageContainer from "./pages/register/RegisterPageContainer.jsx";
import HomePageContainer from "./pages/home/HomePageContainer.jsx";
import ProjectPageContainer from "./pages/project/ProjectPageContainer.jsx";
import UserProfilePageContainer from "./pages/profile/UserProfilePageContainer.jsx";
import UserEditPage from "./pages/profile/UserEditPage.jsx";


function App() {

    return (
        <HeaderContainer>
            <Routes>
                <Route
                    path="/"
                    element={<HomePageContainer/>}
                />
                <Route
                    path="/login"
                    element={<LoginPageContainer/>}
                />
                <Route
                    path="/register"
                    element={<RegisterPageContainer/>}
                />
                <Route
                    path="/:username"
                    element={<UserProfilePageContainer/>}
                />
                <Route path="/:username/edit" element={<UserEditPage/>}/>
                <Route
                    path="/:username/:projectName"
                    element={<ProjectPageContainer/>}
                />
            </Routes>
        </HeaderContainer>
    );
}

export default App;