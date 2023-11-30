import { zUserRoute } from "../../routes/route";
import { BrowserRouter as Router, Route, Redirect, Routes, useParams, useLocation } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import MetaTag from "../MetaTag";
import Headers from "../../common/Headers";
import ScrollToTopButton from "../ScrollToTopButton";
import BottomMenu from "../../common/BottomMenu";
import Footer from "../../common/Footer";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
const UserLayout = () => {
    const location = useLocation();
    const nonLayoutList = ['/', '/login', '/findmyinfo', '/signup', '/randombox/lottery'];

    return (
        <>
            <AnimatePresence>
                {nonLayoutList.includes(location.pathname) || location.pathname.includes('/signup') ?
                    <>

                        <Routes location={location} key={location.pathname}>
                            {zUserRoute.map((route, idx) => (
                                <>
                                    <Route exact key={idx} path={route.link} element={route.element} />
                                </>
                            ))}

                        </Routes>
                    </>
                    :
                    <>
                        <Headers />
                        <ScrollToTop />
                        <MetaTag />
                        <>
                            <Routes location={location} key={location.pathname}>
                                {zUserRoute.map((route, idx) => (
                                    <>
                                        <Route exact key={idx} path={route.link} element={route.element} />
                                    </>
                                ))}

                            </Routes>
                        </>
                        <ScrollToTopButton />
                        {/* <BottomMenu /> */}
                        <Footer />
                    </>
                }
            </AnimatePresence>
        </>
    )
}
export default UserLayout;