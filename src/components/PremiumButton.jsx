import React from 'react';
export default function PremiumButton({children, onClick}) {
  return (
    <button onClick={onClick} style={{
      padding:'8px 12px', borderRadius:10, border:'none', cursor:'pointer',
      background:'linear-gradient(90deg,#3b82f6,#3a3cff)', color:'#fff', boxShadow:'0 6px 18px rgba(59,130,246,0.18)'
    }}>{children}</button>
  );
}
