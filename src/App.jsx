// src/App.jsx
import React from 'react';
import {Route, Routes} from 'react-router-dom';
import LoginPageContainer from "./pages/LoginPageContainer.jsx";
import HeaderContainer from "./pages/HeaderContainer.jsx";


function App() {

    return (
        <div className="app-container">
            <HeaderContainer/>

            <Routes>
                <Route
                    path="/login"
                    element={<LoginPageContainer/>}
                />
            </Routes>

        </div>
    );
}

export default App;