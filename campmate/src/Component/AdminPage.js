import React, { useState, useEffect } from "react";
import { fetchWithAuth } from '../api';

function AdminsPage({ user, setUser }) {
    const [editMode, setEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user } || {});
    const [imageFile, setImageFile] = useState(null); // 이미지 파일 상태 추가
    const [error, setError] = useState(null);

    useEffect(() => {
        setEditedUser({ ...user });
        setImageFile(null); // 수정 모드 시작 시 또는 user 변경 시 파일 상태 초기화
    }, [user, editMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
    };

    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        setError(null);

        // FormData 객체 생성
        const formData = new FormData();
        // editedUser 객체의 모든 키-값 쌍을 FormData에 추가
        // 주의: user 객체 전체를 넣으면 안되고 필요한 필드만 넣어야 함
        formData.append('email', editedUser.email);
        formData.append('name', editedUser.name);
        formData.append('description', editedUser.description);
        formData.append('campingStyle', editedUser.campingStyle);
        formData.append('campingBackground', editedUser.campingBackground);
        formData.append('campingType', editedUser.campingType);
        formData.append('address', editedUser.address);
        // imageUrl은 보내지 않음 (파일로 대체)

        // 새 이미지 파일이 선택되었으면 추가
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }

        try {
            // fetchWithAuth를 사용하여 FormData 전송
            const updatedUser = await fetchWithAuth(`/api/admins/me`, {
                method: 'PUT',
                // FormData 전송 시 Content-Type 헤더는 설정하지 않음!
                body: formData
            });
            setUser(updatedUser); // 서버로부터 받은 최종 데이터로 업데이트
            setEditMode(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setEditedUser({ ...user });
        setEditMode(false);
        setError(null);
        setImageFile(null);
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
                    {/* --- 주소 행 추가 --- */}
                    <tr>
                        <th>캠핑장 주소</th>
                        <td>
                            {editMode ? (
                                <input name="address" value={editedUser.address || ''} onChange={handleChange} />
                            ) : (
                                user.address
                            )}
                        </td>
                    </tr>
                    {/* -------------------- */}
                    {/* --- 이미지 파일 행 추가 --- */}
                    <tr>
                        <th>대표 이미지</th>
                        <td>
                            {editMode ? (
                                <input name="imageFile" type="file" accept="image/*" onChange={handleFileChange} />
                            ) : (
                                // 이미지 URL이 있으면 이미지 표시, 없으면 '없음'
                                user.imageUrl ? <img src={user.imageUrl} alt="대표 이미지" width="100" /> : '없음'
                            )}
                        </td>
                    </tr>
                    {/* ----------------------- */}
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
                        <td>{user.createDt ? new Date(user.createDt).toLocaleString() : ''}</td>
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