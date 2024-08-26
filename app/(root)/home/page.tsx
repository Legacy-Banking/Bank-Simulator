import Link from 'next/link';
import React from 'react'

const Home = () => {
  return (
    <div className='flex flex-col border-4 border-black items-center min-h-screen'>
      <div className='flex text-3xl p-2 border-solid bg-yellow-200'><Link href="/log-in"> Click here to Login!</Link></div>
    </div>
  );
}

export default Home