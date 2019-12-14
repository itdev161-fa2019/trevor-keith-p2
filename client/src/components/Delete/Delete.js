import React, { useState } from 'react';
import axios from 'axios';

const Delete = () => {
    const [userData, setUserData] = useState({
        email: '',
        
    });
    const [errorData, setErrorData] = useState({ errors: null });

    const { email } = userData;
    const { errors } = errorData;

    const onChange = e => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value

        })

    }

    const deleteUser = async () => {
        const userDelete = {
            email: email

        }

        debugger;

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'

                }

            }

            debugger;

            if(.email !== userDelete.email) {
                await axios.post('http://localhost:5000/api/delete', email, config);

                await userDelete.remove();

            }

            userDelete.remove();

        } catch(error) {
            setErrorData({
                ...errors,
                errors: error.response.data.errors
            
            })

        }

    }

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