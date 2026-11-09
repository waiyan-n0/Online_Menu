import {useState} from "react";
import {useNavigate} from "react-router-dom";

const Login = () =>{
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const API_URL = "http://localhost:3000";

    const handleLogin = async(e) =>{
        e.preventDefault();
        console.log(username, password);
        const response = await fetch(`${API_URL}/menu/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        console.log(data);
        if(!response.ok){
            setError(true);
            console.log('error: ',error);
            return;
        }
        navigate(`/menu/${data.result.slug}#edit`);
    }
    return(
        <div>
            <form onSubmit={handleLogin}
                  className="flex flex-col gap-3 max-w-sm mx-auto p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-1">Admin Login</h2>

                <input type="text" name="username" placeholder="Username"
                    value={username} onChange={(e) => setUsername(e.target.value)} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-gray-900 transition-colors"
                />

                <input type="password" name="password" placeholder="Password"
                    value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-gray-900 transition-colors"
                />

                <button type="submit"
                    className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors mt-2 cursor-pointer"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;