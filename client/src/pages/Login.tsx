import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        login: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { email: "", password: "", login: "" };

        if (!email) {
            newErrors.email = "Vui lòng nhập email";
            hasError = true;
        }
        if (!password) {
            newErrors.password = "Vui lòng nhập mật khẩu";
            hasError = true;
        }

        setErrors(newErrors);

        if (!hasError) {
            console.log("Đăng nhập thành công:", { email, password, remember });
        }
    };

    return (
        <div className="container">
            <h2>Đăng nhập</h2>
            <p className="description">
                Đăng nhập tài khoản để sử dụng hệ thống quản lý.
            </p>
            <form id="loginForm" onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <span className="error-message">{errors.email}</span>

                <label>Mật khẩu</label>
                <input
                    id="password"
                    type="password"
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <span className="error-message">{errors.password}</span>

                <div className="options">
                    <div className="remember">
                        <input
                            className="checkbox"
                            type="checkbox"
                            id="remember"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        <label htmlFor="remember">Nhớ tài khoản</label>
                    </div>
                    <a href="#">Quên mật khẩu?</a>
                </div>

                <button type="submit">Đăng nhập</button>
            </form>

            <p className="login-link">
                Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
            </p>
        </div>
    );
}

export default Login;