import React, { useState, useEffect, useRef } from 'react';
import { MemoryItem, MoodType } from '../types';
import { CompanionAvatar } from './CompanionAvatar';
import { sound } from '../audio';
import { X, Send, Sparkles, Heart, MessageCircle } from 'lucide-react';

interface CompanionModalProps {
  isOpen: boolean;
  userName: string;
  currentMood: MoodType;
  memories: MemoryItem[];
  activeMemoryFocus?: MemoryItem | null;
  onClose: () => void;
  onOpenWrite?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'companion' | 'user';
  text: string;
  timestamp: number;
  structuredHelp?: {
    whatWeKnow?: string;
    whatWeDontKnow?: string;
    possibleExplanations?: string[];
    whatNext?: string;
  };
}

const COMPANION_STORAGE_KEY = 'hanamori_companion_chat_v1';

export const CompanionModal: React.FC<CompanionModalProps> = ({
  isOpen,
  userName,
  currentMood,
  memories,
  activeMemoryFocus,
  onClose,
  onOpenWrite,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(COMPANION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    const greeting = userName
      ? `Hello, ${userName}! 🌸 I am Hana, your garden companion. I'm here to listen, celebrate your bright days, and sit quietly with you when things feel heavy. How are you feeling right now?`
      : `Hello! 🌸 I am Hana, your companion in Hanamori. I'm here to listen, celebrate your joyful moments, and keep you company. What's on your mind today?`;

    return [
      {
        id: 'msg-initial',
        sender: 'companion',
        text: greeting,
        timestamp: Date.now(),
      },
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [companionMood, setCompanionMood] = useState<'happy' | 'gentle' | 'listening' | 'excited' | 'thoughtful'>('gentle');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Handle opening directly to reflect on a specific memory
  useEffect(() => {
    if (isOpen && activeMemoryFocus) {
      setCompanionMood('listening');
      const focusId = `focus-${activeMemoryFocus.id}`;
      setMessages((prev) => {
        if (prev.some((m) => m.id === focusId)) return prev;
        return [
          ...prev,
          {
            id: focusId,
            sender: 'companion',
            text: `I'm sitting with you right now under your "${activeMemoryFocus.title}" tree 🌸. Whenever you're ready, tell me what you're feeling about this moment.`,
            timestamp: Date.now(),
          },
        ];
      });
    }
  }, [isOpen, activeMemoryFocus]);

  if (!isOpen) return null;

  // Intelligent Companion empathetic response engine adhering strictly to rules 30-38
  const generateCompanionResponse = (userQuery: string): ChatMessage => {
    const query = userQuery.toLowerCase().trim();
    const time = Date.now();

    // 1. CONFUSION / FRIEND / RELATIONSHIP / UNCERTAINTY
    if (
      query.includes("don't understand") ||
      query.includes('dont understand') ||
      query.includes('confused') ||
      query.includes('why did') ||
      query.includes('why would') ||
      query.includes('help me understand') ||
      query.includes('why my friend')
    ) {
      setCompanionMood('thoughtful');
      return {
        id: `comp-${time}`,
        sender: 'companion',
        text: `Let's think about it together, ${userName || 'my friend'}. It's completely normal to feel confused when people act in ways we didn't expect.`,
        timestamp: time,
        structuredHelp: {
          whatWeKnow: "You experienced something that felt unexpected, and you care enough about the situation to reflect on it.",
          whatWeDontKnow: "We don't know what the other person might be going through privately, what stressors they have, or what was in their thoughts.",
          possibleExplanations: [
            "They might be having a difficult or overwhelming day unrelated to you.",
            "There may have been a simple misunderstanding or different communication style.",
            "They might need a little time and emotional space to process things.",
          ],
          whatNext: "When you're ready, you could gently check in with them without pressure, or give yourself permission to take a pause and breathe.",
        },
      };
    }

    // 2. SADNESS / HURT / HEAVINESS
    if (
      query.includes('sad') ||
      query.includes('hurt') ||
      query.includes('crying') ||
      query.includes('hard') ||
      query.includes('difficult') ||
      query.includes('heavy') ||
      query.includes('tired') ||
      query.includes('lonely') ||
      query.includes('overwhelmed')
    ) {
      setCompanionMood('gentle');
      return {
        id: `comp-${time}`,
        sender: 'companion',
        text: `That sounds like a difficult day, ${userName || 'friend'}. It's okay to feel sad or tired sometimes. You don't have to solve everything at once. Take a slow, quiet breath with me here in Hanamori. If you'd like, writing it down into a seed can help release some of the weight into the earth.`,
        timestamp: time,
      };
    }

    // 3. HAPPINESS / WONDERFUL / GRATITUDE
    if (
      query.includes('happy') ||
      query.includes('great') ||
      query.includes('good') ||
      query.includes('amazing') ||
      query.includes('wonderful') ||
      query.includes('smile') ||
      query.includes('love') ||
      query.includes('grateful')
    ) {
      setCompanionMood('happy');
      return {
        id: `comp-${time}`,
        sender: 'companion',
        text: `That sounds like such a wonderful moment! 🌸 I'm really happy that today gave you something to smile about, ${userName || 'friend'}! Moments like this are precious treasures. Would you like to plant it as a memory tree so you can always revisit it?`,
        timestamp: time,
      };
    }

    // 4. EXCITEMENT / ENTHUSIASM
    if (
      query.includes('excited') ||
      query.includes('yay') ||
      query.includes('can\'t wait') ||
      query.includes('fun') ||
      query.includes('awesome') ||
      query.includes('wow')
    ) {
      setCompanionMood('excited');
      return {
        id: `comp-${time}`,
        sender: 'companion',
        text: `That's so exciting! Tell me more! ✨ Your energy is brightening up the whole garden today!`,
        timestamp: time,
      };
    }

    // 5. ASKING ABOUT SAVED MEMORIES / GARDEN
    if (
      query.includes('memory') ||
      query.includes('memories') ||
      query.includes('tree') ||
      query.includes('garden')
    ) {
      setCompanionMood('happy');
      if (memories.length === 0) {
        return {
          id: `comp-${time}`,
          sender: 'companion',
          text: `Your garden is currently open, peaceful, and ready for your first memory sprout! Whenever something touches your heart, you can write it down with the ✏️ Write button, and we can plant it together.`,
          timestamp: time,
        };
      }

      const recent = memories[memories.length - 1];
      return {
        id: `comp-${time}`,
        sender: 'companion',
        text: `You currently have ${memories.length} ${
          memories.length === 1 ? 'memory tree' : 'memory trees'
        } blooming in your sanctuary! I especially remember "${recent.title}", which you planted with ${recent.emotion} feelings. Each tree here holds a piece of your real story.`,
        timestamp: time,
      };
    }

    // 6. DEFAULT WARM, EMPATHETIC & CURIOUS RESPONSE
    setCompanionMood('listening');
    return {
      id: `comp-${time}`,
      sender: 'companion',
      text: `Thank you for sharing that with me, ${userName || 'friend'}. I'm listening closely. How does thinking about that feel in your body right now? Remember, this garden is a safe space where every feeling is welcomed without judgment.`,
      timestamp: time,
    };
  };

  const handleSend = (textToSend?: string) => {
    const raw = textToSend !== undefined ? textToSend : inputText;
    const text = raw.trim();
    if (!text) return;

    sound.playClick();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Realistic gentle companion typing delay
    setTimeout(() => {
      const response = generateCompanionResponse(text);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
      sound.playNote(523.25, 0.4); // soft C5 chime
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const promptChips = [
    'What do you think?',
    'Help me understand this.',
    'Today was amazing! ✨',
    'Why do I feel like this?',
    'Tell me about my garden.',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/45 backdrop-blur-xs select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl h-[86vh] max-h-[680px] bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-pink-100 flex flex-col overflow-hidden"
      >
        {/* Header: # MY COMPANION */}
        <div className="p-4 sm:p-5 border-b border-pink-100 bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <CompanionAvatar size={48} mood={companionMood} />
            <div>
              <h1
                id="my-companion-title"
                className="text-xl sm:text-2xl font-black text-[#9d3862] font-['Zen_Maru_Gothic'] flex items-center gap-2"
              >
                <span># MY COMPANION</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold">
                  Hana 🌸
                </span>
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Your supportive, kind friend living here in Hanamori
              </p>
            </div>
          </div>

          <button
            id="close-companion-btn"
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-white/80 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-['Nunito']">
          {messages.map((msg) => {
            const isComp = msg.sender === 'companion';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-end ${isComp ? 'justify-start' : 'justify-end'}`}
              >
                {isComp && (
                  <div className="flex-shrink-0 mb-1">
                    <CompanionAvatar size={34} mood={companionMood} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 text-sm leading-relaxed shadow-xs ${
                    isComp
                      ? 'bg-gradient-to-br from-pink-50/90 via-rose-50/80 to-white text-stone-800 border border-pink-100 rounded-bl-xs'
                      : 'bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-br-xs font-medium'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Structured Reflection Card for confusion / problem solving */}
                  {msg.structuredHelp && (
                    <div className="mt-3 p-3 rounded-xl bg-white/95 border border-pink-200/70 text-xs text-stone-700 space-y-2">
                      <div>
                        <span className="font-extrabold text-pink-900 block mb-0.5">
                          🌱 What we know:
                        </span>
                        <span className="text-stone-600">{msg.structuredHelp.whatWeKnow}</span>
                      </div>

                      <div>
                        <span className="font-extrabold text-purple-900 block mb-0.5">
                          ☁️ What we don't know:
                        </span>
                        <span className="text-stone-600">{msg.structuredHelp.whatWeDontKnow}</span>
                      </div>

                      {msg.structuredHelp.possibleExplanations && (
                        <div>
                          <span className="font-extrabold text-amber-900 block mb-1">
                            ✨ Possible explanations:
                          </span>
                          <ul className="list-disc pl-4 space-y-0.5 text-stone-600">
                            {msg.structuredHelp.possibleExplanations.map((exp, idx) => (
                              <li key={idx}>{exp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {msg.structuredHelp.whatNext && (
                        <div className="pt-1 border-t border-pink-100">
                          <span className="font-extrabold text-emerald-800 block mb-0.5">
                            🌸 What you could do next:
                          </span>
                          <span className="text-stone-700">{msg.structuredHelp.whatNext}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={`text-[10px] mt-1.5 text-right font-semibold ${
                      isComp ? 'text-pink-400' : 'text-pink-100'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-2.5 items-center text-xs text-stone-400 font-bold pl-1">
              <CompanionAvatar size={28} mood="thoughtful" />
              <div className="px-3.5 py-2 rounded-2xl bg-pink-50 text-pink-600 border border-pink-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce" />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
                <span className="ml-1 text-[11px]">Hana is listening...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-stone-50/80 border-t border-pink-100/60 flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          {promptChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSend(chip)}
              className="flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full bg-white hover:bg-pink-50 text-stone-700 hover:text-pink-700 border border-pink-200 shadow-2xs transition-all cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Text Input & Send Button */}
        <div className="p-3 sm:p-4 bg-white border-t border-pink-100 flex items-center gap-2 flex-shrink-0">
          <input
            id="companion-chat-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              userName
                ? `Talk to Hana, ${userName}... (Press Enter)`
                : 'Talk to Hana... (Press Enter)'
            }
            className="flex-1 px-4 py-3 rounded-2xl bg-stone-50 border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-stone-800 text-sm placeholder:text-stone-400"
          />

          <button
            id="companion-send-btn"
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 active:scale-95 disabled:opacity-40 text-white shadow-md shadow-pink-300 transition-all cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
