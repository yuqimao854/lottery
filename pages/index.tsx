import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';

const routerList = ['dsy', 'block'];

const Home: NextPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false); // 添加 error 状态
  const router = useRouter();

  const handleSubmit = () => {
    if (routerList.includes(password)) {
      setError(false); // 清除错误提示
      router.push(`/${password}`);
      window.localStorage.setItem('password', password);
    } else {
      setError(true); // 显示错误提示
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <Head>
        <title>Home</title>
      </Head>

      <div className='bg-white border border-gray-200 rounded-2xl shadow-xl p-8 w-full max-w-md text-center'>
        <h1 className='text-2xl font-semibold text-gray-800 mb-4'>欢迎回来</h1>
        <p className='text-gray-500 mb-6'>请输入密码以继续</p>

        <div className='flex items-center gap-2'>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false); // 输入时清除错误提示
            }}
            placeholder='请输入密码'
            className={`flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition duration-200 shadow-sm placeholder-gray-400 ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          <button
            onClick={handleSubmit}
            className='px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition'
          >
            确定
          </button>
        </div>

        {error && (
          <p className='text-red-500 text-sm mt-2'>密码错误，请重新输入</p>
        )}
      </div>
    </div>
  );
};

export default Home;
