'use client'

import { useState } from 'react'

export default function MobileInstructions() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-black bg-opacity-50 border border-gray-800 text-gray-400 text-xs tracking-wider hover:border-purple-500 transition-all flex items-center justify-between"
      >
        <span>📱 How to use on iMessage, WhatsApp, Hinge, etc.</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="mt-2 p-6 bg-black bg-opacity-70 border border-gray-800 text-gray-300 text-sm space-y-4">
          <div>
            <h3 className="text-purple-400 font-semibold mb-2 text-xs tracking-wider uppercase">Method 1: Copy & Paste (Fastest)</h3>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Open your chat app (iMessage, WhatsApp, Hinge, etc.)</li>
              <li>Long-press on messages and select "Copy"</li>
              <li>Come back here and click "📋 Paste from Clipboard"</li>
              <li>Click "Perform Autopsy"</li>
            </ol>
          </div>

          <div>
            <h3 className="text-purple-400 font-semibold mb-2 text-xs tracking-wider uppercase">Method 2: Screenshot</h3>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Take a screenshot of your conversation</li>
              <li>Click "📸 Upload Screenshot"</li>
              <li>Select your screenshot</li>
              <li>Wait for text extraction (10-20 seconds)</li>
              <li>Click "Perform Autopsy"</li>
            </ol>
          </div>

          <div>
            <h3 className="text-purple-400 font-semibold mb-2 text-xs tracking-wider uppercase">Method 3: Type Manually</h3>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Click "Type Text"</li>
              <li>Format as: "Me: [your message]" and "Her: [their message]"</li>
              <li>Click "Perform Autopsy"</li>
            </ol>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              💡 <span className="text-purple-400">Pro tip:</span> Copy & Paste works best on all apps. Just select multiple messages at once!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
