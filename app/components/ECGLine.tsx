export default function ECGLine() {
  return (
    <div className="mb-8 flex justify-center">
      <svg width="100%" height="40" viewBox="0 0 800 40" className="ecg-line">
        <path
          d="M 0 20 L 200 20 L 220 5 L 240 35 L 260 20 L 800 20"
          stroke="#ef4444"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}
