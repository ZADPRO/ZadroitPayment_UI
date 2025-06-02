import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import SportsApp from '../Pages/SportsApp/SportsApp';


const MainRoutes: React.FC = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/sportsapp/payment" element={<SportsApp />} />
                </Routes>
            </Router>
        </div>
    );
};

export default MainRoutes;