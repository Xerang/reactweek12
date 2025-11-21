const API_URL = "https://6915405884e8bd126af939b5.mockapi.io/users";

export const fetchCourses = async () => {
    //async: 비동기식, 즉 서버의 요청을 기다리면서 다른 코드 수행가능. 굳이 선언한 이유는 await를 사용하기 위해서
    try {
        const response = await fetch(API_URL); //서버에 요청을 보내고, 응답받기 전까지 내부 실행 정지
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error; //발생한 에러를 ShowList.js에서 처리
    }
};

export const addCourse = async (courseData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData)
        });
        return await response.json();
    } catch (error) {
        console.error("Error adding course:", error);
        throw error;
    }
};

export const updateCourse = async (id, courseData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData)
        });
        return await response.json();
    } catch (error) {
        console.error("Error updating course:", error);
        throw error;
    }
};

export const deleteCourse = async (id) => {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error("Error deleting course:", error);
        throw error;
    }
};

export const fetchOneCourse = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Not found');
    return await response.json();
};