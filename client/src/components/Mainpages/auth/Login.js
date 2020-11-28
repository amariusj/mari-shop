import axios from 'axios';
import React, { useState } from 'react'

import { Link } from 'react-router-dom'

function Login() {

    //Creates a state variable called user and sets
    //it equal to an object literal holding an email
    //and password key
    const [user, setUser] = useState({
        email: '', password:''
    })


    //Adds the onChange functionality
    const onChangeInput = e => {
        const {name, value} = e.target;
        setUser({...user, [name]:value});
    }

    const loginSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post('/users/login', {...user})

            localStorage.setItem('firstLogin', true)

            window.location.href = "/";
        } catch (err) {
            alert(err.response.data.msg);
        }
    }

    return(
        <div className="login-page">
            <form onSubmit={loginSubmit}>
                <h2>Login</h2>
                <input type="email" name="email" required placeholder="Email" value={user.email} onChange={onChangeInput} />
                <input type="password" name="password" required autoComplete="on" placeholder="Password" value={user.password} onChange={onChangeInput} />
                <div className="row">
                    <button type="submit">Login</button>
                    <Link to="/register">Register</Link>
                </div>
            </form>
        </div>
    )
}

export default Login