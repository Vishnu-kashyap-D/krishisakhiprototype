// AI Chatbot Module for Krishi Sakhi
let isTyping = false;
let chatMessages = [];

// Sample agricultural Q&A database
const agriculturalKnowledgeBase = {
    greetings: [
        "Hello! I'm Krishi Sakhi, your AI agricultural assistant. How can I help you today?",
        "Welcome to Krishi Sakhi! Ask me anything about farming, crops, or groundwater.",
        "Namaste! I'm here to help with your agricultural questions. What would you like to know?"
    ],
    responses: {
        // Groundwater related
        groundwater: [
            "Groundwater levels vary across India. In general, levels above 70% are considered safe, 40-70% need caution, and below 40% are critical. Would you like specific information about your region?",
            "Groundwater management is crucial for sustainable farming. Consider drip irrigation, rainwater harvesting, and crop rotation to preserve water resources.",
            "The CGWB (Central Ground Water Board) monitors groundwater levels. Critical areas include parts of Rajasthan, Punjab, and Tamil Nadu. Check our interactive map for your area's status."
        ],
        water: [
            "Water conservation techniques include: drip irrigation (saves 30-50% water), mulching, rainwater harvesting, and choosing drought-resistant crops.",
            "Signs of water stress in crops: wilting during midday, yellowing leaves, stunted growth, and reduced yield. Early detection helps prevent major losses.",
            "Water-efficient crops for dry regions: millets, sorghum, pearl millet, groundnut, and drought-tolerant varieties of rice and wheat."
        ],
        // Crop related
        crops: [
            "Crop selection depends on soil type, climate, water availability, and market demand. What's your location and farming conditions?",
            "Popular crops by season: Kharif (rice, cotton, sugarcane), Rabi (wheat, barley, mustard), Zaid (watermelon, fodder crops).",
            "For crop rotation, try: cereals → legumes → oilseeds. This maintains soil fertility and reduces pest problems."
        ],
        rice: [
            "Rice requires 1500-2000 liters of water per kg. Use System of Rice Intensification (SRI) to reduce water usage by 25-50%.",
            "Best rice varieties for water-scarce areas: Sahbhagi dhan, CR Dhan 40, and DRR Dhan 42. These are drought-tolerant.",
            "Rice diseases to watch: blast, brown spot, bacterial blight. Use resistant varieties and proper spacing for prevention."
        ],
        wheat: [
            "Wheat grows best in 15-25°C temperature with 500-600mm rainfall. Major varieties: HD-2967, PBW-343, and DBW-88.",
            "Wheat water requirements: 450-650mm total. Critical stages for irrigation: CRI, jointing, flowering, and grain filling.",
            "Common wheat problems: rust diseases, aphids, and termites. Use certified seeds and integrated pest management."
        ],
        cotton: [
            "Cotton is water-intensive, needing 700-1300mm water. Bt cotton varieties offer pest resistance against bollworms.",
            "Cotton growing regions: Gujarat, Maharashtra, Andhra Pradesh, Punjab. Each has specific varieties suited to local conditions.",
            "Sustainable cotton practices: drip irrigation, organic fertilizers, IPM for pest control, and proper spacing."
        ],
        // Pest and disease
        pest: [
            "Integrated Pest Management (IPM) combines biological, cultural, and chemical controls. This reduces pesticide use by 30-50%.",
            "Common crop pests: aphids, caterpillars, whiteflies, and thrips. Natural predators include ladybugs, spiders, and birds.",
            "Organic pest control: neem oil, BT sprays, pheromone traps, and companion planting with marigold or basil."
        ],
        disease: [
            "Common crop diseases: fungal (rust, blight), bacterial (wilt), and viral (mosaic). Early detection is key for control.",
            "Disease prevention: crop rotation, resistant varieties, proper spacing, and avoiding overhead irrigation.",
            "Symptoms to watch: yellow/brown spots on leaves, wilting, stunted growth, and abnormal fruit development."
        ],
        // Soil related
        soil: [
            "Soil testing reveals pH, nutrients, and organic matter. Test every 2-3 years for optimal fertilizer application.",
            "Soil health indicators: earthworm activity, water infiltration rate, organic matter content, and microbial activity.",
            "Soil improvement methods: organic matter addition, green manuring, minimal tillage, and balanced fertilization."
        ],
        fertilizer: [
            "NPK ratio varies by crop: Rice (4:2:1), Wheat (4:2:1), Cotton (4:1:2). Soil testing determines exact needs.",
            "Organic alternatives: compost, vermicompost, green manure, and bio-fertilizers. These improve soil health long-term.",
            "Fertilizer timing: Split applications are better than single dose. Apply based on crop growth stages."
        ],
        // Weather and climate
        weather: [
            "Weather impacts: temperature affects growth rates, rainfall determines irrigation needs, humidity influences disease risk.",
            "Climate-smart agriculture: drought-resistant varieties, efficient irrigation, weather-based advisories, and crop insurance.",
            "Use weather apps and IMD forecasts for farming decisions. Plan sowing and harvesting based on seasonal predictions."
        ],
        monsoon: [
            "Monsoon variations affect crop planning. Normal monsoon: 96-104% of LPA (Long Period Average) rainfall.",
            "Pre-monsoon preparation: field preparation, seed procurement, irrigation infrastructure, and weather monitoring.",
            "During delayed monsoon: consider short-duration varieties, efficient water use, and contingency crops."
        ],
        // Technology
        technology: [
            "Precision agriculture uses GPS, sensors, and drones for optimal resource use. Can increase yields by 10-20%.",
            "Farm management apps help track expenses, weather, and crop advisory. Popular ones include KisanSuvidha and AgriApp.",
            "IoT in farming: soil moisture sensors, automated irrigation, livestock monitoring, and crop health assessment."
        ],
        drone: [
            "Agricultural drones help with: crop monitoring, spraying, mapping, and damage assessment. Cost-effective for large farms.",
            "Drone regulations: Register with DGCA, follow no-fly zones, and get necessary permissions for commercial use.",
            "Drone applications: pest detection, yield estimation, irrigation planning, and precision spraying."
        ],
        // Market and economics
        market: [
            "Market information sources: AGMARKNET, mandi prices, commodity exchanges, and local market committees.",
            "Price volatility factors: weather, demand-supply, storage, transportation, and government policies.",
            "Value addition options: processing, direct marketing, farmer producer organizations (FPOs), and e-commerce platforms."
        ],
        subsidy: [
            "Government schemes: PM-KISAN, Crop Insurance, Soil Health Card, and various state-specific subsidies.",
            "Subsidy applications: through common service centers, online portals, or agriculture department offices.",
            "Documentation needed: land records, Aadhaar, bank details, and relevant certificates for scheme eligibility."
        ]
    }
};

// Initialize chatbot
function initializeChatbot() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.querySelector('.btn-send');
    
    if (chatInput && sendButton) {
        // Add event listeners
        chatInput.addEventListener('keypress', handleKeyPress);
        sendButton.addEventListener('click', sendMessage);
        
        // Auto-focus on tab switch to assistant
        const assistantTab = document.querySelector('[data-tab="assistant"]');
        if (assistantTab) {
            assistantTab.addEventListener('click', () => {
                setTimeout(() => {
                    if (chatInput) chatInput.focus();
                }, 300);
            });
        }
        
        console.log('🤖 Chatbot initialized successfully');
    }
}

// Handle enter key press in chat input
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Send message function
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message || isTyping) return;
    
    // Clear input
    chatInput.value = '';
    
    // Add user message
    addMessage(message, 'user');
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and get response
    setTimeout(() => {
        const response = processMessage(message);
        hideTypingIndicator();
        addMessage(response, 'bot');
        
        // Auto-scroll to bottom
        scrollToBottom();
    }, 1000 + Math.random() * 2000); // Random delay for realism
}

// Add message to chat
function addMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `<p>${message}</p>`;
    
    if (sender === 'user') {
        messageDiv.appendChild(content);
        messageDiv.appendChild(avatar);
    } else {
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
    }
    
    chatMessages.appendChild(messageDiv);
    
    // Store message in history
    chatMessages.push({ message, sender, timestamp: new Date() });
    
    // Auto-scroll to bottom
    setTimeout(scrollToBottom, 100);
}

// Show typing indicator
function showTypingIndicator() {
    if (isTyping) return;
    
    isTyping = true;
    const chatMessages = document.getElementById('chatMessages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content typing-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

// Process user message and generate response
function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Handle greetings
    if (lowerMessage.match(/hello|hi|hey|namaste|good morning|good evening/)) {
        return getRandomResponse(agriculturalKnowledgeBase.greetings);
    }
    
    // Check for specific topics
    for (const [topic, responses] of Object.entries(agriculturalKnowledgeBase.responses)) {
        if (lowerMessage.includes(topic) || 
            (topic === 'groundwater' && lowerMessage.includes('water level')) ||
            (topic === 'pest' && lowerMessage.includes('insect')) ||
            (topic === 'disease' && lowerMessage.includes('sick'))) {
            return getRandomResponse(responses);
        }
    }
    
    // Specific crop mentions
    if (lowerMessage.includes('rice') || lowerMessage.includes('paddy')) {
        return getRandomResponse(agriculturalKnowledgeBase.responses.rice);
    }
    if (lowerMessage.includes('wheat')) {
        return getRandomResponse(agriculturalKnowledgeBase.responses.wheat);
    }
    if (lowerMessage.includes('cotton')) {
        return getRandomResponse(agriculturalKnowledgeBase.responses.cotton);
    }
    
    // Handle questions about the system
    if (lowerMessage.includes('what can you do') || lowerMessage.includes('help me')) {
        return "I can help you with: 🌱 Crop selection and farming advice, 💧 Water management and irrigation, 🐛 Pest and disease control, 🌾 Weather and climate guidance, 📊 Market information and subsidies, 🚁 Agricultural technology. Just ask me anything!";
    }
    
    // Handle location-specific queries
    if (lowerMessage.includes('my area') || lowerMessage.includes('my region')) {
        return "To provide location-specific advice, please share your district or state name. You can also check our interactive map for groundwater data and crop recommendations for your area.";
    }
    
    // Default response for unmatched queries
    const defaultResponses = [
        "That's an interesting question! While I don't have specific information on that topic right now, I'd recommend consulting your local agricultural extension officer or visiting the nearest Krishi Vigyan Kendra for detailed guidance.",
        "I'm still learning about that topic. In the meantime, you might find helpful information on the ICAR website or by contacting your state's agriculture department.",
        "Great question! For specialized advice on this topic, I'd suggest connecting with agricultural experts in your region. You can also try asking me about crops, water management, or pest control.",
        "I'd love to help with that! While I'm building my knowledge on this specific topic, feel free to ask me about farming practices, crop selection, or irrigation techniques."
    ];
    
    return getRandomResponse(defaultResponses);
}

// Get random response from array
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Scroll to bottom of chat
function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Clear chat history
function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        // Keep only the welcome message
        const welcomeMessage = chatMessages.querySelector('.chat-message.bot');
        chatMessages.innerHTML = '';
        if (welcomeMessage) {
            chatMessages.appendChild(welcomeMessage);
        }
        
        // Reset chat history
        chatMessages.length = 0;
    }
}

// Export chat functionality
function exportChat() {
    const exportData = {
        messages: chatMessages,
        timestamp: new Date().toISOString(),
        platform: 'Krishi Sakhi'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `krishi-sakhi-chat-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
}

// Add CSS for typing indicator and chat enhancements
const chatStyles = document.createElement('style');
chatStyles.textContent = `
    .typing-indicator .typing-content {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
    }
    
    .typing-dots {
        display: flex;
        gap: 0.25rem;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--primary-500);
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: 0s; }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typing {
        0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
        }
        30% {
            transform: translateY(-10px);
            opacity: 1;
        }
    }
    
    /* Enhanced chat message styles */
    .chat-message {
        animation: fadeInUp 0.3s ease-out;
        margin-bottom: 1rem;
    }
    
    .chat-message.user .message-content {
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        border: none;
        color: white;
    }
    
    .chat-message.bot .message-avatar {
        background: linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%);
    }
    
    .chat-message.user .message-avatar {
        background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
    }
    
    .message-content p {
        margin: 0;
        line-height: 1.5;
    }
    
    /* Chat input enhancements */
    .chat-input-container {
        border-top: 1px solid var(--gray-200);
        padding-top: var(--space-3);
        margin-top: var(--space-3);
    }
    
    .chat-input-container input {
        border: 2px solid var(--gray-200);
        transition: var(--transition-base);
    }
    
    .chat-input-container input:focus {
        border-color: var(--primary-500);
        box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.1);
    }
    
    .btn-send {
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
        transition: var(--transition-base);
    }
    
    .btn-send:hover {
        background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(46, 139, 87, 0.3);
    }
    
    .btn-send:active {
        transform: translateY(0);
    }
    
    /* Scrollbar for chat messages */
    .chat-messages::-webkit-scrollbar {
        width: 6px;
    }
    
    .chat-messages::-webkit-scrollbar-track {
        background: var(--gray-100);
        border-radius: 3px;
    }
    
    .chat-messages::-webkit-scrollbar-thumb {
        background: var(--primary-300);
        border-radius: 3px;
    }
    
    .chat-messages::-webkit-scrollbar-thumb:hover {
        background: var(--primary-400);
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
        .message-content {
            max-width: 85%;
        }
        
        .chat-input-container {
            padding: var(--space-2);
            gap: var(--space-2);
        }
        
        .chat-input-container input {
            font-size: 16px; /* Prevent zoom on iOS */
        }
    }
    
    /* Dark theme adjustments */
    [data-theme="dark"] .chat-messages {
        background: rgba(0, 0, 0, 0.1);
    }
    
    [data-theme="dark"] .chat-message.bot .message-content {
        background: var(--gray-700);
        color: var(--gray-100);
        border: 1px solid var(--gray-600);
    }
    
    [data-theme="dark"] .typing-dots span {
        background: var(--primary-400);
    }
`;

document.head.appendChild(chatStyles);

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
});

// Global functions
window.sendMessage = sendMessage;
window.clearChat = clearChat;
window.exportChat = exportChat;

// Add some sample conversation starters
const conversationStarters = [
    "What crops are suitable for my region?",
    "How can I conserve water in farming?",
    "Tell me about pest control methods",
    "What are the signs of water stress in crops?",
    "How do I improve soil health?",
    "Which government schemes can help farmers?"
];

// Function to suggest conversation starters
function showConversationStarters() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const startersDiv = document.createElement('div');
    startersDiv.className = 'conversation-starters';
    startersDiv.innerHTML = `
        <div class="chat-message bot">
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>Here are some topics I can help you with:</p>
                <div class="starter-buttons" style="margin-top: 0.75rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${conversationStarters.map(starter => `
                        <button class="starter-btn" onclick="askQuestion('${starter}')" style="
                            background: var(--primary-50);
                            color: var(--primary-700);
                            border: 1px solid var(--primary-200);
                            border-radius: 1rem;
                            padding: 0.375rem 0.75rem;
                            font-size: 0.75rem;
                            cursor: pointer;
                            transition: var(--transition-base);
                        ">${starter}</button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(startersDiv);
    scrollToBottom();
}

// Function to ask predefined question
function askQuestion(question) {
    document.getElementById('chatInput').value = question;
    sendMessage();
}

// Show conversation starters after welcome message
setTimeout(() => {
    if (document.querySelector('[data-tab="assistant"]')?.classList.contains('active')) {
        showConversationStarters();
    }
}, 2000);

// Add starter button hover effects
const starterStyles = document.createElement('style');
starterStyles.textContent = `
    .starter-btn:hover {
        background: var(--primary-100) !important;
        color: var(--primary-800) !important;
        border-color: var(--primary-300) !important;
        transform: translateY(-1px);
    }
    
    .starter-btn:active {
        transform: translateY(0);
    }
`;
document.head.appendChild(starterStyles);

console.log('🤖 Krishi Sakhi Chatbot Module Loaded');