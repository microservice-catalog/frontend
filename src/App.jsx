// src/App.jsx
import React from 'react';
import {Route, Routes} from 'react-router-dom';
import LoginPageContainer from "./pages/login/LoginPageContainer.jsx";
import HeaderContainer from "./components/header/HeaderContainer.jsx";
import RegisterPageContainer from "./pages/register/RegisterPageContainer.jsx";
import ProfilePageContainer from "./pages/profile/ProfilePageContainer.jsx";
import HomePageContainer from "./pages/home/HomePageContainer.jsx";
import ProjectPageContainer from "./pages/project/ProjectPageContainer.jsx";
import UserProfilePageContainer from "./pages/profile/UserProfilePageContainer.jsx";


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
                    path="/profile"
                    element={<ProfilePageContainer/>}
                />
                <Route
                    path="/:username"
                    element={<UserProfilePageContainer/>}
                />
                <Route
                    path="/:username/:projectName"
                    element={<ProjectPageContainer/>}
                />
            </Routes>
        </HeaderContainer>
    );
}

export default App;