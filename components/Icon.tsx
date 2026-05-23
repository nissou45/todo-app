import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function Icon({ name, size = 20, color = '#2D3748', strokeWidth = 1.6 }: IconProps) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, strokeWidth,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'check':     return <Svg {...props}><Path d="M4 12.5l5 5L20 6.5" /></Svg>;
    case 'plus':      return <Svg {...props}><Path d="M12 5v14M5 12h14" /></Svg>;
    case 'search':    return <Svg {...props}><Circle cx="11" cy="11" r="6.5" /><Path d="M16 16l4 4" /></Svg>;
    case 'chevronR':  return <Svg {...props}><Path d="M9 6l6 6-6 6" /></Svg>;
    case 'chevronL':  return <Svg {...props}><Path d="M15 6l-6 6 6 6" /></Svg>;
    case 'chevronD':  return <Svg {...props}><Path d="M6 9l6 6 6-6" /></Svg>;
    case 'more':      return <Svg {...props}><Circle cx="5" cy="12" r="1.4" fill={color} stroke="none" /><Circle cx="12" cy="12" r="1.4" fill={color} stroke="none" /><Circle cx="19" cy="12" r="1.4" fill={color} stroke="none" /></Svg>;
    case 'flag':      return <Svg {...props}><Path d="M5 21V4h11l-2 3.5L16 11H5" /></Svg>;
    case 'calendar':  return <Svg {...props}><Rect x="3.5" y="5" width="17" height="15" rx="2" /><Path d="M3.5 10h17M8 3v4M16 3v4" /></Svg>;
    case 'clock':     return <Svg {...props}><Circle cx="12" cy="12" r="8.5" /><Path d="M12 7.5V12l3 2" /></Svg>;
    case 'bell':      return <Svg {...props}><Path d="M6 16V11a6 6 0 1112 0v5l1.5 2.5h-15L6 16z" /><Path d="M10 20a2 2 0 004 0" /></Svg>;
    case 'repeat':    return <Svg {...props}><Path d="M4 9l3-3 3 3M7 6v8a3 3 0 003 3h7M20 15l-3 3-3-3M17 18v-8a3 3 0 00-3-3H7" /></Svg>;
    case 'paperclip': return <Svg {...props}><Path d="M20 10.5l-9 9a4 4 0 11-5.5-5.5l9.5-9.5a3 3 0 014 4L9.5 18" /></Svg>;
    case 'x':         return <Svg {...props}><Path d="M6 6l12 12M18 6L6 18" /></Svg>;
    case 'flame':     return <Svg {...props}><Path d="M12 3c2 4 5 5 5 9a5 5 0 11-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-8z" /></Svg>;
    case 'trend':     return <Svg {...props}><Path d="M3 17l5-5 4 4 8-8" /><Path d="M14 8h6v6" /></Svg>;
    case 'home':      return <Svg {...props}><Path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-9z" /></Svg>;
    case 'grid':      return <Svg {...props}><Rect x="4" y="4" width="7" height="7" rx="1.5" /><Rect x="13" y="4" width="7" height="7" rx="1.5" /><Rect x="4" y="13" width="7" height="7" rx="1.5" /><Rect x="13" y="13" width="7" height="7" rx="1.5" /></Svg>;
    case 'chart':     return <Svg {...props}><Path d="M5 20V10M12 20V4M19 20v-7" /></Svg>;
    case 'user':      return <Svg {...props}><Circle cx="12" cy="8.5" r="4" /><Path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></Svg>;
    case 'filter':    return <Svg {...props}><Path d="M4 6h16M7 12h10M10 18h4" /></Svg>;
    case 'briefcase': return <Svg {...props}><Rect x="3" y="7" width="18" height="13" rx="2" /><Path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" /></Svg>;
    case 'heart':     return <Svg {...props}><Path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" /></Svg>;
    case 'leaf':      return <Svg {...props}><Path d="M5 19c0-8 5-14 14-14 0 9-5 14-14 14z" /><Path d="M5 19l9-9" /></Svg>;
    case 'book':      return <Svg {...props}><Path d="M4 5a2 2 0 012-2h13v17H6a2 2 0 00-2 2V5z" /><Path d="M4 20a2 2 0 012-2h13" /></Svg>;
    default: return null;
  }
}
