import React from 'react';

const COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500',
  'bg-orange-500', 'bg-pink-500', 'bg-teal-500',
];

const AvatarCircle = ({ name = '', size = 'md' }) => {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const colorIndex = name.charCodeAt(0) % COLORS.length;
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

  return (
    <div className={`${COLORS[colorIndex]} ${sizeClass} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
      {initials || '?'}
    </div>
  );
};

export default AvatarCircle;
