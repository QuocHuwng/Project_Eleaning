import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
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

    // State
    const [subjects, setSubjects] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterTab, setFilterTab] = useState("all"); // all | active | inactive

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [subjectRes, lessonRes] = await Promise.all([
                axios.get("http://localhost:8080/subjects"),
                axios.get("http://localhost:8080/lessons"),
            ]);
            setSubjects(subjectRes.data);
            setLessons(lessonRes.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    // Gộp môn học và bài học tương ứng
    const courses = subjects.map((subject) => ({
        ...subject,
        lessons: lessons.filter((lesson) => lesson.subjectId === subject.id),
    }));

    // Lọc theo tab + từ khóa tìm kiếm
    const filteredCourses = courses
        .filter((course) => {
            if (filterTab === "active") return course.status === "active";
            if (filterTab === "inactive") return course.status === "inactive";
            return true;
        })
        .filter((course) => {
            if (searchTerm.trim() === "") return true;
            const lower = searchTerm.toLowerCase();
            const matchSubject = course.name.toLowerCase().includes(lower);
            const matchLesson = course.lessons.some((l) =>
                l.name.toLowerCase().includes(lower)
            );
            return matchSubject || matchLesson;
        });

    return (
        <div className="home">
            {/* Header */}
            <header className="header">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Tìm kiếm môn học hoặc bài học..."
                        className="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <img src={look} alt="Look" className="look" />
                </div>
                <nav>
                    <button onClick={() => navigate("/")} className="nav-btn">
                        Trang chủ
                    </button>
                    <button onClick={() => navigate("/manager/subject")} className="nav-btn">
                        Môn học
                    </button>
                    <button onClick={() => navigate("/manager/lesson")} className="nav-btn">
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
                <button
                    className={filterTab === "all" ? "active" : ""}
                    onClick={() => setFilterTab("all")}
                >
                    Tất cả môn học
                </button>
                <button
                    className={filterTab === "active" ? "active" : ""}
                    onClick={() => setFilterTab("active")}
                >
                    Đã hoàn thành
                </button>
                <button
                    className={filterTab === "inactive" ? "active" : ""}
                    onClick={() => setFilterTab("inactive")}
                >
                    Chưa hoàn thành
                </button>
            </div>

            {/* Nội dung chính */}
            {loading ? (
                <p className="loading-text">Đang tải dữ liệu...</p>
            ) : (
                <div className="course-grid">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                            <div key={course.id} className="course-card">
                                <h3>{course.name}</h3>
                                {course.lessons.length > 0 ? (
                                    <>
                                        <ul>
                                            {course.lessons.slice(0, 5).map((lesson) => (
                                                <li
                                                    key={lesson.id}
                                                    className={
                                                        lesson.status === "active"
                                                            ? "completed"
                                                            : "incomplete"
                                                    }
                                                >
                                                    {lesson.status === "active" ? "✔ " : "• "}
                                                    {lesson.name}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link to={`/course/${course.id}`} className="more">
                                            Xem thêm
                                        </Link>
                                    </>
                                ) : (
                                    <p className="empty">Không có bài học nào</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="empty">Không có môn học nào phù hợp.</p>
                    )}
                </div>
            )}

            {/* Footer */}
            <footer className="footer">
                <div className="about">
                    <p>
                        Chúng tôi cung cấp giải pháp học tập, giúp học sinh và sinh viên học tập dễ
                        dàng và hiệu quả hơn.
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
