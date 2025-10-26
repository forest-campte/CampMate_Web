import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function SignUpPage() {
    const [campEmail, setEmail] = useState("");
    const [campName, setCampName] = useState("");
    const [password, setPassword] = useState("");
    const [campDesc, setCampDesc] = useState("");
    const [style, setStyle] = useState("");
    const [background, setBackground] = useState("");
    const [mate, setMate] = useState("");
    const [address, setAddress] = useState(""); // 주소 상태 추가
    const [imageFile, setImageFile] = useState(null); // 이미지 파일 상태 추가
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    // 파일 선택 시 상태 업데이트 핸들러
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!campName || !campEmail || !password || !campDesc || !style || !background || !mate || !address) {
            setError("모든 필수 항목을 입력하세요. (이미지 파일은 선택)");
            return;
        }

        // FormData 객체 생성
        const formData = new FormData();
        formData.append('email', campEmail);
        formData.append('name', campName);
        formData.append('password', password);
        formData.append('description', campDesc);
        formData.append('campingStyle', style);
        formData.append('campingBackground', background);
        formData.append('campingType', mate);
        formData.append('address', address);
        // 파일이 선택되었을 경우 FormData에 추가
        if (imageFile) {
            formData.append('imageFile', imageFile); // 백엔드에서 받을 이름 ('imageFile')
        }

        try {
            // fetch 요청 수정: JSON 대신 FormData 전송
            const res = await fetch("http://localhost:8080/api/admins/signup", {
                method: "POST",
                // FormData 전송 시 Content-Type 헤더는 설정하지 않음!
                body: formData
            });

            if (!res.ok) {
                const errorText = await res.text();
                try {
                    const errData = JSON.parse(errorText);
                    throw new Error(errData.message || "회원가입 실패");
                } catch (parseError) {
                    throw new Error(errorText || "회원가입 실패");
                }
            }
            setSuccess("회원가입이 완료되었습니다! 잠시 후 로그인 페이지로 이동합니다.");

            setTimeout(() => {
                navigate("/Login");
            }, 2000);

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <form className="container" onSubmit={handleSubmit}>
                <Link to="/Login">
                    <button style={{ position: "absolute", left: 0, top: 0 }} type="button">로그인 페이지 이동</button>
                </Link>
                <h2>CampMate 관리자 등록</h2>
                <div className="signup-form-row">
                    <div className="signup-form-left">
                        <input style={{ display: "flex" }} placeholder="캠핑장 이름 입력"
                            type="text" value={campName} onChange={e => setCampName(e.target.value)} required />

                        <input style={{ display: "flex" }} placeholder="이메일 입력"
                            type="email" value={campEmail} onChange={e => setEmail(e.target.value)} required />

                        <input placeholder="비밀번호 입력"
                            type="password" value={password} onChange={e => setPassword(e.target.value)} required />

                        {/* --- 주소 입력 필드 추가 --- */}
                        <input style={{ display: "flex" }} placeholder="캠핑장 주소 입력"
                            type="text" value={address} onChange={e => setAddress(e.target.value)} required />
                        {/* ----------------------------- */}

                        {/* --- 이미지 파일 선택 필드 추가 --- */}
                        <label htmlFor="imageFile-input">대표 이미지 파일</label>
                        <input id="imageFile-input" style={{ display: "flex" }}
                            type="file" accept="image/*" onChange={handleFileChange} />
                        {/* ------------------------------ */}

                        <label>캠핑장 설명</label>
                        <textarea style={{ resize: "none", width: "300px", height: "100px" }} value={campDesc} onChange={e => setCampDesc(e.target.value)} required />
                    </div>
                    <div className="signup-form-right">
                        <div>
                            <select style={{ width: "140px" }} value={style} onChange={e => setStyle(e.target.value)} required>
                                <option value="">캠핑 스타일</option>
                                <option value="오토캠핑">오토캠핑</option>
                                <option value="백패킹">백패킹</option>
                                <option value="글램핑">글램핑</option>
                                <option value="카라반">카라반</option>
                            </select>
                        </div>
                        <div>
                            <select style={{ width: "140px" }} value={background} onChange={e => setBackground(e.target.value)} required>
                                <option value="">캠핑장 배경 및 환경</option>
                                <option value="산">산속</option>
                                <option value="바다">바다</option>
                                <option value="계곡">계곡</option>
                            </select>
                        </div>
                        <div>
                            <select style={{ width: "140px" }} value={mate} onChange={e => setMate(e.target.value)} required>
                                <option value="">추천 동행자</option>
                                <option value="가족">가족</option>
                                <option value="연인">연인</option>
                                <option value="친구">친구</option>
                                <option value="반려동물">반려동물</option>
                                <option value="혼자">혼자</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: "24px", textAlign: "center" }}>
                    <button className="button" type="submit">가입하기</button>
                </div>
                {error && <div style={{ color: "red", marginTop: "12px" }}>{error}</div>}
                {success && <div style={{ color: "green", marginTop: "12px" }}>{success}</div>}
            </form>
        </div>
    );
}

export default SignUpPage;