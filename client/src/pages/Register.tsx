import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Register.css";

export default function Register() {
    const navigate = useNavigate();

    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [terms, setTerms] = useState(false);

    const [errors, setErrors] = useState({
        lastname: "",
        firstname: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: "",
    });

    // Validation form
    const validate = () => {
        let newErrors = {
            lastname: "",
            firstname: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: "",
        };

        if (!lastname.trim()) newErrors.lastname = "Họ và tên đệm không được để trống";
        if (!firstname.trim()) newErrors.firstname = "Tên không được để trống";

        if (!email.trim()) {
            newErrors.email = "Email không được để trống";
        } else if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) {
            newErrors.email = "Email không đúng định dạng";
        }

        if (!password) {
            newErrors.password = "Mật khẩu không được để trống";
        } else if (password.length < 8) {
            newErrors.password = "Mật khẩu tối thiểu 8 ký tự";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không được để trống";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
        }

        if (!terms) newErrors.terms = "Bạn cần đồng ý với điều khoản";

        setErrors(newErrors);

        return Object.values(newErrors).every((err) => err === "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const existing = await axios.get(`http://localhost:8080/users?email=${email}`);
            if (existing.data.length > 0) {
                setErrors((prev) => ({ ...prev, email: "Email đã được sử dụng" }));
                return;
            }

            await axios.post("http://localhost:8080/users", {
                lastname,
                firstname,
                email,
                password,
            });

            alert("Đăng ký thành công!");
            navigate("/login"); 
        } catch (error) {
            console.error(error);
            alert("Đăng ký thất bại, thử lại sau");
        }
    };

    return (
        <div className="container">
            <h2>Đăng ký tài khoản</h2>
            <p>Đăng ký tài khoản để sử dụng dịch vụ</p>
            <form onSubmit={handleSubmit}>
                <div className="name-fields">
                    <div>
                        <label>Họ và tên đệm</label>
                        <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                        <span className="error-message">{errors.lastname}</span>
                    </div>
                    <div>
                        <label>Tên</label>
                        <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                        <span className="error-message">{errors.firstname}</span>
                    </div>
                </div>

                <label>Email</label>
                <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                <span className="error-message">{errors.email}</span>

                <label>Mật khẩu</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <span className="error-message">{errors.password}</span>

                <label>Xác nhận mật khẩu</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <span className="error-message">{errors.confirmPassword}</span>

                <div className="terms">
                    <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                    <label>Bạn đồng ý với <a href="#">chính sách và điều khoản</a></label>
                </div>
                <span className="error-message">{errors.terms}</span>

                <button type="submit">Đăng ký</button>
            </form>

            <p className="login-link">
                Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>
        </div>
    );
}
