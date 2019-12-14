import React, { useState } from 'react';
import axios from 'axios';

const Delete = () => {
    const [userData, setUserData] = useState({
        email: '',
        
    });
    const [errorData ] = useState({ errors: null });

    const { email } = userData;
    const { errors } = errorData;

    const onChange = e => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value

        })

    }

    const deleteUser = user => {
        const config = {
            headers: {
                'x-auth-token': email

            }

        };

        axios
            .delete(`http://localhost:5000/api/users/${user.email}`, config)
            .catch(error => {
                console.error(`Error deleting user: ${user}`);

            });

    };

    return (
        <div>
            <h2>Delete User</h2>

            <div>
                <input
                    type="text"
                    placeholder="User to Delete"
                    name="email"
                    value={email}
                    onChange={e => onChange(e)} />

            </div>
            <div>
                <button onClick={() => deleteUser()}>Delete</button>

            </div>
            <div>
                {errors && errors.map(error =>
                    <div key={error.msg}>{error.msg}</div>)}

            </div>

        </div>

    )

}

export default Delete;