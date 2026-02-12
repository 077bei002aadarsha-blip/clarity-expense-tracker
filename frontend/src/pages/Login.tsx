import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = ()=>
{
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading,setLoading] = useState(false);
    
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
            <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
                <h2>Login To Clarity</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                        <input
                        type='email'
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                        style={{width: '100%', padding: '8px', fontSize: '14px'}}
                        />
                    </div>

                    
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', fontSize: '14px' }}
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
  );
};
export default Login;