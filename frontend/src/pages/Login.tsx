import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading,setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true';
    });
    
    const {login} = useAuth();
    const navigate = useNavigate();
    
    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        setError('');
        setLoading(true);
        try{
            await login(email,password);
            navigate('/dashboard');
        }
        catch (err: any)
        {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
             
        }
        finally{
            setLoading(false);
        }
    }

    return(
        <div style={{ backgroundColor: darkMode ? '#121212' : '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto', padding: '30px', backgroundColor: darkMode ? '#1e1e1e' : '#fff', color: darkMode ? '#fff' : '#000', borderRadius: '12px', boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)', marginTop: '50px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Login To Clarity</h2>
                    <button
                        onClick={() => {
                            const newMode = !darkMode;
                            setDarkMode(newMode);
                            localStorage.setItem('darkMode', newMode.toString());
                        }}
                        style={{
                            padding: '6px 12px',
                            backgroundColor: darkMode ? '#ffd700' : '#333',
                            color: darkMode ? '#000' : '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                        <input
                        type='email'
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                        style={{width: '100%', padding: '8px', fontSize: '14px', backgroundColor: darkMode ? '#2d2d2d' : '#fff', color: darkMode ? '#fff' : '#000', border: `1px solid ${darkMode ? '#444' : '#ccc'}`}}
                        />
                    </div>

                    
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', fontSize: '14px', backgroundColor: darkMode ? '#2d2d2d' : '#fff', color: darkMode ? '#fff' : '#000', border: `1px solid ${darkMode ? '#444' : '#ccc'}` }}
          />
        </div>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
            </div>
        </div>
        );
};
export default Login;