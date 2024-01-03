import './App.css'
import Header from "./components/header.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/home/home-page.jsx";
import AboutPage from "./pages/about/about-page.jsx";
import SignInPage from "./pages/auth/sign-in-page.jsx";
import SignInSuccessPage from "./pages/auth/sign-in-success-page.jsx";
import SignInFailedPage from "./pages/auth/sign-in-failed-page.jsx";
import {useEffect, useState} from "react";
import SignUpPage from "./pages/auth/sign-up-page.jsx";
import {DataContext, fetchProfile, fetchProfiles, STRAPI_URL} from "./utils/utils.js";
import AccountPage from "./pages/account/account-page.jsx";
import CbBuildingPage from "./pages/buildings/cb-building-page.jsx";
import RoomDetailsPage from "./pages/buildings/room-details-page.jsx";
import CbsBuildingPage from "./pages/buildings/cbs-building-page.jsx";
import CbeBuildingPage from "./pages/buildings/cbe-building-page.jsx";
import DepartmentPage from "./pages/buildings/department-page.jsx";
import ContactPage from "./pages/contact/contact-page.jsx";
import {jwtDecode} from "jwt-decode";
import Cookies from "universal-cookie";
import axios from "axios";

const App = () => {

    const [profiles, setProfiles] = useState(fetchProfiles);
    const [profile, setProfile] = useState(fetchProfile);
    const cookies = new Cookies();

    useEffect(() => {
        const token = cookies.get("fsuu_token");
        if(token) {
            const {id} = jwtDecode(token);
            axios.get(`${STRAPI_URL}/api/users/${id}?populate=*`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                setProfile({...res.data, token});
            }).catch(error => {
                console.log(error);
            })
        }
    }, []);

    const handleProfile = (profileData) => {
        setProfile(profileData);
        localStorage.setItem("profile", JSON.stringify(profileData));
    }

    const addProfile = (profileData) => {
        const newProfiles = [...profiles, profileData];
        setProfiles(newProfiles);
        handleProfile(profileData);
        localStorage.setItem("profiles", JSON.stringify(newProfiles));
    }

    const handleLogin = (profileData) => {
        const {token} = profileData;
        const decoded = jwtDecode(token);
        setProfile(profileData);
        cookies.set("fsuu_token", token, {
            expires: new Date(decoded.exp * 1000)
        })
    }

    const handleLogout = () => {
        cookies.remove("fsuu_token");
        setProfile({});
    }

    return (
        <DataContext.Provider value={{ profile, handleLogin, handleLogout }}>
            <BrowserRouter>
                <Routes>
                    <Route index element={<HomePage profile={profile}/>}/>
                    <Route path="/home" element={<HomePage profile={profile}/>}/>
                    <Route path="/about" element={<AboutPage profile={profile}/>}/>
                    <Route path="/signin" element={<SignInPage profile={profile} profiles={profiles} handleProfile={handleProfile}/>}/>
                    <Route path="/signup" element={<SignUpPage profile={profile} addProfile={addProfile}/>}/>
                    <Route path="/account" element={<AccountPage profile={profile} handleProfile={handleProfile}/>}/>
                    <Route path="/contact-us" element={<ContactPage profile={profile}/>}/>
                    <Route path="/signin/success" element={<SignInSuccessPage profile={profile}/>}/>
                    <Route path="/signin/failed" element={<SignInFailedPage profile={profile}/>}/>
                    <Route path="/building/cb" element={<CbBuildingPage profile={profile}/>}/>
                    <Route path="/building/cbs" element={<CbsBuildingPage profile={profile}/>}/>
                    <Route path="/building/cbe" element={<CbeBuildingPage profile={profile}/>}/>
                    <Route path="/department" element={<DepartmentPage profile={profile}/>}/>
                    <Route path="/building/room-details" element={<RoomDetailsPage profile={profile}/>}/>
                </Routes>
            </BrowserRouter>
        </DataContext.Provider>
    )
}

export default App;
