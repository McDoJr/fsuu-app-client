import styles from "./sign-in-page.module.css";
import Header from "../../components/header.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {DataContext, STRAPI_URL} from "../../utils/utils.js";
import axios from "axios";

const SignUpPage = ({profile, addProfile}) => {

    const navigate = useNavigate();

    const {handleLogin} = useContext(DataContext);

    const [formData, setFormData] = useState({firstname: "", lastname: "", student_id: "", email: "", password: "", confirm_password: ""});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${STRAPI_URL}/api/auth/local/register`, {
            ...formData, username: formData.firstname
        }).then(res => {
                const {user, jwt} = res.data;
                handleLogin({...user, token: jwt});
                navigate("/signin/success");
        }).catch(error => {
                console.log(error);
                navigate("/signin/failed", {state:{url: "/signup"}});
        })
    }

    return (
        <>
            <Header profile={profile}/>
            <section className={styles.container}>
                <div className={styles.blur}>
                    <form className={styles.box} onSubmit={handleSubmit}>
                        <h3>Sign up</h3>
                        <h4>Create your account</h4>
                        <input type="text" placeholder="enter your first name" name="firstname" onChange={handleChange}/>
                        <input type="text" placeholder="enter your last name" name="lastname" onChange={handleChange}/>
                        <input type="text" placeholder="enter your student id" name="student_id" onChange={handleChange}/>
                        <input type="text" placeholder="enter your email" name="email" onChange={handleChange}/>
                        <input type="password" placeholder="enter your password" name="password" onChange={handleChange}/>
                        <input type="password" placeholder="enter your password" name="confirm_password" onChange={handleChange}/>
                        <button>SIGN UP</button>
                        <p>Already have an account? <Link to="/signin">Sign In</Link></p>
                        <span>By registering, You agree to the</span>
                        <span>Terms, Conditions and Policies of FSUU </span>
                        <span>ROOM LOCATOR & Privacy Policy.</span>
                    </form>
                </div>
            </section>
        </>
    )
}

export default SignUpPage;