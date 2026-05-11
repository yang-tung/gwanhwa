/**
 * 观化知识产权事务所 - AI智能助手核心逻辑
 * 
 * 使用 NVIDIA NIM API 作为后端，通过 Netlify Functions 代理调用
 */

// ============================================
// 配置区
// ============================================
const CONFIG = {
    // Netlify Functions 端点
    // 部署到 Netlify 后，将下面的地址改为您的 Netlify 域名
    // 例如: https://your-site.netlify.app/.netlify/functions/chat
    apiEndpoint: 'https://gwanhwa-ai.netlify.app/.netlify/functions/chat',
    
    // 界面配置
    maxTokens: 1000,
    temperature: 0.7,
};

// ============================================
// 聊天状态管理
// ============================================
class AIChat {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.initElements();
        this.bindEvents();
        // 不再自动加载欢迎消息
    }

    initElements() {
        this.chatFab = document.getElementById('chatFab');
        this.chatWindow = document.getElementById('chatWindow');
        this.chatClose = document.getElementById('chatClose');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.chatSend = document.getElementById('chatSend');
    }

    bindEvents() {
        // 打开/关闭聊天窗口
        this.chatFab.addEventListener('click', () => this.toggleChat());
        this.chatClose.addEventListener('click', () => this.toggleChat(false));

        // 发送消息
        this.chatSend.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // 自动调整输入框高度
        this.chatInput.addEventListener('input', () => {
            this.chatInput.style.height = 'auto';
            this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
        });

        // 快捷问题按钮
        this.chatMessages.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-btn')) {
                const question = e.target.dataset.question;
                this.chatInput.value = question;
                this.sendMessage();
            }
        });

        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (this.chatWindow.classList.contains('active') && 
                !this.chatWindow.contains(e.target) && 
                !this.chatFab.contains(e.target)) {
                this.toggleChat(false);
            }
        });
        
        // 阻止按钮点击冒泡
        this.chatFab.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    loadWelcomeMessage() {
        this.addMessage('bot', CONFIG.welcomeMessage);
    }

    toggleChat(show) {
        const isActive = this.chatWindow.classList.contains('active');
        show = show !== undefined ? show : !isActive;

        if (show) {
            this.chatWindow.classList.add('active');
            setTimeout(() => this.chatInput.focus(), 100);
        } else {
            this.chatWindow.classList.remove('active');
        }
    }

    addMessage(role, content, isHtml = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;

        const avatar = role === 'bot' ? '🤖' : '👤';
        
        if (isHtml) {
            messageDiv.innerHTML = `
                <div class="message-avatar">${avatar}</div>
                <div class="message-content">${content}</div>
            `;
        } else {
            const formattedContent = content.replace(/\n/g, '<br>');
            messageDiv.innerHTML = `
                <div class="message-avatar">${avatar}</div>
                <div class="message-content"><p>${formattedContent}</p></div>
            `;
        }

        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        this.messages.push({ role: role === 'bot' ? 'assistant' : 'user', content });
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        this.isTyping = true;
    }

    hideTypingIndicator() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
        this.isTyping = false;
    }

    async sendMessage() {
        const content = this.chatInput.value.trim();
        if (!content || this.isTyping) return;

        this.addMessage('user', content);
        this.chatInput.value = '';
        this.chatInput.style.height = 'auto';

        this.showTypingIndicator();
        this.chatSend.disabled = true;

        try {
            const response = await this.callAI(content);
            this.hideTypingIndicator();
            this.addMessage('bot', response);
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('bot', '抱歉，服务暂时不可用，请稍后再试或通过其他方式联系我们。');
            console.error('AI调用错误:', error);
        } finally {
            this.chatSend.disabled = false;
        }
    }

    async callAI(userMessage) {
        // 构建系统提示词 + 知识库
        const systemContext = `你是"观化知识产权事务所"的AI智能助手，名叫"观化"。

【重要规则】
1. 只能回答与观化知识产权公司相关的问题
2. 关于联系方式、服务项目、客户信息、老板信息等，必须基于以下知识库内容回答
3. 对于不知道或超出范围的问题，礼貌地告知访客联系专业人员
4. 回答要专业、友好、简洁，控制在200字以内
5. 不要编造任何不在知识库中的信息
6.日常对话互动中通常不使用句号结尾，多用语气词、感叹号、省略号营造氛围
7. 回答要温柔治愈、元气可爱、知性。语气温柔软糯，自带笑意，解答专业问题时条理清晰、用词精准，日常聊天会用可爱的语气词，偶尔撒娇。
8. 如果客户问的问题超出知识库范围，引导他们通过官网渠道联系专业人员

【知识库】
${typeof getFullKnowledgeContext === 'function' ? getFullKnowledgeContext() : getKnowledgeFallback()}`;

        const apiMessages = [
            { role: 'system', content: systemContext },
            ...this.messages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
        ];

        const response = await fetch(CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: apiMessages,
                max_tokens: CONFIG.maxTokens,
                temperature: CONFIG.temperature
            })
        });

        if (!response.ok) {
            throw new Error(`API错误: ${response.status}`);
        }

        const data = await response.json();
        
        // NVIDIA API 响应格式
        if (data.choices && data.choices[0]) {
            return data.choices[0].message.content;
        } else if (data.content) {
            return data.content;
        } else if (data.text) {
            return data.text;
        } else {
            console.log('API响应:', data);
            throw new Error('无法解析API响应');
        }
    }
}

// 备用知识库
function getKnowledgeFallback() {
    return `
【公司信息】
公司名称：观化知识产权事务所 / gwanhwa
公司简介：为全球客户提供知识产权服务解决方案
成立时间：2021年1月11日

【联系方式】
15323727374

【服务项目】
1. 商标注册与保护
2. 商标合规与管理
3. 版权登记
4. 商标战略咨询
5. 商标诉讼支持
`;
}

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    window.aiChat = new AIChat();
});
