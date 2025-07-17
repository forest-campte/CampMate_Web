import React, { useState } from "react";
import { useNavigate , Link} from "react-router-dom";

function LoginPage({ setUser }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/admins/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "로그인 실패");
      }

      const adminData = await res.json(); 
      setUser(adminData); 
      navigate("/reservation");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    return (
        <div>
            <form onSubmit={handleSubmit} className="container">
                <h2>CampMate<br/>관리자 페이지</h2>
                <div>
                    <input type="email" name="email" class="Login_email" value={email} placeholder="이메일 입력" onChange={e => setEmail(e.target.value)} required/>
                </div>
                <div>
                    <input type="password" name="password" class="Login_pwd" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} required/>
                    <div className="signup_btn">
                      <Link to="/signup">관리자 등록</Link>
                    </div>
                </div>
                
                <button type="submit" disabled={loading} className="button">
                {loading ? "로그인 중..." : "로그인"}
                </button>
                {error && <div style={{ color: "red" }}>{error}</div>}
            </form>
    </div>
    );
}

export default LoginPage;