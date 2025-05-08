import '../styles/globals.css';
import 'tailwindcss/tailwind.css';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const goHome = () => {
    window.localStorage.removeItem('password');
    router.push('/');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-white font-sans relative'>
      {/* 页面主体内容 */}
      <Component {...pageProps} />

      {/* 左下角悬浮按钮 */}
      {router.pathname !== '/dsyPC' && (
        <button
          onClick={goHome}
          className='fixed bottom-6 left-6 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition text-xl sm:text-2xl md:text-3xl'
          title='返回主页'
        >
          ⌂
        </button>
      )}
    </div>
  );
}

export default MyApp;
