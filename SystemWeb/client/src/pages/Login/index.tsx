import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://localcentersystem.onrender.com/auth/login', {
                email,
                password,
            });
            console.log(res.data);
            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('email', res.data.user.email); 
            navigate("/");
        } catch (err) {
            setError('Đăng nhập thất bại');
        }
    };

    return (
        <div className="bg-cover bg-center h-screen w-full" style={{ backgroundImage: 'url(/bg.png)' }}>
            <div className="container mx-auto flex flex-row items-center justify-between py-10">
                <div className="text-white text-5xl font-bold">
                    <a href="/" className="flex flex-row gap-5">
                        <img src="./logo.svg" alt="" />
                        <span className="font-bold text-3xl">SystemCenter</span>
                    </a>
                </div>
                <div className="flex flex-row gap-2 text-white">
                    <img
                        className="h-8 rounded-md"
                        src="https://i.pinimg.com/564x/26/79/04/2679047a33c2f3d3a3ed6e676c65450d.jpg"
                        alt=""
                    />{' '}
                    EN
                </div>
            </div>
            <div className="flex flex-col items-center gap-12 text-white">
                <div className="text-8xl font-extrabold">
                    <img src="./logo.svg" alt="" />
                </div>
                <div className="text-6xl">Sign in</div>
                <div>Please login with your HUST's email account.</div>
                <form className="flex flex-col w-1/4 gap-10">
                    <input
                        required
                        className="px-5 py-2.5 rounded-[15px] bg-[#1C4857] border-none outline-none"
                        type="email"
                        placeholder="Email"
                        id="account"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        required
                        className="px-5 py-2.5 rounded-[15px] bg-[#1C4857] border-none outline-none"
                        type="password"
                        placeholder="Password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="px-5 py-2.5 rounded-[15px] font-bold bg-green-500 cursor-pointer hover:bg-green-600 active:bg-green-700" onClick={handleLogin}>
                        Login
                    </button>
                </form>
                {error && <span className="flex justify-center text-orange-500">{error} !!!</span>}
            </div>
        </div>
    );
}

export default Login;

