import React, { useState, useEffect } from "react";

function AdminsPage({ user, setUser }) {
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });
    // 에러 메시지를 관리할 상태 변수
    const [error, setError] = useState(null);

    // user prop이 변경될 때 editedUser 상태를 동기화합니다.
    // 부모 컴포넌트에서 user 데이터가 비동기적으로 로드될 때 필요합니다.
    useEffect(() => {
        setEditedUser({ ...user });
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
    };

    // '저장' 버튼 클릭 시 실행될 함수
    const handleSave = async () => {
        setError(null); // 이전 에러 메시지 초기화
        try {
            // 현재 로그인된 관리자 정보를 수정하는 API 엔드포인트로 PUT 요청
            // (실제 엔드포인트는 백엔드 설계에 따라 달라질 수 있습니다)
            const response = await fetch(`/api/admins/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // TODO: 로그인 기능 구현 후 실제 JWT 토큰 등을 여기에 추가해야 합니다.
                    // 'Authorization': `Bearer ${your_auth_token}`
                },
                body: JSON.stringify(editedUser) // 수정한 사용자 정보를 JSON으로 전송
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '정보 저장에 실패했습니다.');
            }

            // 서버로부터 완전히 저장된 최신 사용자 정보를 다시 받아옵니다.
            const updatedUser = await response.json();

            // 부모 컴포넌트의 상태를 서버에서 받은 최신 정보로 업데이트합니다.
            setUser(updatedUser);

            // 수정 모드를 종료합니다.
            setEditMode(false);

        } catch (err) {
            console.error("관리자 정보 저장 실패:", err);
            setError(err.message); // 에러 상태에 메시지 저장
        }
    };

    // '취소' 버튼 클릭 시 실행될 함수
    const handleCancel = () => {
        setEditedUser({ ...user }); // 원본 user 데이터로 복구
        setEditMode(false);
        setError(null); // 에러 메시지 초기화
    };

    // '수정' 버튼 클릭 시 실행될 함수
    const handleEditClick = () => {
        setEditMode(true);
        setError(null); // 에러 메시지 초기화
    };

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