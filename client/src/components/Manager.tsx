import { useState } from "react";
import "./../css/Manager.css";
import deletee from "../image/_Button base.png";
import pen from "../image/pen.png";
import vector from "../image/Vector.png";
import quanLi from "../image/quanLi.png";
import book from "../image/book.png";
import icon_button from "../image/Icon button.png";
import bell from "../image/bell.png";
import question from "../image/Question mark circle.png";
import setting from "../image/setting.png";
import Avatar from "../image/Avatar.png";
import vector1 from "../image/Vector1.png";
import arrow_down from "../image/arrow-down.png";
import { FiPlus } from "react-icons/fi";

const subjectsData = [
  { name: "Lập trình C", status: "active" },
  { name: "Lập trình Frontend với ReactJS", status: "inactive" },
  { name: "Dev C", status: "active" },
  { name: "Eleaning", status: "inactive" },
  { name: "Học Toán", status: "active" },
];

const statusLabel: Record<string, string> = {
  active: "Đang hoạt động",
  inactive: "Ngừng hoạt động",
};

export default function Manager() {
  const [search, setSearch] = useState("");

  const filteredSubjects = subjectsData.filter((subject) =>
    subject.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="manager">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-title">
          <img src={book} alt="book" className="sidebar-title-icon" />
          Study Tracker
        </div>
        <div className="sidebar-desc">Quản lý tiến độ học tập</div>
        <nav className="sidebar-nav">
          <div className="sidebar-item">
            <img src={vector} alt="icon" className="sidebar-icon" />
            Thống kê
          </div>
          <div className="sidebar-item active">
            <img src={vector1} alt="icon" className="sidebar-icon" />
            Quản lý môn học
          </div>
          <div className="sidebar-item">
            <img src={quanLi} alt="icon" className="sidebar-icon" />
            Quản lý bài học
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="header">
          <button className="header-btn">
            <img src={icon_button} alt="menu" className="header-icon" />
          </button>
          <div className="header-right">
            <button><img src={bell} alt="bell" className="header-icon" /></button>
            <button><img src={question} alt="help" className="header-icon" /></button>
            <button><img src={setting} alt="setting" className="header-icon" /></button>
            <img src={Avatar} alt="Avatar" className="avatar" />
          </div>
        </header>

        <div className="content">
          <div className="content-header">
            <h1 className="main-title">Môn học</h1>
            <div className="content-actions">
              <select className="filter-select">
                <option>Lọc theo trạng thái</option>
                <option>Đang hoạt động</option>
                <option>Ngừng hoạt động</option>
              </select>
              <button className="btn-add">
                <FiPlus className="btn-add-icon" /> Thêm mới môn học
              </button>
            </div>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm môn học theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="table-header-title">
                      Tên môn học
                      <img src={arrow_down} alt="down" className="arrow-down" />
                    </div>
                  </th>
                  <th>Trạng thái</th>
                  <th className="text-center">Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map((subject, index) => (
                    <tr key={index}>
                      <td>{subject.name}</td>
                      <td>
                        <span className={subject.status === "active" ? "status-active" : "status-inactive"}>
                          <span className="status-dot" />
                          {statusLabel[subject.status]}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="table-actions">
                          <button><img src={deletee} alt="Xoá" className="action-icon" /></button>
                          <button><img src={pen} alt="Sửa" className="action-icon" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="table-empty">
                      Không tìm thấy môn học nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button>←</button>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className={n === 1 ? "active" : ""}>{n}</button>
            ))}
            <span>...</span>
            <button>20</button>
            <button>→</button>
          </div>
        </div>
      </main>
    </div>
  );
}