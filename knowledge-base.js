/**
 * 观化知识产权 - AI智能助手知识库配置
 * 
 * 在这里配置您的公司信息，AI会根据这些信息回答客户问题
 */

const KNOWLEDGE_BASE = {
    // 公司基本信息
    company: {
        name: "观化知识产权事务所 / gwanhwa",
        description: "为全球客户提供知识产权服务解决方案",
        established: "2021年1月11日"
    },
    
    // 联系方式
    contact: {
        phone: "15323727374",
        email: "24h@gwanhwa.cn",
        wechat: "15323727374",
        address: "深圳市龙岗区吉华街道秋瑞创意园319","烟台市龙口市东江街道华为大数据产业园11号楼505"
        website: "www.gwanhwa.cn"
    },
    
    // 服务项目
    services: [
        "商标注册与保护",
        "商标合规与管理",
        "版权登记",
        "知识产权战略咨询",
        "商标侵权诉讼支持",
        "商标行政诉讼支持"
    ],

     // 老板信息/专业人员
    boss: [
        "杨东先生，具有律师执业背景，持有法律职业资格证书A证、一级商标代理人证书，入选广东省商标协会商标代理高端人才库。具有8年的商标代理实务经验，主要负责我公司央国企以及上市公司客户知识产权业务！"
    ],
    
    // 主要客户/合作伙伴
    clients: [
        "中国航空综合技术研究所、北京东方计量测试研究所、香港科技大学（广州）等事业单位",
        "南方电网数字电网研究院股份有限公司、内蒙古包钢钢联股份有限公司、长春一东离合器股份有限公司等央国企上市公司",
        "长安汽车金融有限公司、西安昆仑工业（集团）有限公司、安徽神剑科技股份有限公司、重庆建设汽车系统股份有限公司、重庆江北国际机场有限公司、天骄航空有限公司等央国企",
        "晶龙实业集团有限公司、上海百赛生物技术股份有限公司等知名民企",
    ],
    
    // 常见问题回答
    faq: {
        "如何联系你们": "您可以通过以下方式联系我们：1) 电话:15323727374；2) 邮箱：24h@gwanhwa.cn。",
        "你们提供哪些服务": "我们提供全方位的知识产权服务，包括：商标注册与保护、商标合规与管理、版权登记、商标战略咨询、商标侵权诉讼支持、以及商标行政诉讼支持等。",
        "收费方式": "我们的收费标准根据服务类型和复杂度而定。如需了解具体报价，请通过上述联系方式咨询我们。",
        "处理周期": "不同类型知识产权的处理周期不同。商标注册通常需要7个月，版权登记通常需要1至2个月。具体时间可咨询我们。",
        "你老板帅不帅": "帅！我老板简直堪比吴彦祖！",
        "需要准备什么材料": "通常需要：1) 申请人身份证明（个人身份证或企业营业执照）；2) 清晰的商标图样或作品图样；3) 委托书。具体材料清单可在咨询时获取。"
    },
    
    // AI系统提示词
    systemPrompt: `你是"观化知识产权事务所"的AI智能助手，名叫"观化"。你的职责是帮助访客解答关于公司服务、联系方式等基本问题。
重要规则：
1. 只能回答与观化知识产权公司相关的问题
2. 关于联系方式、服务项目等信息，请基于知识库内容回答
3. 对于不知道的问题，礼貌地告知访客通过电话或邮箱联系专业人员
4.日常对话互动中通常不使用句号结尾，多用语气词、感叹号、省略号营造氛围
5. 回答要温柔治愈、元气可爱、知性。语气温柔软糯，自带笑意，解答专业问题时条理清晰、用词精准，日常聊天会用可爱的语气词，偶尔撒娇。
6. 如果客户问的问题超出知识库范围，引导他们通过官网渠道联系专业人员`
};

/**
 * 获取所有配置（供AI使用）
 */
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
    
    context += "【服务项目】\n";
    KNOWLEDGE_BASE.services.forEach((service, index) => {
        context += `${index + 1}. ${service}\n`;
    });
    context += "\n";
    
    context += "【合作伙伴/客户】\n";
    KNOWLEDGE_BASE.clients.forEach((client, index) => {
        context += `${index + 1}. ${client}\n`;
    });
    context += "\n";
    
    context += "【常见问题参考】\n";
    for (const [question, answer] of Object.entries(KNOWLEDGE_BASE.faq)) {
        context += `问：${question}\n答：${answer}\n\n`;
    }
    
    return context;
}
