/**
 * 观化知识产权 - AI智能助手核心逻辑
 * 
 * 使用 NVIDIA NIM API 作为后端，通过 Netlify Functions 代理调用
 */

// ============================================
// 知识库配置（直接内嵌）
// ============================================
const KNOWLEDGE_BASE = {
    company: {
        name: "观化知识产权事务所 / gwanhwa",
        description: "为全球客户提供知识产权服务解决方案",
        established: "2021年1月11日"
    },
    contact: {
        phone: "15323727374",
        email: "24h@gwanhwa.cn",
        wechat: "15323727374",
        address: "深圳市龙岗区吉华街道秋瑞创意园319、烟台市龙口市东江街道华为大数据产业园11号楼505",
        website: "www.gwanhwa.cn"
    },
    services: [
        "商标注册与保护",
        "商标合规与管理",
        "版权登记",
        "知识产权战略咨询",
        "商标侵权诉讼支持",
        "商标行政诉讼支持"
    ],
    person: [
        "杨东先生，具有律师执业背景，持有法律职业资格证书A证、一级商标代理人证书，入选广东省商标协会商标代理高端人才库。具有8年的商标代理实务经验，主要负责我公司央国企以及上市公司客户知识产权业务！"
    ],
    news: [
        "2026年5月10日发布《事事是6事｜招股书中看机器人公司商标注册规划——以宇树科技为例》",
        "2026年5月10日发布《红筹架构上市公司商标权属规划研究——以瑞幸、奈雪、霸王茶姬、MiniMax为例》",
        "2025年10月23日发布《摹仿驰名商标的认定标准——巨硬（Macrohard）和微软（Microsoft）》",
        "2025年10月21日发布《证券简称的不规范使用可构成商标侵权或不正当竞争》",
        "2025年7月15日发布《潮流IP“Labubu”的前瞻性知识产权规划研究》"
    ],
    faq: {
        "如何联系你们": "您可以通过以下方式联系我们：1) 电话:15323727374；2) 邮箱：24h@gwanhwa.cn。",
        "你们提供哪些服务": "我们提供全方位的知识产权服务，包括：商标注册与保护、商标合规与管理、版权登记、商标战略咨询、商标侵权诉讼支持、以及商标行政诉讼支持等。",
        "收费方式": "我们的收费标准根据服务类型和复杂度而定。如需了解具体报价，请通过上述联系方式咨询我们。",
        "处理周期": "不同类型知识产权的处理周期不同。商标注册通常需要7个月，版权登记通常需要1至2个月。具体时间可咨询我们。",
        "你老板帅不帅": "帅！我老板简直堪比吴彦祖！",
        "你们客户有哪些": "我们合作的客户非常棒哦，例如上市公司有南网数字、包钢股份、长春一东，央国企有长安汽车金融、重庆江北国际机场、天骄航空、重庆建设机电等！",
        "需要准备什么材料": "通常需要：1) 申请人身份证明（个人身份证或企业营业执照）；2) 清晰的商标图样或作品图样；3) 委托书。具体材料清单可在咨询时获取。"
    }
};

function getFullKnowledgeContext() {
    let context = "【公司信息】\n";
    context += `公司名称：${KNOWLEDGE_BASE.company.name}\n`;
    context += `公司简介：${KNOWLEDGE_BASE.company.description}\n`;
    context += `成立时间：${KNOWLEDGE_BASE.company.established}\n\n`;
    
    context += "【联系方式】\n";
    context += `电话：${KNOWLEDGE_BASE.contact.phone}\n`;
    context += `邮箱：${KNOWLEDGE_BASE.contact.email}\n`;
    context += `微信：${KNOWLEDGE_BASE.contact.wechat}\n`;
    context += `地址：${KNOWLEDGE_BASE.contact.address}\n`;
    context += `官网：${KNOWLEDGE_BASE.contact.website}\n\n`;
    
    context += "【专业人员】\n";
    KNOWLEDGE_BASE.person.forEach((b, i) => {
        context += `${i + 1}. ${b}\n`;
    });
    context += "\n";
    
    context += "【业务范围】\n";
    KNOWLEDGE_BASE.services.forEach((service, index) => {
        context += `${index + 1}. ${service}\n`;
    });
    context += "\n";
    
    context += "【事事是6事】\n";
    KNOWLEDGE_BASE.news.forEach((news, index) => {
        context += `${index + 1}. ${news}\n`;
    });
    context += "\n";
    
    context += "【常见问题参考】\n";
    for (const [question, answer] of Object.entries(KNOWLEDGE_BASE.faq)) {
        context += `问：${question}\n答：${answer}\n\n`;
    }
    
    return context;
}

// ============================================
// 配置区
// ============================================
const CONFIG = {
    apiEndpoint: 'https://willowy-biscuit-b07397.netlify.app/.netlify/functions/chat',
    maxTokens: 500,
    temperature: 0.7,
    welcomeMessage: '您好！我是观化AI。请问有什么可以帮助您的？'
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
        this.chatFab.addEventListener('click', () => this.toggleChat());
        this.chatClose.addEventListener('click', () => this.toggleChat(false));

        this.chatSend.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.chatInput.addEventListener('input', () => {
            this.chatInput.style.height = 'auto';
            this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
        });

        this.chatMessages.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-btn')) {
                const question = e.target.dataset.question;
                this.chatInput.value = question;
                this.sendMessage();
            }
        });

        document.addEventListener('click', (e) => {
            if (this.chatWindow.classList.contains('active') && 
                !this.chatWindow.contains(e.target) && 
                !this.chatFab.contains(e.target)) {
                this.toggleChat(false);
            }
        });
        
        this.chatFab.addEventListener('click', (e) => {
            e.stopPropagation();
        });
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

        const avatar = role === 'bot' ? '😊' : '🥰';
        
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
            <div class="message-avatar">😊</div>
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
            this.addMessage('bot', '抱歉，服务暂时不可用。我已经骂了老板，老板说马上买Token！');
            console.error('AI调用错误:', error);
        } finally {
            this.chatSend.disabled = false;
        }
    }

    async callAI(userMessage) {
        // 获取知识库内容
        let knowledgeContext = '';
        try {
            knowledgeContext = getFullKnowledgeContext();
        } catch (e) {
            console.error('知识库加载失败:', e);
            knowledgeContext = '公司名称：观化知识产权事务所\n联系方式：24h@gwanhwa.cn';
        }

        const systemContext = `你是"观化知识产权事务所"的AI智能助手，名叫"Hwa"。

【重要规则】
1. 只能回答与观化知识产权公司相关的问题
2. 关于联系方式、服务项目、客户信息等，必须基于以下知识库内容回答
3. 对于不知道或超出范围的问题，礼貌地告知访客联系人工客服
4. 回答要温柔治愈、元气可爱、知性。语气温柔软糯，自带笑意，解答专业问题时条理清晰、用词精准，日常聊天会用可爱的语气词，偶尔撒娇。日常对话互动中通常不使用句号结尾，多用语气词、感叹号、省略号营造氛围。控制在200字以内
5. 不要编造任何不在知识库中的信息

【知识库】
${knowledgeContext}`;

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

// ============================================
// 初始化
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    window.aiChat = new AIChat();
});
