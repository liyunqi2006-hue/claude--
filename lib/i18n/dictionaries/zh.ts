// 中文词典 —— 唯一事实来源 (source of truth)。
// en.ts 通过 `: Dictionary` 类型标注对齐，缺失任何键都会在编译期报错。
// 注意：不使用 `as const`，否则字符串会被推断为字面量类型，导致 en.ts 必须填入完全相同的中文。
// 这里需要的是结构约束（键必须齐全、类型必须匹配），字符串值可自由翻译。
export const zh = {
  common: {
    buyNow: "立即购买",
    submitting: "提交中...",
    orderFailed: "下单失败",
    networkError: "网络错误，请稍后重试",
    or: "或",
  },
  nav: {
    brand: "Claude 代付",
    lookup: "查询订单",
    backHome: "返回主页",
    subscription: "Claude 订阅",
    apiPlatform: "API 平台",
    switchLanguage: "切换语言",
    switchTheme: "切换主题",
    dashboard: "我的仪表盘",
    language: "中文",
  },
  hero: {
    title: "Claude 订阅",
    tagline: "官方代付 · 一键激活",
    desc: "填写邮箱并付款，由我们为您完成官网扣费。官方将直接发送包含激活链接的邮件至您的邮箱，点击即可一键开通使用。",
    currentPlan: "当前套餐",
  },
  apiHero: {
    title: "Claude API 平台",
    tagline: "按量付费 · 稳定中转",
    desc: "购买 API 额度，通过我们的中转平台直接调用 Claude 模型 —— 使用你自己的 API Key、自定义用量限制，按实际使用量付费。",
    bullet1: "$50 起充，秒级到账",
    bullet2: "全系列模型覆盖",
    bullet3: "接口格式与官方一致",
  },
  subscription: {
    receiveEmail: "接收邮箱",
    emailPlaceholder: "填写接收订阅链接的邮箱",
    emailNote:
      "支付成功后，我们将为您代付官方订单，该邮箱将直接收到来自 Anthropic 官方直发的订阅激活链接。",
    confirmEmail: "我已仔细核对接收邮箱，并知悉此邮箱提交后不可更改，已谨慎填写。",
    agreeTerms:
      "我已知悉本站仅提供软件订阅的纯代付服务，并非储值卡售卖。我同意服务条款与退款政策，并明确知悉：官方激活链接一经发送即严格不支持退款，且本平台不对任何第三方账号封禁风险负责。",
    payMethod: "支付方式",
    breakdown: "= {official} (官方订阅费) + {service} (服务费)",
    planUnavailable: "该套餐暂未上架，请联系客服",
  },
  howItWorks: {
    title: "工作原理",
    subtitle: "三步完成，订阅由 Anthropic 官方直接开通并发送",
    step: "STEP",
    steps: {
      submit: {
        title: "提交需求",
        desc: "选择需要的 Claude 套餐与时长，并填写接收订阅链接的邮箱。",
      },
      pay: {
        title: "安全代付",
        desc: "我们收取服务费后，使用美国主流银行签发的真实信用卡，在 Anthropic 官网为您代付订阅。",
      },
      deliver: {
        title: "官方直发",
        desc: "您将在邮箱中直接收到由 Anthropic 官方发送的订阅激活链接，点击即可绑定至您的账号。",
      },
    },
  },
  serviceNotes: {
    title: "服务须知",
    notes: {
      validity: {
        title: "365 天有效期",
        desc: "订阅激活链接自代付完成之日起 365 天内有效，请提醒接收人及时激活。",
      },
      activation: {
        title: "激活方式",
        desc: "Anthropic 官方会发送一封含订阅激活链接的邮件，点击链接即可订阅绑定至账号。",
      },
      delivery: {
        title: "快速交付",
        desc: "付款成功后，我们会立即为您代付官方订单，激活链接通常会在 1 小时内发送至您的邮箱。",
      },
      mobile: {
        title: "移动端订阅",
        desc: "如当前已通过 Apple / Google 订阅，请勿下单，需等订阅到期后再激活。",
      },
      ban: {
        title: "封号售后",
        desc: "本服务为纯代付性质，订阅一经官方开通，如账号被封禁亦不支持退款。",
      },
      trust: {
        title: "可信来源",
        desc: "每笔订单都使用真实的美国银行信用卡在 Anthropic 官网代付，且订阅激活链接由 Anthropic 官方直接发送至你的邮箱。",
      },
    },
  },
  faq: {
    title: "常见问题",
    subtitle: "购买前你需要了解的一切。",
    items: [
      {
        q: "这是一项什么服务？",
        a: "本站提供 Claude（Anthropic）订阅与 API 额度的代付服务。您选择套餐并支付后，我们使用真实的官方支付渠道为您下单，官方会将激活链接直接发送到您填写的邮箱。",
      },
      {
        q: "为什么选择本平台？",
        a: "支持 USDT (TRC20) 加密货币支付，无需信用卡或外币账户即可完成代付，价格透明，官方费用与服务费分开展示，付款后最快 1 小时内完成开通。",
      },
      {
        q: "我凭什么信任你们？",
        a: "每笔代付都直接在 Anthropic 官网完成下单，激活链接由官方系统直接发出，不经过第三方转发。订单状态可随时在「查询订单」页面核实，支付前也可先咨询客服了解流程。",
      },
      {
        q: "如何付款？",
        a: "在套餐选择区选好方案后，点击「立即购买」即可跳转至 USDT (TRC20) 付款页面，向指定钱包地址转账对应金额，付款成功后系统会自动处理后续代付流程。",
      },
      {
        q: "如何查询订单状态？",
        a: "点击顶部导航「查询订单」，本设备下单的记录会自动展示；也可以用下单时填写的邮箱获取验证码后查询全部历史订单。",
      },
      {
        q: "可以退款吗？",
        a: "订单在官方激活链接发送前可申请取消退款；激活链接一经发送即视为服务完成交付，不再支持退款。详情请查看退款政策。",
      },
      {
        q: "Claude Pro 国内怎么充值？没有外币信用卡可以吗？",
        a: "可以。国内用户开通 Claude Pro 最大的障碍是没有支持境外扣费的信用卡，本站正是为此而生：你只需用 USDT (TRC20) 付款，我们用官方渠道为你完成订阅代付，全程无需你自己的 Visa / Mastercard 或海外支付账户。",
      },
      {
        q: "Claude 订阅怎么付款？支持哪些方式？",
        a: "本站目前统一采用 USDT (TRC20) 加密货币付款。选好套餐后点「立即购买」，页面会显示收款钱包地址与二维码，用任意支持 TRC20 的钱包或交易所转账对应金额即可，到账后我们即开始代付。",
      },
      {
        q: "Claude Pro 和 Max（Max5x / Max20x）有什么区别？",
        a: "Pro 是基础订阅，适合日常使用；Max5x、Max20x 分别提供约 5 倍、20 倍于 Pro 的用量额度，适合重度使用者与开发者。三种套餐都可在本站直接代付开通，价格在套餐选择区透明展示。",
      },
      {
        q: "代付开通后多久到账？激活链接发到哪里？",
        a: "付款并完成人工核对后，最快 1 小时内完成官网下单，Anthropic 官方会把包含激活链接的邮件直接发送到你下单时填写的邮箱，点击链接即可开通使用。",
      },
      {
        q: "用的是我自己的账号吗？会不会有封号风险？",
        a: "代付在你指定邮箱对应的官方账号上完成，订阅归属于你本人。我们通过官方正规渠道下单，不使用违规手段，最大程度降低账号风险。",
      },
    ],
  },
  apiHowItWorks: {
    title: "如何使用",
    subtitle: "三步接入，无需申请，充值即用。",
    step: "STEP",
    steps: {
      recharge: {
        title: "充值额度",
        desc: "选择档位并完成支付，额度立即到账，永久有效，用多少扣多少。",
      },
      getKey: {
        title: "获取 Key",
        desc: "充值成功后，我们会通过邮件为您发送专属 API Key，可自行设置用量上限。",
      },
      call: {
        title: "开始调用",
        desc: "使用与 Anthropic 官方一致的接口格式，替换 Base URL 与 Key 即可直接调用。",
      },
    },
  },
  apiFeatures: {
    title: "平台特性",
    features: {
      models: {
        title: "全模型覆盖",
        desc: "支持 Claude Opus / Sonnet / Haiku 全系列模型，与官方同步更新。",
      },
      compatible: {
        title: "接口格式兼容",
        desc: "接口与 Anthropic 官方 API 格式一致，现有代码无需改动，替换 Key 即可切换。",
      },
      transparent: {
        title: "用量透明",
        desc: "每次调用的 Token 消耗与扣费明细均可查询，不含隐藏费用。",
      },
      noMinimum: {
        title: "无最低消费",
        desc: "按实际用量扣除额度，未使用部分不过期，无需担心浪费。",
      },
      stable: {
        title: "稳定可用",
        desc: "多节点中转，故障自动切换，保障调用请求的稳定与低延迟。",
      },
      support: {
        title: "中文技术支持",
        desc: "接入过程中遇到问题，可随时联系客服获得中文技术支持。",
      },
    },
  },
  apiTiers: {
    title: "选择充值档位",
    subtitle: "按额度充值，一次到账，用多少扣多少。",
    credit: "额度",
    serviceFee: "+{percent}% 服务费",
    buyNow: "立即购买",
  },
  apiPromo: {
    title: "更喜欢按量付费的 API 接入？",
    desc: "购买 API 额度，通过我们的中转平台直接调用 Claude 模型 —— 使用你自己的 API Key、自定义用量限制，按实际使用量付费。",
    cta: "了解 API 平台",
  },
  apiFaq: {
    title: "常见问题",
    subtitle: "接入前你需要了解的一切。",
    items: [
      {
        q: "这个 API 平台是什么？",
        a: "本平台是 Claude 官方 API 的中转服务，充值额度后按实际用量扣费，接口格式与官方一致，无需自行申请海外支付方式。",
      },
      {
        q: "和官方 API 有什么关系？",
        a: "调用最终仍经由官方模型处理，我们只是提供计费与转发层，保证接口稳定可用，不会篡改或记录您的请求内容。",
      },
      {
        q: "充值的额度会过期吗？",
        a: "不会。充值到账后额度永久有效，按实际 Token 用量扣除，用不完可以留到以后使用。",
      },
      {
        q: "如何获取 API Key？",
        a: "充值成功后，我们会将专属 API Key 发送到您下单时填写的邮箱，凭 Key 即可直接调用。",
      },
      {
        q: "支持哪些模型？",
        a: "支持 Claude Opus、Sonnet、Haiku 全系列模型，随官方更新同步上线最新版本。",
      },
      {
        q: "有稳定性保障吗？",
        a: "平台采用多节点中转，遇到单节点异常会自动切换，尽量保证调用请求的可用性与响应速度。",
      },
    ],
  },
  footer: {
    disclaimer:
      "本站提供代付服务，不直接销售 Anthropic 官方产品，最终服务以官方条款为准。下单前请仔细核对账号信息。",
    terms: "服务条款",
    refund: "退款政策",
    brand: "Claude 代付",
  },
  dashboard: {
    completedOrders: "已完成订单数",
    totalCredit: "累计充值额度",
    tabs: {
      all: "所有订单",
      subscription: "订阅",
      apiCredit: "API 额度",
    },
    empty: "暂无订单",
    browseSubscription: "浏览订阅套餐",
    browseApi: "浏览 API 平台",
    creditSuffix: "额度",
    apiKey: "API Key",
    activationLink: "激活链接",
    copied: "已复制",
    copy: "复制",
  },
  orderDetail: {
    back: "← 返回仪表盘",
    orderNo: "订单号",
    status: "状态",
    amount: "金额",
    payMethod: "支付方式",
    createdAt: "下单时间",
    paidAt: "支付时间",
    apiKey: "API Key",
    activationLink: "激活链接",
    processing: "订单处理中，完成后将通过邮件通知您，也可以刷新此页面查看。",
  },
  checkout: {
    subscriptionTitle: "Claude {plan} · {duration}",
    apiTitle: "API 余额充值 · 额度 ${credit}",
    unitPrice: "单价 ${price}",
    quantity: "数量",
    contactEmail: "联系邮箱（用于接收发货通知）",
    subscriptionNote: "Claude 账号邮箱 / 备注（用于开通订阅）",
    optionalNote: "备注（可选）",
    subscriptionPlaceholder: "请填写需要开通订阅的 Claude 账号邮箱",
    payMethod: "支付方式",
    total: "合计 ${usd}",
    pay: "去支付",
  },
  payment: {
    title: "支付订单",
    orderNo: "订单号",
    amount: "支付金额",
    paymentMethod: "支付方式",
    usdtAddress: "USDT (TRC20) 收款地址",
    usdtAmount: "应付 USDT 金额",
    scanQrCode: "扫码支付",
    copyAddress: "复制地址",
    copied: "已复制",
    paymentInstructions: "支付说明",
    instruction1: "1. 请使用支持 TRC20 网络的钱包转账",
    instruction2: "2. 请务必确认网络为 TRC20，转错网络将无法找回",
    instruction3: "3. 转账时请备注订单号：{orderNo}",
    instruction4: "4. 支付完成后，请点击下方按钮并上传付款截图",
    uploadProof: "上传付款截图",
    confirmPayment: "我已完成支付",
    waitingConfirm: "等待确认...",
    paymentNote: "支付后通常 5-30 分钟内确认到账，请耐心等待。如有疑问请联系客服。",
    backToOrder: "返回订单详情",
  },
  lookup: {
    title: "查询订单",
    subtitle: "轻松查询您的 Claude 订阅代付订单状态。",
    recentTitle: "本设备的近期订单",
    byEmailTitle: "通过邮箱查询",
    byEmailNote: "为保护您的隐私，我们需要验证您的身份。请输入您下单时使用的收货邮箱。",
    emailPlaceholder: "邮箱地址",
    codePlaceholder: "验证码",
    getCode: "获取验证码",
    query: "查询订单",
    querying: "查询中...",
    resume: "继续支付",
    orderPlaced: "下单",
    paid: "支付",
    notFound: "未查询到相关订单",
    codeSendFailed: "验证码发送失败",
    queryFailed: "查询失败",
  },
  pay: {
    orderCreated: "订单 {orderNo} 已创建",
    redirectHint: "请点击下方按钮跳转至支付页面完成付款",
    goToPay: "前往支付",
    noUrl: "未获取到支付链接，请返回重新下单",
    resultTitle: "支付结果",
    orderNoLabel: "订单号：",
    currentStatus: "当前状态：",
    resultNotFound: "未找到订单信息，支付状态请以实际扣款为准",
    viewOrders: "查看我的订单",
  },
  enums: {
    plan: {
      pro: "Pro",
      max5x: "Max 5x",
      max20x: "Max 20x",
    },
    planDescription: {
      pro: "适合日常用户",
      max5x: "适合重度用户",
      max20x: "适合专业用户",
    },
    duration: {
      month: "月付",
      quarter: "季付",
      half_year: "半年付",
      year: "年付",
    },
    payChannel: {
      usdt: "USDT (TRC20)",
    },
    orderStatus: {
      pending: "待支付",
      paid: "已支付待处理",
      fulfilling: "处理中",
      completed: "已完成",
      refunded: "已退款",
      cancelled: "已取消",
    },
  },
};

export type Dictionary = typeof zh;
