import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

const statusLabel: Record<string, string> = {
  active: "Đang hoạt động",
  inactive: "Ngừng hoạt động",
};

export default function ManagerSubject() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [originalSubjects, setOriginalSubjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [newSubjectName, setNewSubjectName] = useState("");
  const [newStatus, setNewStatus] = useState("active");
  const [nameError, setNameError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("active");
  const [editError, setEditError] = useState("");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");

  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleAvatarClick = () => setShowUserMenu((prev) => !prev);
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "http://localhost:5173/login";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus, sortOrder]);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:8080/subjects");
      setSubjects(res.data);
      setOriginalSubjects(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
    }
  };

  const handleAddSubject = async () => {
    if (newSubjectName.trim() === "") {
      setNameError("Vui lòng nhập tên môn học!");
      return;
    }

    const isDuplicate = subjects.some(
      (s) => s.name.toLowerCase() === newSubjectName.trim().toLowerCase()
    );
    if (isDuplicate) {
      setNameError("Tên môn học đã tồn tại!");
      return;
    }

    try {
      const newSubject = { name: newSubjectName, status: newStatus };
      await axios.post("http://localhost:8080/subjects", newSubject);
      await fetchSubjects();
      setNewSubjectName("");
      setNewStatus("active");
      setNameError("");
      setShowAddModal(false);
      showToast(" Đã thêm môn học thành công!");
    } catch (err) {
      console.error("Lỗi khi thêm môn học:", err);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSubjectName(e.target.value);
    if (e.target.value.trim() !== "") setNameError("");
  };

  const handleEditClick = (subject: any) => {
    setEditId(subject.id);
    setEditName(subject.name);
    setEditStatus(subject.status);
    setShowEditModal(true);
  };

  const handleUpdateSubject = async () => {
    if (editName.trim() === "") {
      setEditError("Vui lòng nhập tên môn học!");
      return;
    }

    const isDuplicate = subjects.some(
      (s) =>
        s.name.toLowerCase() === editName.trim().toLowerCase() &&
        s.id !== editId
    );
    if (isDuplicate) {
      setEditError("Tên môn học đã tồn tại!");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/subjects/${editId}`, {
        name: editName,
        status: editStatus,
      });
      await fetchSubjects();
      setShowEditModal(false);
      setEditError("");
      showToast(" Cập nhật môn học thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
    }
  };

  const handleDeleteClick = (subject: any) => {
    setDeleteId(subject.id);
    setDeleteName(subject.name);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/subjects/${deleteId}`);
      await fetchSubjects();
      setShowDeleteConfirm(false);
      showToast(` Đã xóa "${deleteName}" thành công!`);
    } catch (err) {
      console.error("Lỗi khi xóa môn học:", err);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const filteredSubjects = subjects.filter((subject) => {
    const matchName = (subject.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || subject.status === filterStatus;
    return matchName && matchStatus;
  });

  let sortedSubjects = [...filteredSubjects];
  if (sortOrder === "asc") {
    sortedSubjects.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === "desc") {
    sortedSubjects.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    sortedSubjects = [...originalSubjects].filter((subject) =>
      filteredSubjects.some((f) => f.id === subject.id)
    );
  }

  const handleSortToggle = () => {
    if (sortOrder === "none") setSortOrder("asc");
    else if (sortOrder === "asc") setSortOrder("desc");
    else setSortOrder("none");
  };

  const totalPages = Math.max(1, Math.ceil(sortedSubjects.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSubjects = sortedSubjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="manager">
      {/* --- Sidebar --- */}
      <aside className="sidebar">
        <div className="sidebar-title">
          <img src={book} alt="book" className="sidebar-title-icon" />
          Study Tracker
        </div>
        <div className="sidebar-desc">Quản lý tiến độ học tập</div>

        <nav className="sidebar-nav">
          <div className="sidebar-item" onClick={() => navigate("/manager")}>
            <img src={vector} alt="icon" className="sidebar-icon" />
            Thống kê
          </div>

          <div className="sidebar-item active">
            <img src={vector1} alt="icon" className="sidebar-icon" />
            Quản lý môn học
          </div>

          <div
            className="sidebar-item"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/manager/lesson")}
          >
            <img src={quanLi} alt="icon" className="sidebar-icon" />
            Quản lý bài học
          </div>
        </nav>
      </aside>

      {/* --- Main --- */}
      <main className="main">
        <header className="header">
          <button className="header-btn">
            <img src={icon_button} alt="menu" className="header-icon" />
          </button>
          <div className="header-right" ref={menuRef}>
            <button><img src={bell} alt="bell" className="header-icon" /></button>
            <button><img src={question} alt="help" className="header-icon" /></button>
            <button><img src={setting} alt="setting" className="header-icon" /></button>

            <div className="avatar-container">
              <img
                src={Avatar}
                alt="Avatar"
                className="avatar"
                onClick={handleAvatarClick}
              />
              {showUserMenu && (
                <div className="user-menu">
                  <button onClick={handleLogout}>Đăng xuất</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content">
          <div className="content-header">
            <h1 className="main-title">Môn học</h1>
            <div className="content-actions">
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
              </select>

              <button className="btn-add" onClick={() => setShowAddModal(true)}>
                <FiPlus className="btn-add-icon" /> Thêm mới môn học
              </button>
            </div>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm môn học..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          {/* --- Table --- */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th onClick={handleSortToggle} style={{ cursor: "pointer" }}>
                    <div className="table-header-title">
                      Tên môn học{" "}
                      <img
                        src={arrow_down}
                        alt="down"
                        className={`arrow-down ${sortOrder === "desc"
                          ? "rotated"
                          : sortOrder === "none"
                            ? "neutral"
                            : ""
                          }`}
                      />
                    </div>
                  </th>
                  <th>Trạng thái</th>
                  <th className="text-center">Chức năng</th>
                </tr>
              </thead>

              <tbody>
                {currentSubjects.length > 0 ? (
                  currentSubjects.map((subject, index) => (
                    <tr key={subject.id ?? index}>
                      <td>{subject.name}</td>
                      <td>
                        <span
                          className={
                            subject.status === "active"
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          <span className="status-dot" />
                          {statusLabel[subject.status] || "Không rõ"}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="table-actions">
                          <button onClick={() => handleDeleteClick(subject)}>
                            <img src={deletee} alt="Xoá" className="action-icon" />
                          </button>
                          <button onClick={() => handleEditClick(subject)}>
                            <img src={pen} alt="Sửa" className="action-icon" />
                          </button>
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

          {/* --- Pagination --- */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              «
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              »
            </button>
          </div>
        </div>

        {/* --- Modal & Toast --- */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Thêm mới môn học</h2>
                <button className="close-btn" onClick={() => setShowAddModal(false)}>
                  x
                </button>
              </div>
              <div className="modal-body">
                <label>Tên môn học</label>
                <input
                  type="text"
                  placeholder="Nhập tên môn học..."
                  className={`modal-input ${nameError ? "input-error" : ""}`}
                  value={newSubjectName}
                  onChange={handleNameChange}
                />
                {nameError && <p className="error-text">{nameError}</p>}
                <label>Trạng thái</label>
                <div className="modal-status">
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={newStatus === "active"}
                      onChange={(e) => setNewStatus(e.target.value)}
                    />
                    Đang hoạt động
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={newStatus === "inactive"}
                      onChange={(e) => setNewStatus(e.target.value)}
                    />
                    Ngừng hoạt động
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Hủy
                </button>
                <button className="btn-submit" onClick={handleAddSubject}>
                  Thêm
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Cập nhật môn học</h2>
                <button className="close-btn" onClick={() => setShowEditModal(false)}>
                  x
                </button>
              </div>
              <div className="modal-body">
                <label>Tên môn học</label>
                <input
                  type="text"
                  className={`modal-input ${editError ? "input-error" : ""}`}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                {editError && <p className="error-text">{editError}</p>}
                <label>Trạng thái</label>
                <div className="modal-status">
                  <label>
                    <input
                      type="radio"
                      name="edit-status"
                      value="active"
                      checked={editStatus === "active"}
                      onChange={(e) => setEditStatus(e.target.value)}
                    />
                    Đang hoạt động
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="edit-status"
                      value="inactive"
                      checked={editStatus === "inactive"}
                      onChange={(e) => setEditStatus(e.target.value)}
                    />
                    Ngừng hoạt động
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  Hủy
                </button>
                <button className="btn-submit" onClick={handleUpdateSubject}>
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal small">
              <div className="modal-header">
                <h2>Xác nhận xóa</h2>
              </div>
              <div className="modal-body">
                <p>
                  Bạn có chắc muốn xóa môn học <b>"{deleteName}"</b> không?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-cancel"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Hủy
                </button>
                <button className="btn-submit delete" onClick={confirmDelete}>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {toastMessage && <div className="toast">{toastMessage}</div>}
      </main>
    </div>
  );
}