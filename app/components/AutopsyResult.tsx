interface AutopsyResultProps {
  result: {
    ghosting_probability: number
    interest_slope: string
    tone_shift: {
      start: string
      end: string
    }
    message_pattern: {
      your_avg_length: string
      their_avg_length: string
      your_reply_delay: string
      their_reply_delay: string
      double_texting: string
      dominant_speaker: string
    }
    red_flags: string[]
    ghosting_type: string
    timeline_analysis: Array<{
      message_index: number
      event: string
    }>
    cause_of_death: string
    severity_meter: string
    verdict: string
    toxic_friend_comment: string
    revival_chance: number
    recommended_next_move: string
  }
}

export default function AutopsyResult({ result }: AutopsyResultProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl tracking-widest text-red-500 font-bold uppercase" style={{ fontFamily: 'Creepster, cursive' }}>
          ☠️ Autopsy Report ☠️
        </h2>
        <div className="w-32 h-1 bg-red-600 mx-auto mt-4"></div>
      </div>

      {/* Ghosting Probability & Severity */}
      <div className="ghost-card p-6">
        <h3 className="text-orange-500 font-bold mb-4 text-sm tracking-widest uppercase">☠️ Ghosting Probability</h3>
        <div className="flex items-end gap-4 mb-4">
          <div className="text-5xl font-bold text-red-500 tabular-nums">
            {result.ghosting_probability}%
          </div>
          <div className="flex-1 mb-3">
            <div className="w-full bg-gray-900 h-2 rounded-sm overflow-hidden">
              <div
                className="probability-bar h-full"
                style={{ width: `${result.ghosting_probability}%` }}
              />
            </div>
          </div>
        </div>
        <div className="text-3xl">{result.severity_meter}</div>
      </div>

      {/* Verdict */}
      <div className="ghost-card p-6 border-4">
        <h3 className="text-red-500 font-bold mb-3 text-sm tracking-widest uppercase">⚰️ Final Verdict</h3>
        <p className="text-gray-200 leading-relaxed text-lg">
          {result.verdict}
        </p>
      </div>

      {/* Interest & Tone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="ghost-card p-6">
          <h3 className="text-orange-500 font-bold mb-3 text-xs tracking-widest uppercase">📉 Interest Slope</h3>
          <p className="text-gray-200 text-2xl capitalize">{result.interest_slope}</p>
        </div>

        <div className="ghost-card p-6">
          <h3 className="text-orange-500 font-bold mb-3 text-xs tracking-widest uppercase">🌡️ Tone Shift</h3>
          <p className="text-gray-200">
            <span className="capitalize">{result.tone_shift.start}</span>
            <span className="text-red-500 mx-2">→</span>
            <span className="capitalize">{result.tone_shift.end}</span>
          </p>
        </div>
      </div>

      {/* Message Pattern */}
      <div className="ghost-card p-6">
        <h3 className="text-orange-500 font-bold mb-4 text-sm tracking-widest uppercase">💬 Conversation Dynamics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-500 text-xs mb-1">Your avg length</div>
            <div className="text-gray-200">{result.message_pattern.your_avg_length}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Their avg length</div>
            <div className="text-gray-200">{result.message_pattern.their_avg_length}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Double texting</div>
            <div className="text-gray-200 capitalize">{result.message_pattern.double_texting}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Dominant speaker</div>
            <div className="text-gray-200 capitalize">{result.message_pattern.dominant_speaker}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-1">Ghosting type</div>
            <div className="text-gray-200 capitalize">{result.ghosting_type.replace(/-/g, ' ')}</div>
          </div>
        </div>
      </div>

      {/* Cause of Death */}
      <div className="ghost-card p-6 border-4">
        <h3 className="text-red-500 font-bold mb-3 text-sm tracking-widest uppercase blood-drip">🩸 Cause of Death</h3>
        <p className="text-gray-200 leading-relaxed text-lg">
          {result.cause_of_death}
        </p>
      </div>

      {/* Toxicology Report */}
      <div className="ghost-card p-6">
        <h3 className="text-orange-500 font-bold mb-4 text-sm tracking-widest uppercase">🧪 Toxicology Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {result.red_flags.map((flag, index) => (
            <div
              key={index}
              className="p-3 bg-red-950 bg-opacity-30 border border-red-600 text-sm text-orange-200"
            >
              <span className="text-red-500 mr-2">🚩</span>
              {flag}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Analysis */}
      {result.timeline_analysis.length > 0 && (
        <div className="ghost-card p-6">
          <h3 className="text-orange-500 font-bold mb-4 text-sm tracking-widest uppercase">⏰ Timeline Analysis</h3>
          <div className="space-y-2">
            {result.timeline_analysis.map((event, index) => (
              <div key={index} className="text-sm text-gray-300 flex items-center gap-3">
                <span className="text-red-500 font-mono">#{event.message_index}</span>
                <span className="capitalize">{event.event.replace(/-/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toxic Friend Comment */}
      <div className="toxic-comment p-8 pt-10">
        <h3 className="text-red-500 font-bold mb-3 text-sm tracking-widest uppercase">Your Toxic Best Friend Says</h3>
        <p className="text-orange-200 leading-relaxed italic text-lg">
          "{result.toxic_friend_comment}"
        </p>
      </div>

      {/* Revival Chance & Next Move */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="ghost-card p-6">
          <h3 className="text-orange-500 font-bold mb-3 text-xs tracking-widest uppercase">🔮 Revival Chance</h3>
          <div className="text-3xl font-bold text-gray-200 tabular-nums">
            {result.revival_chance}%
          </div>
        </div>

        <div className="ghost-card p-6">
          <h3 className="text-orange-500 font-bold mb-3 text-xs tracking-widest uppercase">💀 Next Move</h3>
          <p className="text-gray-200 text-sm leading-relaxed">
            {result.recommended_next_move}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-red-900 text-sm tracking-widest mt-12 uppercase font-bold">
        ⚰️ Case Closed ⚰️
      </div>
    </div>
  )
}
