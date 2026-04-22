import React from 'react';

const AvatarCircle = ({ src, name, size = 'md', online = false }) => {
  const sizeMap = {
    sm: { width: 32, height: 32, fontSize: 12 },
    md: { width: 48, height: 48, fontSize: 14 },
    lg: { width: 72, height: 72, fontSize: 18 },
    xl: { width: 120, height: 120, fontSize: 28 },
  };

  const sizeStyle = sizeMap[size];
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div
      className="relative inline-flex items-center justify-center rounded-full bg-blue-100 text-white font-bold"
      style={sizeStyle}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span style={{ fontSize: `${sizeStyle.fontSize * 0.8}px`, color: '#2563EB' }}>
          {initials}
        </span>
      )}
      {online && (
        <div
          className="absolute bottom-0 right-0 bg-green-500 rounded-full border-2 border-white"
          style={{
            width: sizeStyle.width / 4,
            height: sizeStyle.height / 4,
          }}
        />
      )}
    </div>
  );
};

export default AvatarCircle;
