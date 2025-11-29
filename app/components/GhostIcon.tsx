export default function GhostIcon() {
  return (
    <div className="skull-icon">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        {/* Skull */}
        <ellipse cx="60" cy="50" rx="35" ry="40" fill="#fff" opacity="0.9"/>
        
        {/* Eye sockets */}
        <ellipse cx="48" cy="45" rx="8" ry="12" fill="#000"/>
        <ellipse cx="72" cy="45" rx="8" ry="12" fill="#000"/>
        
        {/* Glowing eyes */}
        <ellipse cx="48" cy="45" rx="4" ry="6" fill="#ff0000">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="72" cy="45" rx="4" ry="6" fill="#ff0000">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
        </ellipse>
        
        {/* Nose */}
        <path d="M 55 58 L 60 65 L 65 58 Z" fill="#000"/>
        
        {/* Teeth */}
        <rect x="45" y="70" width="6" height="8" fill="#000" rx="1"/>
        <rect x="54" y="70" width="6" height="8" fill="#000" rx="1"/>
        <rect x="63" y="70" width="6" height="8" fill="#000" rx="1"/>
        
        {/* Blood drips */}
        <path d="M 48 78 Q 48 85 48 90" stroke="#8b0000" strokeWidth="2" opacity="0.8"/>
        <path d="M 60 78 Q 60 88 60 95" stroke="#8b0000" strokeWidth="2" opacity="0.8"/>
        <path d="M 69 78 Q 69 83 69 88" stroke="#8b0000" strokeWidth="2" opacity="0.8"/>
      </svg>
    </div>
  )
}
