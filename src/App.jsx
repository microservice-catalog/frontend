// src/App.jsx
import React from 'react';
import {Route, Routes} from 'react-router-dom';
import LoginPageContainer from "./pages/login/LoginPageContainer.jsx";
import HeaderContainer from "./components/header/HeaderContainer.jsx";
import RegisterPageContainer from "./pages/register/RegisterPageContainer.jsx";
import ProfilePageContainer from "./pages/profile/ProfilePageContainer.jsx";
import HomePageContainer from "./pages/home/HomePageContainer.jsx";
import ProjectPageContainer from "./pages/project/ProjectPageContainer.jsx";


function App() {

    return (
        <div className="ASDASFDAFA-container">
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
                        path="/projects/:username/:projectName"
                        element={<ProjectPageContainer/>}
                    />
                </Routes>
            </HeaderContainer>
        </div>
    );
}

export default App;