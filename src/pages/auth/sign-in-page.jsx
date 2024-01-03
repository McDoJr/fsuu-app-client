import styles from "./sign-in-page.module.css";
import Header from "../../components/header.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {checkAdmin, DataContext, STRAPI_URL} from "../../utils/utils.js";
import axios from "axios";

const SignInPage = ({profile, profiles, handleProfile}) => {

    const navigate = useNavigate();

    const {handleLogin} = useContext(DataContext);
    const [formData, setFormData] = useState({email: "", password: ""});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const checkUser = (email, password) => {
        return profiles.filter(data => data.email === email && data.password === password).length > 0;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const {email, password} = formData;
        axios.post(`${STRAPI_URL}/api/auth/local`, {
            identifier: email, password
        }).then(res => {
            const {user, jwt} = res.data;
            handleLogin({...user, token: jwt});
            navigate("/signin/success");
        }).catch(error => {
            console.log(error);
            navigate("/signin/failed", {state:{url: "/signin"}});
        })
        setFormData({email: "", password: ""});
    }

    return (
        <>
            <Header profile={profile}/>
            <section className={styles.container}>
                <div className={styles.blur}>
                    <form className={styles.box} onSubmit={handleSubmit}>
                        <h3>Sign in</h3>
                        <h4>Let's get started</h4>
                        <input type="text" placeholder="enter your email" name="email" onChange={handleChange}/>
                        <input type="password" placeholder="enter your password" name="password" onChange={handleChange}/>
                        <button>SIGN IN</button>
                        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                        <span>By registering, You agree to the</span>
                        <span>Terms, Conditions and Policies of FSUU </span>
                        <span>ROOM LOCATOR & Privacy Policy.</span>
                    </form>
                </div>
            </section>
        </>
    )
}

export default SignInPage;