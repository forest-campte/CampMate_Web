import React, { useState, useEffect } from "react";
import { fetchWithAuth } from '../api'; // [수정] api.js에서 fetchWithAuth import

function AdminsPage({ user, setUser }) {
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user } || {});
    const [error, setError] = useState(null);

    useEffect(() => {
        setEditedUser({ ...user });
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setError(null);
        try {
            const updatedUser = await fetchWithAuth(`/api/admins/me`, {
                method: 'PUT',
                body: JSON.stringify(editedUser)
            });
            setUser(updatedUser);
            setEditMode(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setEditedUser({ ...user });
        setEditMode(false);
        setError(null);
    };

    const handleEditClick = () => {
        setEditMode(true);
        setError(null);
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
                {error && <p style={{ color: 'red', marginTop: '10px' }}>에러: {error}</p>}
            </div>
        </div>
    );
}

export default AdminsPage;