
import React from 'react';
import { SparklesIcon } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-3xl text-center py-6 px-4">
      <div className="flex items-center justify-center">
        <SparklesIcon className="w-10 h-10 mr-3 text-indigo-500" />
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
          DreamCraft
        </h1>
      </div>
      <p className="text-neutral-600 mt-2 text-sm sm:text-base">
        借助AI的力量，打造独特的冒险！
      </p>
    </header>
  );
};

export default Header;
