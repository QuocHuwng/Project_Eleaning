import { useState, useEffect } from "react";
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
  active: "Đã hoàn thành",
  inactive: "Chưa hoàn thành",
};

export default function ManagerLesson() {
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<any[]>([]);
  const [originalLessons, setOriginalLessons] = useState<any[]>([]);
  const [subjectList, setSubjectList] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [newLessonName, setNewLessonName] = useState("");
  const [newStatus, setNewStatus] = useState("active");
  const [newTime, setNewTime] = useState<number>(45);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | "">("");
  const [nameError, setNameError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState("active");
  const [editTime, setEditTime] = useState<number>(45);
  const [editSubjectId, setEditSubjectId] = useState<number | "">("");
  const [editError, setEditError] = useState("");

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");

  //  Lấy dữ liệu bài học + danh sách môn học
  useEffect(() => {
    fetchLessons();
    fetchSubjects();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await axios.get("http://localhost:8080/lessons");
      setLessons(res.data);
      setOriginalLessons(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu bài học:", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:8080/subjects");
      setSubjectList(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách môn học:", err);
    }
  };

  //  Thêm bài học mới
  const handleAddLesson = async () => {
    if (newLessonName.trim() === "") {
      setNameError("Vui lòng nhập Tên bài học!");
      return;
    }
    if (!selectedSubjectId) {
      alert("Vui lòng chọn loại môn học!");
      return;
    }

    const isDuplicate = lessons.some(
      (s) => s.name.toLowerCase() === newLessonName.trim().toLowerCase()
    );
    if (isDuplicate) {
      setNameError("Tên bài học đã tồn tại!");
      return;
    }

    try {
      const newLesson = {
        name: newLessonName,
        subjectId: selectedSubjectId,
        status: newStatus,
        time: newTime,
      };
      await axios.post("http://localhost:8080/lessons", newLesson);
      await fetchLessons();
      setNewLessonName("");
      setSelectedSubjectId("");
      setNewStatus("active");
      setNewTime(45);
      setShowAddModal(false);
      showToast(" Đã thêm bài học thành công!");
    } catch (err) {
      console.error("Lỗi khi thêm bài học:", err);
    }
  };

  const handleEditClick = (lesson: any) => {
    setEditId(lesson.id);
    setEditName(lesson.name);
    setEditStatus(lesson.status);
    setEditTime(lesson.time || 45);
    setEditSubjectId(lesson.subjectId || "");
    setShowEditModal(true);
  };

  const handleUpdateLesson = async () => {
    if (editName.trim() === "") {
      setEditError("Vui lòng nhập tên bài học!");
      return;
    }
    try {
      await axios.put(`http://localhost:8080/lessons/${editId}`, {
        name: editName,
        status: editStatus,
        time: editTime,
        subjectId: editSubjectId,
      });
      await fetchLessons();
      setShowEditModal(false);
      setEditError("");
      showToast(" Cập nhật bài học thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật bài học:", err);
    }
  };

  const handleDeleteClick = (lesson: any) => {
    setDeleteId(lesson.id);
    setDeleteName(lesson.name);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/lessons/${deleteId}`);
      await fetchLessons();
      setShowDeleteConfirm(false);
      showToast(`Đã xóa "${deleteName}" thành công!`);
    } catch (err) {
      console.error("Lỗi khi xóa bài học:", err);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  //  Lọc & sắp xếp
  const filteredLessons = lessons.filter((lesson) => {
    const matchName = (lesson.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || lesson.status === filterStatus;
    return matchName && matchStatus;
  });

  let sortedLessons = [...filteredLessons];
  if (sortOrder === "asc") {
    sortedLessons.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === "desc") {
    sortedLessons.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    sortedLessons = [...originalLessons].filter((l) =>
      filteredLessons.some((f) => f.id === l.id)
    );
  }

  const handleSortToggle = () => {
    if (sortOrder === "none") setSortOrder("asc");
    else if (sortOrder === "asc") setSortOrder("desc");
    else setSortOrder("none");
  };

  const totalPages = Math.ceil(sortedLessons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLessons = sortedLessons.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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
          <div
            className="sidebar-item"
            onClick={() => navigate("/manager/subject")}
            style={{ cursor: "pointer" }}
          >
            <img src={vector1} alt="icon" className="sidebar-icon" />
            Quản lý môn học
          </div>
          <div className="sidebar-item active">
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
            <h1 className="main-title">Bài học</h1>
            <div className="content-actions">
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đã hoàn thành</option>
                <option value="inactive">Chưa hoàn thành</option>
              </select>

              <button className="btn-add" onClick={() => setShowAddModal(true)}>
                <FiPlus className="btn-add-icon" /> Thêm mới bài học
              </button>
            </div>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm bài học..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th className="text-center"><input type="checkbox" /></th>
                  <th onClick={handleSortToggle} style={{ cursor: "pointer" }}>
                    <div className="table-header-title">
                      Tên bài học{" "}
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
                  <th>Thuộc môn học</th>
                  <th>Thời gian học (phút)</th>
                  <th>Trạng thái</th>
                  <th className="text-center">Chức năng</th>
                </tr>
              </thead>

              <tbody>
                {currentLessons.length > 0 ? (
                  currentLessons.map((lesson, index) => (
                    <tr key={index}>
                      <td className="text-center"><input type="checkbox" /></td>
                      <td>{lesson.name}</td>
                      <td>
                        {
                          subjectList.find((s) => s.id === lesson.subjectId)?.name ||
                          "Không rõ"
                        }
                      </td>
                      <td className="text-center">{lesson.time || 0}</td>
                      <td>
                        <span
                          className={
                            lesson.status === "active"
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          <span className="status-dot" />
                          {statusLabel[lesson.status] || "Không rõ"}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="table-actions">
                          <button onClick={() => handleDeleteClick(lesson)}>
                            <img src={deletee} alt="Xoá" className="action-icon" />
                          </button>
                          <button onClick={() => handleEditClick(lesson)}>
                            <img src={pen} alt="Sửa" className="action-icon" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="table-empty">
                      Không tìm thấy bài học nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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

        {/* Modal thêm mới bài học */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Thêm mới bài học</h2>
                <button className="close-btn" onClick={() => setShowAddModal(false)}>x</button>
              </div>
              <div className="modal-body">
                <label>Tên bài học</label>
                <input
                  type="text"
                  placeholder="Nhập tên bài học..."
                  className={`modal-input ${nameError ? "input-error" : ""}`}
                  value={newLessonName}
                  onChange={(e) => {
                    setNewLessonName(e.target.value);
                    if (e.target.value.trim() !== "") setNameError("");
                  }}
                />
                {nameError && <p className="error-text">{nameError}</p>}

                <label>Loại môn học</label>
                <select
                  className="modal-input"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                >
                  <option value="">-- Chọn môn học --</option>
                  {subjectList.map((subj) => (
                    <option key={subj.id} value={subj.id}>
                      {subj.name}
                    </option>
                  ))}
                </select>

                <label>Thời gian học (phút)</label>
                <input
                  type="number"
                  className="modal-input"
                  value={newTime}
                  onChange={(e) => setNewTime(Number(e.target.value))}
                />

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
                    Đã hoàn thành
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={newStatus === "inactive"}
                      onChange={(e) => setNewStatus(e.target.value)}
                    />
                    Chưa hoàn thành
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Hủy</button>
                <button className="btn-submit" onClick={handleAddLesson}>Thêm</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal chỉnh sửa bài học */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Cập nhật bài học</h2>
                <button className="close-btn" onClick={() => setShowEditModal(false)}>x</button>
              </div>
              <div className="modal-body">
                <label>Tên bài học</label>
                <input
                  type="text"
                  className={`modal-input ${editError ? "input-error" : ""}`}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                {editError && <p className="error-text">{editError}</p>}

                <label>Loại môn học</label>
                <select
                  className="modal-input"
                  value={editSubjectId}
                  onChange={(e) => setEditSubjectId(Number(e.target.value))}
                >
                  <option value="">-- Chọn môn học --</option>
                  {subjectList.map((subj) => (
                    <option key={subj.id} value={subj.id}>
                      {subj.name}
                    </option>
                  ))}
                </select>

                <label>Thời gian học (phút)</label>
                <input
                  type="number"
                  className="modal-input"
                  value={editTime}
                  onChange={(e) => setEditTime(Number(e.target.value))}
                />

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
                    Đã hoàn thành
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="edit-status"
                      value="inactive"
                      checked={editStatus === "inactive"}
                      onChange={(e) => setEditStatus(e.target.value)}
                    />
                    Chưa hoàn thành
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Hủy</button>
                <button className="btn-submit" onClick={handleUpdateLesson}>Lưu thay đổi</button>
              </div>
            </div>
          </div>
        )}

        {/* Xác nhận xoá */}
        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal small">
              <div className="modal-header">
                <h2>Xác nhận xóa</h2>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc muốn xóa bài học <b>"{deleteName}"</b> không?</p>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Hủy</button>
                <button className="btn-submit delete" onClick={confirmDelete}>Xóa</button>
              </div>
            </div>
          </div>
        )}

        {toastMessage && <div className="toast">{toastMessage}</div>}
      </main>
    </div>
  );
}
