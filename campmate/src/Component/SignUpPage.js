import React, { useState } from "react";
import { useNavigate,  Link  } from "react-router-dom";

function SignUpPage() {
  const [campName, setCampName] = useState("");
  const [password, setPassword] = useState("");
  const [campDesc, setCampDesc] = useState("");
  const [parking, setParking] = useState("");
  const [style, setStyle] = useState("");
  const [background, setBackground] = useState("");
  const [mate, setMate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 입력값 유효성 검사 (필요시 추가)
    if (!campName || !password || !campDesc || !parking || !style || !background || !mate) {
      setError("모든 항목을 입력하세요.");
      return;
    }

    // 서버로 보낼 데이터
    const newAdmin = {
      name: campName,
      password: password,
      description: campDesc,
      parking: parking,
      campingStyle: style,
      campingBackground: background,
      campingType: mate
    };

    try {
      const res = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "회원가입 실패");
      }
      setSuccess("회원가입이 완료되었습니다!");
      navigate("/Login");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div>
      <form className="container">
        <Link to="/Login">
            <button style={{position: "absolute", left: 0, top: 0}} type="button">로그인 페이지 이동</button>
        </Link>
        <h2>CampMate 관리자 등록</h2>
        <div className="signup-form-row">
            <div className="signup-form-left">
                <input style={{display: "flex"}} placeholder="캠핑장 이름 입력"
                    type="text"
                    value={campName}
                    onChange={e => setCampName(e.target.value)}
                    required
                />
                <input placeholder="비밀번호 입력"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <label>캠핑장 설명</label>
                <textarea style={{ resize: "none", width: "300px", height: "100px" }} value={campDesc} onChange={e => setCampDesc(e.target.value)} required/>
            </div>
            <div className="signup-form-right">
                <div>
                <select style={{ width: "140px" }} value={parking} onChange={e => setParking(e.target.value)} required>
                    <option value="">주차 가능 여부</option>
                    <option value="가능">가능</option>
                    <option value="불가능">불가능</option>
                </select>
                </div>
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
                <select style={{ width: "140px" }} value={background} onChange={e => setBackground(e.target.value)}required>
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