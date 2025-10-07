import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
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

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let hasError = false;
        const newErrors = { email: "", password: "", login: "" };

        if (!email.trim()) {
            newErrors.email = "Vui lòng nhập email";
            hasError = true;
        }
        if (!password.trim()) {
            newErrors.password = "Vui lòng nhập mật khẩu";
            hasError = true;
        }

        setErrors(newErrors);
        if (hasError) return;

        // ✅ Kiểm tra tài khoản admin
        if (email === "admin@gmail.com" && password === "admin123") {
            alert("Đăng nhập thành công (Admin)");
            navigate("/manager/subject");
            return;
        }

        // ✅ Kiểm tra tài khoản người dùng trong db.json
        try {
            const res = await axios.get(`http://localhost:8080/users?email=${email}`);
            const user = res.data[0];

            if (!user) {
                setErrors((prev) => ({
                    ...prev,
                    login: "Email không tồn tại trong hệ thống.",
                }));
                return;
            }

            if (user.password !== password) {
                setErrors((prev) => ({
                    ...prev,
                    login: "Mật khẩu không đúng.",
                }));
                return;
            }

            // ✅ Nếu đăng nhập thành công
            alert("Đăng nhập thành công!");
            if (remember) {
                localStorage.setItem("user", JSON.stringify(user));
            }

            navigate("/home"); // Chuyển đến trang Home
        } catch (err) {
            console.error(err);
            alert("Đăng nhập thất bại, vui lòng thử lại sau.");
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
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <span className="error-message">{errors.password}</span>

                {errors.login && (
                    <span className="error-message">{errors.login}</span>
                )}

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

            <p style={{ fontSize: "13px", color: "#555", marginTop: "8px" }}>
                <strong>Tài khoản Admin:</strong><br />
                Email: admin@gmail.com <br />
                Mật khẩu: admin123
            </p>
        </div>
    );
}

export default Login;
