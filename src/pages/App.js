import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Routes } from "react-router-dom";
import ScrollToTop from '../components/ScrollToTop';
import Headers from '../common/Headers';
import BottomMenu from '../common/BottomMenu';
import Footer from '../common/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import MetaTag from '../components/MetaTag';
import { useState } from 'react';
import { zManagerRoute, zUserRoute } from '../routes/route';
import ManagerLayout from '../components/layouts/ManagerLayout';
import UserLayout from '../components/layouts/UserLayout';
import toast, { Toaster } from 'react-hot-toast';
const App = () => {
    return (
        <>
            <Router>
                <UserLayout />
                <Toaster position={'top-right'} containerStyle={{ zIndex: 999 }} />
            </Router>
            <Router>
                <ManagerLayout />
            </Router>
        </>
    );
}


export default App