import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Home.css";
import heart from "../image/Heart.png";
import human from "../image/Human.png";
import twitter from "../image/Twitter.png";
import tiktok from "../image/tiktok.png";
import facebook from "../image/fb.png";
import insta from "../image/Instagram.png";
import look from "../image/look.png";

function Home() {
    const navigate = useNavigate();

    const courses = [
        {
            title: "HTML cơ bản",
            lessons: [
                "Session 01: Tổng quan về HTML",
                "Session 02: Thẻ Inline và Block",
                "Session 03: Thẻ hình ảnh",
                "Session 04: Thẻ chuyển trang",
                "Session 05: Thẻ Semantic",
            ],
        },
        {
            title: "CSS cơ bản",
            lessons: [
                "Session 01: Tổng quan về CSS",
                "Session 02: Nhúng CSS vào trang Web",
                "Session 03: Position",
                "Session 04: Flexbox",
                "Session 05: Animation",
            ],
        },
        {
            title: "JavaScript cơ bản",
            lessons: [
                "Session 01: Tổng quan ngôn ngữ JavaScript",
                "Session 02: Khai báo biến",
                "Session 03: Câu lệnh điều kiện",
                "Session 04: Vòng lặp",
                "Session 05: Mảng",
            ],
        },
        {
            title: "Lập trình với React.js",
            lessons: [
                "Session 01: Tổng quan về React.js",
                "Session 02: Props, State, Event",
                "Session 03: React Hook",
                "Session 04: UI Framework",
                "Session 05: React Router",
            ],
        },
        {
            title: "Lập trình với Java",
            lessons: [
                "Session 01: Tổng quan về ngôn ngữ Java",
                "Session 02: Khai báo biến",
                "Session 03: Câu lệnh điều kiện",
                "Session 04: Vòng lặp",
                "Session 05: Mảng",
            ],
        },
        {
            title: "Lập trình C",
            lessons: [],
        },
    ];

    return (
        <div className="home">
            {/* Header */}
            <header className="header">
                <div>
                    <input type="text" placeholder="Tìm kiếm" className="search" />
                    <img src={look} alt="Look" className="look" />
                </div>
                <nav>
                    <button onClick={() => navigate("/")} className="nav-btn">
                         Trang chủ
                    </button>
                    <button onClick={() => navigate("/subjects")} className="nav-btn">
                        Môn học
                    </button>
                    <button onClick={() => navigate("/lessons")} className="nav-btn">
                        Bài học
                    </button>
                    <button onClick={() => navigate("/favorites")} className="nav-btn">
                        <img src={heart} alt="Yêu thích" />
                    </button>
                    <button onClick={() => navigate("/profile")} className="nav-btn">
                        <img src={human} alt="Tài khoản" />
                    </button>
                </nav>
            </header>

            {/* Tabs */}
            <div className="tabs">
                <button className="active">Tất cả môn học</button>
                <button>Đã hoàn thành</button>
                <button>Chưa hoàn thành</button>
            </div>

            {/* Course Grid */}
            <div className="course-grid">
                {courses.map((c, i) => (
                    <div key={i} className="course-card">
                        <h3>{c.title}</h3>
                        {c.lessons.length > 0 ? (
                            <>
                                <ul>
                                    {c.lessons.map((l, idx) => (
                                        <li key={idx}>✔ {l}</li>
                                    ))}
                                </ul>
                                <Link to={`/course/${i}`} className="more">
                                    Xem thêm
                                </Link>
                            </>
                        ) : (
                            <p className="empty">Chưa có bài học nào</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="about">
                    <p>
                        Chúng tôi cung cấp giải pháp học tập, giúp học sinh và <br></br> sinh viên học
                        tập dễ dàng và hiệu quả hơn.
                    </p>
                </div>
                <div className="links">
                    <div>
                        <h4>Danh mục</h4>
                        <Link to="/subjects">Môn học</Link>
                        <Link to="/lessons">Bài học</Link>
                        <Link to="/notes">Ghi chú</Link>
                    </div>
                    <div className="support">
                        <h4>Hỗ trợ khách hàng</h4>
                        <Link to="/search">Tìm kiếm dịch vụ</Link>
                        <Link to="/terms">Điều khoản sử dụng</Link>
                        <Link to="/policy">Chính sách và điều khoản</Link>
                    </div>
                </div>
                <div className="socials">
                    <Link to="https://twitter.com">
                        <img src={twitter} alt="Twitter" />
                    </Link>
                    <Link to="https://facebook.com">
                        <img src={facebook} alt="Facebook" />
                    </Link>
                    <Link to="https://tiktok.com">
                        <img src={tiktok} alt="TikTok" />
                    </Link>
                    <Link to="https://instagram.com">
                        <img src={insta} alt="Instagram" />
                    </Link>
                </div>
            </footer>
        </div>
    );
}

export default Home;
