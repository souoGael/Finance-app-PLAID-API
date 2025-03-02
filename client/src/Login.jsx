import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login(){
    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate("/signup");
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/login', {email, password})
        .then(result => { 
            console.log(result)
            if(result.data === "Success"){
                console.log(result.data)
                navigate("/home")
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
            <div className='bg-white p-3 rounded w-25'> 
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type='email'
                            placeholder='Enter Email'
                            autoComplete='off'
                            name='email' // delete this line if useless
                            className='form-control rounded-0'
                            onChange={(e) => setEmail(e.target.value)}
                        />    
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email">
                            <strong>Password</strong>
                        </label>
                        <input
                            type='password'
                            placeholder='Enter Password'
                            autoComplete='off'
                            name='password'
                            className='form-control rounded-0'
                            onChange={(e) => setPassword(e.target.value)}
                        />    
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'>
                        Login
                    </button>
                    <a href='' onClick={handleNavigation}> <p className='text-center'>Don't have an account yet?</p> </a>
                </form>
            </div>
        </div>
    )
}

export default Login;