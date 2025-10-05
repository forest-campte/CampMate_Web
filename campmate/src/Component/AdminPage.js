import React, { useState, useEffect } from "react";

function AdminsPage({ user, setUser }) {
    const [editMode, setEditMode] = useState(false);
    // user prop이 초기에 null일 수 있으므로, 빈 객체로 기본값을 설정하여 오류를 방지합니다.
    const [editedUser, setEditedUser] = useState({ ...user } || {});
    const [error, setError] = useState(null);

    // 부모 컴포넌트에서 user 데이터가 비동기적으로 로드될 때를 대비하여
    // user prop이 변경될 때마다 수정 중인 사용자 정보(editedUser)를 동기화합니다.
    useEffect(() => {
        setEditedUser({ ...user });
    }, [user]);

    // API 요청 시 자동으로 토큰을 헤더에 추가하는 헬퍼 함수
    const fetchWithAuth = (url, options = {}) => {
        const token = localStorage.getItem('authToken');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return fetch(url, { ...options, headers });
    };

    // input 필드 값이 변경될 때마다 editedUser 상태를 업데이트하는 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
    };

    // '저장' 버튼 클릭 시 서버에 수정된 정보를 전송하는 함수
    const handleSave = async () => {
        setError(null); // 이전 에러 메시지 초기화
        try {
            // ⚠️ 중요: 백엔드에 현재 로그인한 사용자의 정보를 수정하는 API 엔드포인트가 필요합니다.
            // 여기서는 '/api/admins/me'로 가정하고 PUT 요청을 보냅니다.
            const response = await fetchWithAuth(`/api/admins/me`, {
                method: 'PUT',
                body: JSON.stringify(editedUser)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '정보 저장에 실패했습니다.');
            }
            const updatedUser = await response.json();
            setUser(updatedUser); // App의 전체 user 상태를 최신 정보로 업데이트
            setEditMode(false); // 수정 모드 종료
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setEditedUser({ ...user }); // 수정을 취소하고 원래 정보로 되돌림
        setEditMode(false);
        setError(null);
    };

    const handleEditClick = () => {
        setEditMode(true);
        setError(null);
    };

    // user 데이터가 아직 로드되지 않았으면 로딩 메시지를 표시
    if (!user) return <div>로딩 중...</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>관리자 정보</h2>
            <table border="1" cellPadding="8" style={{ margin: "auto", minWidth: "700px" }}>
                <tbody>
                    <tr>
                        <th>이메일</th>
                        <td>
                            {editMode ? (
                                <input name="email" value={editedUser.email || ''} onChange={handleChange} />
                            ) : (
                                user.email
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>이름</th>
                        <td>
                            {editMode ? (
                                <input name="name" value={editedUser.name || ''} onChange={handleChange} />
                            ) : (
                                user.name
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>캠핑장 설명</th>
                        <td>
                            {editMode ? (
                                <input name="description" value={editedUser.description || ''} onChange={handleChange} />
                            ) : (
                                user.description
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>선호 캠핑 스타일</th>
                        <td>
                            {editMode ? (
                                <select name="campingStyle" value={editedUser.campingStyle || ''} onChange={handleChange}>
                                    <option value="">선택</option>
                                    <option value="오토캠핑">오토캠핑</option>
                                    <option value="백패킹">백패킹</option>
                                    <option value="글램핑">글램핑</option>
                                    <option value="카라반">카라반</option>
                                </select>
                            ) : (
                                user.campingStyle
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>선호 캠핑 배경</th>
                        <td>
                            {editMode ? (
                                <select name="campingBackground" value={editedUser.campingBackground || ''} onChange={handleChange}>
                                    <option value="">선택</option>
                                    <option value="산">산속</option>
                                    <option value="바다">바다</option>
                                    <option value="계곡">계곡</option>
                                </select>
                            ) : (
                                user.campingBackground
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>추천 동행자</th>
                        <td>
                            {editMode ? (
                                <select name="campingType" value={editedUser.campingType || ''} onChange={handleChange}>
                                    <option value="">선택</option>
                                    <option value="가족">가족</option>
                                    <option value="연인">연인</option>
                                    <option value="친구">친구</option>
                                    <option value="반려동물">반려동물</option>
                                    <option value="혼자">혼자</option>
                                </select>
                            ) : (
                                user.campingType
                            )}
                        </td>
                    </tr>
                    <tr>
                        <th>계정 생성일</th>
                        <td>{user.createDt}</td>
                    </tr>
                </tbody>
            </table>

            <div style={{ marginTop: "16px", textAlign: "center" }}>
                {editMode ? (
                    <>
                        <button onClick={handleSave}>저장</button>
                        <button onClick={handleCancel} style={{ marginLeft: "10px" }}>취소</button>
                    </>
                ) : (
                    <button onClick={handleEditClick}>수정</button>
                )}
                {/* 에러 메시지가 있을 경우 화면에 표시 */}
                {error && <p style={{ color: 'red', marginTop: '10px' }}>에러: {error}</p>}
            </div>
        </div>
    );
}

export default AdminsPage;