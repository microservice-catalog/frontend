// src/App.jsx
import React from 'react';
import {Route, Routes} from 'react-router-dom';
import LoginPageContainer from "./pages/login/LoginPageContainer.jsx";
import HeaderContainer from "./components/header/HeaderContainer.jsx";
import RegisterPageContainer from "./pages/register/RegisterPageContainer.jsx";
import ProfilePageContainer from "./pages/profile/ProfilePageContainer.jsx";
import HomePageContainer from "./pages/home/HomePageContainer.jsx";


function App() {

    return (
        <div className="app-container">
            <HeaderContainer/>

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
            </Routes>

        </div>
    );
}

export default App;