import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap'; 
import { fetchCourses, addCourse, updateCourse, deleteCourse, fetchOneCourse } from './CRUDMode.js';

const ShowList = () => {
    const [courses, setCourses] = useState([]); //배열 형태로 들어가기 때문에, 따옴표가 아닌, 빈 대괄호 사용
    const [showModal, setShowModal] = useState(false); //false 설정하여 처음 프로그램 시작 시, modal 창 숨김
    
    const [formData, setFormData] = useState({
        id: '',
        subject: '',
        professor: '',
        credits: '',
        semester: ''
    });

    const [editModeId, setEditModeId] = useState(null);

    const loadData = async () => {
        try {
            const data = await fetchCourses(); 
            setCourses(data);
        } catch (error) {
            alert("데이터를 불러오지 못했습니다.");
        }
    };

    const handleSave = async () => {
        if (!formData.subject || !formData.professor) {
            alert("과목명과 교수명은 필수입니다.");
            return;
        }

        try {
            if (editModeId) {
                await updateCourse(editModeId, formData); 
                alert("수정되었습니다.");
            } else {
                await addCourse(formData); 
                alert("추가되었습니다.");
            }
            
            handleClose(); 
            loadData();
        } catch (error) {
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    const handleDelete = async (id) => {
        const targetId = formData.id;
        
        if (!targetId) return alert("삭제할 ID를 입력하세요.");

        if(window.confirm(`정말 ${targetId}번 과목을삭제하시겠습니까?`)) {
            try {
                await deleteCourse(id); 
                loadData();
                alert("삭제되었습니다.");
            } catch (error) {
                alert("삭제 실패!");
            }
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        const key = id.replace('input_', '').replace('modal_', ''); 
        setFormData({ ...formData, [key]: value });
    };

    const handleShowAdd = () => {
        setEditModeId(null);
        setFormData({ subject: '', professor: '', credits: '', semester: '' });
        setShowModal(true);
    };

    const handleShowEdit = async () => {
        const targetId = formData.id;
        
        if (!targetId) return alert("수정할 ID를 입력하세요.");

        try {
            const data = await fetchOneCourse(targetId);           
            setEditModeId(data.id);
            setFormData(data);
            setShowModal(true);
        } catch (error) {
            alert("해당 ID의 데이터를 찾을 수 없습니다.");
        }
    }

    const handleDetail = async () => {
        if (!formData.id) {
            alert("조회할 ID를 입력하세요.");
            return;
        }
        
        try {
            const data = await fetchOneCourse(formData.id);
            alert(`[조회 성공]\n${data.subject}, professor ${data.professor}, ${data.credits} credits`);
        } catch {
            alert("데이터를 찾을 수 없습니다.");
        }
    }

    const handleClose = () => setShowModal(false);

    return (
        <div className="container mt-3">
            <header>
                <h1 style={{ textAlign: 'center' }}>수강 과목 관리</h1>
            </header>

            <h3>목록</h3>
            <div id="div_list">
                {courses.map(course => (
                    <div key={course.id}>
                        {course.id} : {course.subject} (Professor {course.professor}, {course.credits}학점)
                    </div>
                ))}
            </div>
            <button id="btn_list" onClick={loadData}>목록 보기</button>
            <button id="btn_add" onClick={handleShowAdd}>새 과목 추가</button>

            <hr />

            <h3>데이터 관리</h3>
            ID (수정/삭제/조회용): <input type="text" id="input_id" size="5" onChange={handleChange} />
            <br/><br/>

            <button id="btn_update" onClick={handleShowEdit}>ID로 수정하기</button>
            <button id="btn_delete" onClick={handleDelete}>ID로 삭제하기</button>
            <button id="btn_detail" onClick={handleDetail}>ID로 조회하기</button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>데이터 관리</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="modalForm">
                        <input type="hidden" id="modal_id" />

                        <div className="mb-3">
                            <label htmlFor="modal_subject" className="form-label">과목명</label>
                            <input type="text" className="form-control" id="modal_subject" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="modal_professor" className="form-label">교수명</label>
                            <input type="text" className="form-control" id="modal_professor" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="modal_credits" className="form-label">학점</label>
                            <input type="number" className="form-control" id="modal_credits" onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="modal_semester" className="form-label">학기</label>
                            <input type="text" className="form-control" id="modal_semester" placeholder="20XX-X" onChange={handleChange} />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>닫기</Button>
                    <Button variant="primary" onClick={handleSave}>저장</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default ShowList;