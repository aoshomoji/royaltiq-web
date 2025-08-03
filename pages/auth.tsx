import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push('/catalogs');
    };
    checkUser();
  }, []);

  const handleEmailAuth = async () => {
    const { error, data } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
  
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      if (isLogin) {
        router.push('/catalogs');  // ✅ redirect after login
      } else {
        setMessage('Please check your email to confirm sign-up!');
      }
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/catalogs', // explicitly set
      },
    });
  
    if (error) {
      setMessage(`Google login error: ${error.message}`);
      console.error('[OAuth Error]', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-gray-100 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Log In' : 'Sign Up'}</h2>

      <input
        type="email"
        className="mb-3 w-full p-2 border rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="mb-3 w-full p-2 border rounded"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleEmailAuth}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isLogin ? 'Log In' : 'Sign Up'}
      </button>

      <div className="text-center my-3 text-gray-500">— OR —</div>

      <button
        onClick={handleGoogleLogin}
        className="w-full bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
      >
        Sign in with Google
      </button>

      <p className="mt-4 text-sm cursor-pointer text-blue-600" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
      </p>

      {message && (
        <div className="mt-4 text-sm text-center text-red-600">
          {message}
        </div>
      )}
    </div>
  );
}

