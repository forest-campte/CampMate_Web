import React, { useState, useEffect } from 'react';
import Header from './Header'; // Header 컴포넌트 import

// handleLogout 함수를 props로 전달받음
function AdminListPage({ handleLogout }) {
    // --- TODO: 실제 백엔드 API 연동 필요 ---
    const [admins, setAdmins] = useState([
        { id: 1, name: '테스트 캠핑장1', email: 'test1@camp.com', createDt: '2023-10-01' },
        { id: 2, name: '테스트 캠핑장2', email: 'test2@camp.com', createDt: '2023-10-05' },
        { id: 3, name: '테스트 캠핑장3', email: 'test3@camp.com', createDt: '2023-10-15' },
    ]);

    useEffect(() => {
        // 페이지가 처음 로드될 때 백엔드에서 전체 Admin 목록을
        // fetch로 가져오는 로직이 여기에 들어갑니다.
    }, []);

    return (
        <div>
            {/* Header 컴포넌트를 렌더링하고 로그아웃 함수를 전달 */}
            <Header handleLogout={handleLogout} />

            <div className="admin-list-container">
                <h2>캠핑장 Admin 관리</h2>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>캠핑장 이름</th>
                            <th>이메일</th>
                            <th>가입일</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map(admin => (
                            <tr key={admin.id}>
                                <td>{admin.id}</td>
                                <td>{admin.name}</td>
                                <td>{admin.email}</td>
                                <td>{admin.createDt}</td>
                                <td>
                                    <button>수정</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminListPage;