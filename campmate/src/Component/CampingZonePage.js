import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../api';

function CampingZoneModal({ zone, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        capacity: 2,
        price: 0,
        type: '오토캠핑',
        defaultSize: '',
        floor: '파쇄석',
        parking: false,
        isActive: true,
        imageUrl: '' // 기존 imageUrl 필드 유지 (표시용)
    });
    const [imageFile, setImageFile] = useState(null); // 이미지 파일 상태 추가

    useEffect(() => {
        if (zone) {
            setFormData({
                ...zone,
                parking: zone.parking === 1 || zone.parking === true,
                isActive: zone.isActive === 1 || zone.isActive === true,
                imageUrl: zone.imageUrl || ''
            });
        } else {
            setFormData({
                name: '', description: '', capacity: 2, price: 0, type: '오토캠핑',
                defaultSize: '', floor: '파쇄석', parking: false, isActive: true, imageUrl: ''
            });
        }
        setImageFile(null); // 모달 열릴 때 파일 상태 초기화
    }, [zone]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const processedValue = name === 'capacity' || name === 'price' ? parseInt(value, 10) : value;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : processedValue
        }));
    };

    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 저장 시점에 boolean 값을 0/1로 변환하고, 파일도 함께 전달
        const dataToSend = {
            ...formData,
            parking: formData.parking ? 1 : 0,
            isActive: formData.isActive ? 1 : 0,
        };
        // imageUrl은 FormData에 파일과 함께 보내므로 여기서 제거해도 됨 (선택)
        delete dataToSend.imageUrl;
        onSave(dataToSend, imageFile); // 파일 객체도 전달
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>{zone ? '캠핑존 수정' : '새 캠핑존 추가'}</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name-input">캠핑존 이름</label>
                    <input id="name-input" name="name" value={formData.name} onChange={handleChange} placeholder="캠핑존 이름" required />

                    <label htmlFor="desc-input">캠핑존 설명</label>
                    <textarea id="desc-input" name="description" value={formData.description} onChange={handleChange} placeholder="캠핑존 설명" />

                    {/* --- 이미지 파일 선택 필드 추가 --- */}
                    <label htmlFor="imageFile-input">캠핑존 이미지 파일</label>
                    <input id="imageFile-input" name="imageFile" type="file" accept="image/*" onChange={handleFileChange} />
                    {/* ------------------------------ */}

                    <label htmlFor="capacity-input">수용 인원</label>
                    <input id="capacity-input" name="capacity" type="number" value={formData.capacity} onChange={handleChange} placeholder="수용 인원" required />

                    <label htmlFor="price-input">가격 (1박)</label>
                    <input id="price-input" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="가격" required />

                    <label htmlFor="size-input">사이트 크기</label>
                    <input id="size-input" name="defaultSize" value={formData.defaultSize} onChange={handleChange} placeholder="예: 6x8m" required/>

                    <label htmlFor="type-select">캠핑 타입</label>
                    <select id="type-select" name="type" value={formData.type} onChange={handleChange} required>
                        <option value="오토캠핑">오토캠핑</option>
                        <option value="글램핑">글램핑</option>
                        <option value="카라반">카라반</option>
                    </select>

                    <label htmlFor="floor-select">바닥 타입</label>
                    <select id="floor-select" name="floor" value={formData.floor} onChange={handleChange} required>
                        <option value="파쇄석">파쇄석</option>
                        <option value="데크">데크</option>
                        <option value="잔디">잔디</option>
                    </select>

                    <div className="checkbox-group">
                        <label>
                            <input name="parking" type="checkbox" checked={formData.parking} onChange={handleChange} />
                            주차 가능
                        </label>
                        <label>
                            <input name="isActive" type="checkbox" checked={formData.isActive} onChange={handleChange} />
                            예약 가능
                        </label>
                    </div>

                    <div className="modal-buttons">
                        <button type="submit">저장</button>
                        <button type="button" onClick={onCancel}>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CampingZonePage({ user }) {
    const [zones, setZones] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingZone, setEditingZone] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchZones = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const data = await fetchWithAuth('/api/zones');
                setZones(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchZones();
    }, [user]);

    const handleAddClick = () => {
        setEditingZone(null);
        setIsModalOpen(true);
        setError("");
    };

    const handleEditClick = (zone) => {
        setEditingZone(zone);
        setIsModalOpen(true);
        setError("");
    };

    // handleSave 함수 시그니처 변경 (imageFile 파라미터 추가)
    const handleSave = async (zoneData, imageFile) => {
        setError("");
        const url = editingZone ? `/api/zones/${editingZone.id}` : '/api/zones';
        const method = editingZone ? 'PUT' : 'POST';

        // FormData 객체 생성
        const formData = new FormData();
        // zoneData 객체의 모든 키-값 쌍을 FormData에 추가
        Object.keys(zoneData).forEach(key => {
            if (zoneData[key] !== null) {
                 formData.append(key, zoneData[key]);
            }
        });
        // 새 이미지 파일이 선택되었으면 추가
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }
        // 추가 모드일 때는 adminId를 백엔드에서 처리하므로 여기서 보내지 않음
        // if (!editingZone && user && user.id) {
        //     formData.append('adminId', user.id); // 제거
        // }

        try {
            const savedZone = await fetchWithAuth(url, {
                method: method,
                // FormData 전송 시 Content-Type 헤더는 설정하지 않음!
                body: formData
            });

            // 상태 업데이트
            if (editingZone) {
                setZones(zones.map(z => z.id === savedZone.id ? savedZone : z));
            } else {
                setZones([...zones, savedZone]);
            }
            setIsModalOpen(false);
            setEditingZone(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingZone(null);
        setError("");
    };

    if (loading) return <div>캠핑존 목록을 불러오는 중...</div>;

    return (
        <div>
            <h2>캠핑존 관리</h2>
            <p>로그인된 이메일: {user ? user.email : ""}</p>
            <table border="1" style={{ margin: "20px auto", minWidth: "800px" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>이름</th>
                        {/* 📝 이미지 컬럼 추가 */}
                        <th>이미지</th>
                        <th>가격</th>
                        <th>수용인원</th>
                        <th>상태</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {zones.length === 0 ? (
                        <tr>
                            {/* 📝 colSpan 7로 변경 */}
                            <td colSpan="7" align="center">등록된 캠핑존이 없습니다.</td>
                        </tr>
                    ) : (
                        zones.map(zone => (
                            <tr key={zone.id}>
                                <td>{zone.id}</td>
                                <td>{zone.name}</td>
                                {/* 📝 이미지 표시 */}
                                <td>{zone.imageUrl ? <img src={zone.imageUrl} alt={zone.name} width="50" /> : '없음'}</td>
                                <td>{zone.price != null ? zone.price.toLocaleString() : 0} 원</td>
                                <td>{zone.capacity} 명</td>
                                <td>{zone.isActive === true || zone.isActive === 1 ? '예약 가능' : '예약 불가'}</td>
                                <td>
                                    <button onClick={() => handleEditClick(zone)}>수정</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <button onClick={handleAddClick}>새 캠핑존 추가</button>
            {isModalOpen && (
                <CampingZoneModal
                    zone={editingZone}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    );
}

export default CampingZonePage;