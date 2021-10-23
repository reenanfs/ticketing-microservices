import axios from 'axios';
import {useState} from 'react';


const signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, SetErrors] = useState([]);

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/api/users/signup', {email, password});
        } catch(err) {
            SetErrors(err.response.data.errors);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-control"
                />
                <label>Password</label>
                <input 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    className="form-control"
                />
                <button className="btn btn-primary">Sign Up</button>

                {errors.length > 0 && (<div className="alert alert-danger">
                    <h6>Oops...</h6>
                    <ul className="my-0">
                       {errors.map(error => {
                           return <li key={error.message}>{error.message}</li>
                       })} 
                    </ul>
                </div>)}
            </div>
        </form>
    );
};

export default signup;