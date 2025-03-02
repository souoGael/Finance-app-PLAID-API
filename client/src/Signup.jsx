import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function Signup(){
    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate("/login");
    };

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/signup', {name, email, password})
        .then(result => console.log(result))
        .catch(err => console.log(err))
    }

    return (
        <div className='d-flex justify-content-center align-items-center bg-secondary vh-100'>
            <div className='bg-white p-3 rounded w-25'> 
                <h2> Sign up</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email">
                            <strong>Name</strong>
                        </label>
                        <input
                            type='text'
                            placeholder='Enter Name'
                            autoComplete='off'
                            name='email'
                            className='form-control rounded-0'
                            onChange={(e) => setName(e.target.value)}
                        />    
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type='email'
                            placeholder='Enter Email'
                            autoComplete='off'
                            name='email'
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
                        Sign Up
                    </button>
                    <a href='' onClick={handleNavigation}> <p className='text-center'>Already have an account?</p> </a>
                </form>
            </div>
        </div>
    )
}

export default Signup;