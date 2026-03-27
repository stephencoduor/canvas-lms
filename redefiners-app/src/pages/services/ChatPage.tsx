import { useState } from 'react'
import { MessageSquare, Send, User, Bot } from 'lucide-react'

interface ChatMessage {
  id: number
  sender: 'user' | 'advisor'
  text: string
  time: string
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 1, sender: 'advisor', text: 'Welcome to ReDefiners Live Chat! How can I help you today?', time: '10:00 AM' },
  { id: 2, sender: 'user', text: 'Hi, I have a question about my course enrollment.', time: '10:01 AM' },
  { id: 3, sender: 'advisor', text: 'Of course! I\'d be happy to help with enrollment questions. Could you tell me which course you\'re interested in?', time: '10:01 AM' },
]

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')

  function handleSend() {
    if (!input.trim()) return
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, newMsg])
    setInput('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Live Chat</h3>
          <p className="mt-1 text-sm text-neutral-500">Chat with an advisor in real time</p>
        </div>
      </div>

      <div className="flex flex-col rounded-lg bg-white shadow-sm" style={{ height: '60vh' }}>
        <div className="flex items-center gap-2 border-b px-5 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-neutral-700">Academic Advisor — Online</span>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 rounded-full p-2 ${msg.sender === 'user' ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-600'}`}>
                {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`max-w-[70%] rounded-lg px-4 py-2.5 ${msg.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-800'}`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`mt-1 text-xs ${msg.sender === 'user' ? 'text-primary-200' : 'text-neutral-400'}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t px-4 py-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-neutral-200 px-4 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
            />
            <button type="button" onClick={handleSend} className="rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
