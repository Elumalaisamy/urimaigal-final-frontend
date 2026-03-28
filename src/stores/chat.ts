// src/stores/chat.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChatMessage } from '@/types'

const LEGAL_RESPONSES: Record<string, { content: string; suggestions: string[] }> = {
  default: {
    content:
      'I understand you have a legal concern. Could you please describe your situation in more detail? I can help you understand your rights and connect you with the right advocate.',
    suggestions: [
      'Property dispute',
      'Employment issue',
      'Family matter',
      'Criminal case',
    ],
  },
  property: {
    content:
      'Property disputes in India are primarily governed by the Transfer of Property Act, 1882 and the Specific Relief Act. Key things to note:\n\n• Get all documents verified — sale deed, encumbrance certificate, patta\n• File a case in Civil Court for disputes under ₹3 lakhs, District Court above\n• Seek an injunction to prevent any transfer during dispute\n• Consider mediation under the Legal Services Authority\n\nWould you like me to recommend a Civil or Property law specialist?',
    suggestions: ['Find a property lawyer', 'What documents do I need?', 'How long does it take?'],
  },
  criminal: {
    content:
      'In a criminal matter, your immediate rights include:\n\n• Right to know the grounds of arrest (Article 22)\n• Right to be produced before a magistrate within 24 hours\n• Right to bail (for bailable offences)\n• Right to legal representation (free under Legal Aid if unable to afford)\n\nAct quickly — the first 24 hours are critical. Would you like to connect with a criminal defense advocate?',
    suggestions: ['Connect with criminal lawyer', 'FIR registration help', 'Bail procedure'],
  },
  family: {
    content:
      'Family law matters in India include divorce, custody, maintenance, and domestic violence. Key points:\n\n• Mutual consent divorce takes 6–18 months\n• Contested divorce can take longer but interim relief is available\n• Protection orders under Domestic Violence Act can be obtained quickly\n• Child custody is decided based on the best interest of the child\n\nWould you like to speak to a family law specialist?',
    suggestions: ['Find family lawyer', 'Child custody rights', 'Maintenance procedure'],
  },
  employment: {
    content:
      'For employment disputes in India:\n\n• Wrongful termination: File complaint with Labour Commissioner\n• Non-payment of dues: Approach Labour Court under Industrial Disputes Act\n• Sexual harassment: POSH Act applies to companies with 10+ employees\n• PF/ESI disputes: Approach EPFO directly or file a claim\n\nWould you like to connect with a Labour Law specialist?',
    suggestions: ['Find labour lawyer', 'Termination rights', 'POSH Act complaint'],
  },
  traffic: {
    content:
      'Traffic violation fines under the Motor Vehicles (Amendment) Act 2019:\n\n• Driving without licence: ₹5,000\n• Driving without insurance: ₹2,000\n• Driving without helmet: ₹1,000 + DL suspension 3 months\n• Without seatbelt: ₹1,000\n• Drunk driving: ₹10,000 and/or 6 months imprisonment\n• Speeding: ₹1,000–₹2,000\n\nIf you received a challan, you can contest it before the Magistrate within 60 days.',
    suggestions: ['Contest a traffic challan', 'Find traffic/criminal lawyer'],
  },
}

function generateBotResponse(userMessage: string): { content: string; suggestions: string[] } {
  const msg = userMessage.toLowerCase()
  if (msg.includes('property') || msg.includes('land') || msg.includes('house') || msg.includes('rent'))
    return LEGAL_RESPONSES.property
  if (msg.includes('criminal') || msg.includes('arrest') || msg.includes('fir') || msg.includes('police') || msg.includes('bail'))
    return LEGAL_RESPONSES.criminal
  if (msg.includes('family') || msg.includes('divorce') || msg.includes('custody') || msg.includes('maintenance'))
    return LEGAL_RESPONSES.family
  if (msg.includes('job') || msg.includes('employ') || msg.includes('work') || msg.includes('termination') || msg.includes('salary'))
    return LEGAL_RESPONSES.employment
  if (msg.includes('traffic') || msg.includes('fine') || msg.includes('challan') || msg.includes('driving') || msg.includes('vehicle'))
    return LEGAL_RESPONSES.traffic
  return LEGAL_RESPONSES.default
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      content:
        'வணக்கம்! Welcome to Urimaigal. I\'m your AI legal assistant. Describe your legal issue and I\'ll guide you to the right solution and the right advocate. 🏛️',
      timestamp: new Date(),
      suggestions: [
        'Property dispute',
        'Criminal case',
        'Family matter',
        'Employment issue',
        'Traffic fine',
      ],
    },
  ])

  const isTyping = ref(false)
  const isOpen = ref(false)

  const messageCount = computed(() => messages.value.length)

  async function sendMessage(content: string) {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }
    messages.value.push(userMsg)
    isTyping.value = true

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 700))

    const response = generateBotResponse(content)
    const botMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'bot',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions,
    }
    messages.value.push(botMsg)
    isTyping.value = false
  }

  function toggleChat() {
    isOpen.value = !isOpen.value
  }

  function clearChat() {
    messages.value = [
      {
        id: 'welcome',
        role: 'bot',
        content: 'வணக்கம்! Welcome to Urimaigal. How can I help you today?',
        timestamp: new Date(),
        suggestions: ['Property dispute', 'Criminal case', 'Family matter', 'Employment issue'],
      },
    ]
  }

  return { messages, isTyping, isOpen, messageCount, sendMessage, toggleChat, clearChat }
})
