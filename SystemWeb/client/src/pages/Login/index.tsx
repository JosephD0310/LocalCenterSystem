import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        account: '',
        password: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const checkHustTeacher = async (account: string, password: string) => {
        try {
            const res = await axios.post('http://localhost:3000/auth/login', {
                email: account,
                password: password,
            });
    
            if (res.data.success) {
                return {
                    success: true,
                    message: 'Là giáo viên HUST',
                };
            } else {
                return {
                    success: false,
                    message: 'Sai tài khoản hoặc mật khẩu',
                };
            }
        } catch (error: any) {
            console.error('Lỗi khi gọi API HUST:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Lỗi kết nối đến hệ thống HUST',
            };
        }
    };

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const result = await checkHustTeacher(credentials.account, credentials.password);
        if (result.success) {
            navigate('/');
            console.log(result.message)
        } else {
            setError(result.message);
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
                        value={credentials.account}
                        onChange={handleChange}
                    />
                    <input
                        required
                        className="px-5 py-2.5 rounded-[15px] bg-[#1C4857] border-none outline-none"
                        type="password"
                        placeholder="Password"
                        id="password"
                        value={credentials.password}
                        onChange={handleChange}
                    />
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-2">
                            <input className="p-5" type="checkbox" id="rememberMe" />
                            <label htmlFor="rememberMe">Remember me</label>
                        </div>
                        <div className="text-green-500">Forgot password?</div>
                    </div>
                    <button className="px-5 py-2.5 rounded-[15px] bg-[#02E079]" onClick={handleLogin}>
                        Login
                    </button>
                </form>
                {error && <span className="flex justify-center text-orange-500">{error} !!!</span>}
            </div>
        </div>
    );
}

export default Login;
