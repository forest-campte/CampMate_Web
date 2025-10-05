// src/api.js

// API 요청의 기본 URL을 설정합니다.
const API_BASE_URL = 'http://localhost:8080';

export const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    // 응답이 성공적이지 않을 때 에러 처리를 강화합니다.
    if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || JSON.stringify(errorData);
        } catch (e) {
            // 응답이 JSON이 아닐 경우(HTML 에러 페이지 등)
            // 바로 이 부분에서 "Unexpected token '<'" 에러가 발생합니다.
            const textError = await response.text();
            console.error("Received non-JSON response:", textError);
            errorMessage = "서버로부터 잘못된 응답을 받았습니다. 백엔드 설정을 확인하세요.";
        }
        throw new Error(errorMessage);
    }
    
    // 응답 본문이 비어있을 경우를 대비
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return {}; // 본문이 없는 성공 응답(예: 204 No Content) 처리
};