// ToggleTier.tsx

import { useState } from 'react';
import clsx from 'clsx'; // Optional utility for conditional classnames

export default function ToggleTier() {
  const [selected, setSelected] = useState<'free' | 'solo'>('free');

  return (
    <div className="relative w-full max-w-md mx-auto mt-10">
      {/* Toggle Track */}
      <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 relative h-12">
        {/* Indicator Animation Layer */}
        <div
          className={clsx(
            'absolute top-1 left-1 h-10 w-1/3 bg-white rounded-full shadow-md transition-all duration-300 ease-in-out z-0',
            {
              'translate-x-0': selected === 'free',
              'translate-x-full': selected === 'solo'
            }
          )}
        />

        {/* Options */}
        <label
          htmlFor="free"
          className="flex-1 text-center cursor-pointer z-10 relative"
        >
          <input
            type="radio"
            id="free"
            name="tier"
            value="free"
            className="sr-only"
            checked={selected === 'free'}
            onChange={() => setSelected('free')}
          />
          <span
            className={clsx('block font-medium transition-opacity', {
              'opacity-100 text-black': selected === 'free',
              'opacity-60 text-gray-600 dark:text-gray-300':
                selected !== 'free',
            })}
          >
            Free
          </span>
        </label>

        <label
          htmlFor="solo"
          className="flex-1 text-center cursor-pointer z-10 relative"
        >
          <input
            type="radio"
            id="solo"
            name="tier"
            value="solo"
            className="sr-only"
            checked={selected === 'solo'}
            onChange={() => setSelected('solo')}
          />
          <span
            className={clsx('block font-medium transition-opacity', {
              'opacity-100 text-black': selected === 'solo',
              'opacity-60 text-gray-600 dark:text-gray-300':
                selected !== 'solo',
            })}
          >
            Solo
          </span>
        </label>

      </div>
    </div>
  );
}
