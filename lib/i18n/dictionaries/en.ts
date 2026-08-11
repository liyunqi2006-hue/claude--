import type { Dictionary } from "./zh";

// 英文词典。类型标注为 `Dictionary`，若缺少任何键或结构不匹配，编译会立即失败。
// 这保证了新增功能时，只要在 zh.ts 添加了文案，en.ts 就必须同步补齐英文。
export const en: Dictionary = {
  common: {
    buyNow: "Buy Now",
    submitting: "Submitting...",
    orderFailed: "Failed to place order",
    networkError: "Network error, please try again later",
    or: "or",
  },
  nav: {
    brand: "Claude Pay",
    lookup: "Track Order",
    backHome: "Back to Home",
    subscription: "Claude Subscription",
    apiPlatform: "API Platform",
    switchLanguage: "Switch language",
    switchTheme: "Switch theme",
    dashboard: "My Dashboard",
    language: "EN",
  },
  hero: {
    title: "Claude Subscription",
    tagline: "Official Proxy Payment · One-Click Activation",
    desc: "Enter your email and pay — we handle the official checkout for you. Anthropic sends the activation link straight to your inbox; one click and you're ready to go.",
    currentPlan: "Current Plan",
  },
  apiHero: {
    title: "Claude API Platform",
    tagline: "Pay As You Go · Reliable Relay",
    desc: "Buy API credits and call Claude models directly through our relay platform — use your own API key, set custom usage limits, and pay only for what you use.",
    bullet1: "From $50, instant top-up",
    bullet2: "Full model lineup covered",
    bullet3: "API format matches official",
  },
  subscription: {
    receiveEmail: "Recipient Email",
    emailPlaceholder: "Enter the email to receive your subscription link",
    emailNote:
      "After payment, we place the official order on your behalf. This email will receive the subscription activation link sent directly by Anthropic.",
    confirmEmail:
      "I have carefully verified the recipient email and understand it cannot be changed after submission.",
    agreeTerms:
      "I understand this site provides a pure proxy-payment service for software subscriptions, not the sale of prepaid cards. I agree to the Terms of Service and Refund Policy, and acknowledge that: once the official activation link is sent, refunds are strictly not supported, and this platform is not responsible for any third-party account ban risk.",
    payMethod: "Payment Method",
    breakdown: "= {official} (official fee) + {service} (service fee)",
    planUnavailable: "This plan is currently unavailable, please contact support",
  },
  howItWorks: {
    title: "How It Works",
    subtitle: "Three steps — your subscription is activated and sent directly by Anthropic",
    step: "STEP",
    steps: {
      submit: {
        title: "Submit Your Request",
        desc: "Choose the Claude plan and duration you need, and enter the email to receive the subscription link.",
      },
      pay: {
        title: "Secure Proxy Payment",
        desc: "After collecting the service fee, we use a genuine credit card issued by a major US bank to pay for your subscription on Anthropic's official site.",
      },
      deliver: {
        title: "Sent by Anthropic",
        desc: "You'll receive the subscription activation link directly in your inbox from Anthropic — click to bind it to your account.",
      },
    },
  },
  serviceNotes: {
    title: "Service Notes",
    notes: {
      validity: {
        title: "365-Day Validity",
        desc: "The subscription activation link is valid for 365 days from the date the proxy payment completes. Please remind the recipient to activate promptly.",
      },
      activation: {
        title: "Activation Method",
        desc: "Anthropic will send an email containing the subscription activation link — click it to bind the subscription to your account.",
      },
      delivery: {
        title: "Fast Delivery",
        desc: "Once payment succeeds, we immediately place the official order on your behalf. The activation link is usually sent to your inbox within 1 hour.",
      },
      mobile: {
        title: "Mobile Subscriptions",
        desc: "If you already subscribe via Apple / Google, please do not order — wait until that subscription expires before activating.",
      },
      ban: {
        title: "After-Sales on Bans",
        desc: "This is a pure proxy-payment service. Once a subscription is officially activated, refunds are not supported even if the account is banned.",
      },
      trust: {
        title: "Trusted Source",
        desc: "Every order is paid with a genuine US bank credit card on Anthropic's official site, and the activation link is sent directly to your inbox by Anthropic.",
      },
    },
  },
  faq: {
    title: "FAQ",
    subtitle: "Everything you need to know before buying.",
    items: [
      {
        q: "What kind of service is this?",
        a: "This site provides proxy-payment for Claude (Anthropic) subscriptions and API credits. After you choose a plan and pay, we place the order through genuine official payment channels, and Anthropic sends the activation link directly to the email you provided.",
      },
      {
        q: "Why choose this platform?",
        a: "We support common domestic payment methods like Alipay, WeChat Pay, and bank cards — no credit card or foreign-currency account needed. Pricing is transparent with official fees and service fees shown separately, and activation is completed in as little as 1 hour after payment.",
      },
      {
        q: "Why should I trust you?",
        a: "Every proxy payment is placed directly on Anthropic's official site, and the activation link is sent by the official system without any third-party relay. Order status can be verified anytime on the 'Track Order' page, and you can consult support before paying to understand the process.",
      },
      {
        q: "How do I pay?",
        a: "After selecting a plan in the plan picker, click 'Buy Now' to jump to the corresponding Alipay / WeChat / bank card checkout. Once payment succeeds, the system automatically handles the rest of the proxy-payment process.",
      },
      {
        q: "How do I check my order status?",
        a: "Click 'Track Order' in the top navigation — orders placed on this device show automatically. You can also use the email you provided at checkout to get a verification code and query all your order history.",
      },
      {
        q: "Can I get a refund?",
        a: "You can request a cancellation and refund before the official activation link is sent. Once the link is sent, the service is considered delivered and refunds are no longer supported. See the Refund Policy for details.",
      },
    ],
  },
  apiHowItWorks: {
    title: "How to Use",
    subtitle: "Three steps to integrate — no application needed, use it right after topping up.",
    step: "STEP",
    steps: {
      recharge: {
        title: "Top Up Credits",
        desc: "Choose a tier and complete payment. Credits arrive instantly, never expire, and are billed by usage.",
      },
      getKey: {
        title: "Get Your Key",
        desc: "After topping up, we email you a dedicated API key — you can set your own usage limits.",
      },
      call: {
        title: "Start Calling",
        desc: "Use the same API format as Anthropic's official — just swap the Base URL and Key to start calling.",
      },
    },
  },
  apiFeatures: {
    title: "Platform Features",
    features: {
      models: {
        title: "Full Model Coverage",
        desc: "Supports the full Claude Opus / Sonnet / Haiku lineup, updated in sync with the official release.",
      },
      compatible: {
        title: "API Format Compatible",
        desc: "The API matches Anthropic's official format — no code changes needed, just swap the key to switch.",
      },
      transparent: {
        title: "Transparent Usage",
        desc: "Token consumption and billing details for every call are queryable, with no hidden fees.",
      },
      noMinimum: {
        title: "No Minimum Spend",
        desc: "Credits are deducted by actual usage, unused portions never expire — no need to worry about waste.",
      },
      stable: {
        title: "Stable & Available",
        desc: "Multi-node relay with automatic failover, ensuring stable, low-latency requests.",
      },
      support: {
        title: "Technical Support",
        desc: "Run into issues during integration? Contact support anytime for technical help.",
      },
    },
  },
  apiTiers: {
    title: "Choose a Top-Up Tier",
    subtitle: "Top up by credit amount, arrives at once, billed as you use it.",
    credit: "Credit",
    serviceFee: "+{percent}% service fee",
    buyNow: "Buy Now",
  },
  apiPromo: {
    title: "Prefer pay-as-you-go API access?",
    desc: "Buy API credits and call Claude models directly through our relay platform — use your own API key, set custom usage limits, and pay only for what you use.",
    cta: "Explore API Platform",
  },
  apiFaq: {
    title: "FAQ",
    subtitle: "Everything you need to know before integrating.",
    items: [
      {
        q: "What is this API platform?",
        a: "This platform is a relay service for Claude's official API. After topping up credits, you're billed by actual usage. The API format matches the official one, and you don't need to arrange overseas payment methods yourself.",
      },
      {
        q: "How does it relate to the official API?",
        a: "Calls are ultimately processed by the official models — we only provide a billing and forwarding layer to keep the API stable and available. We do not alter or log your request content.",
      },
      {
        q: "Do the credits expire?",
        a: "No. Once topped up, credits never expire and are deducted by actual token usage — anything left over can be used later.",
      },
      {
        q: "How do I get an API key?",
        a: "After a successful top-up, we send a dedicated API key to the email you provided at checkout. Just use the key to call directly.",
      },
      {
        q: "Which models are supported?",
        a: "The full Claude Opus, Sonnet, and Haiku lineup is supported, with the latest versions launched in sync with official updates.",
      },
      {
        q: "Is there a stability guarantee?",
        a: "The platform uses multi-node relay and automatically switches on single-node failure, doing its best to ensure availability and response speed.",
      },
    ],
  },
  footer: {
    disclaimer:
      "This site provides proxy-payment services and does not directly sell Anthropic's official products. The final service is subject to official terms. Please carefully verify account information before ordering.",
    terms: "Terms of Service",
    refund: "Refund Policy",
    brand: "Claude Pay",
  },
  dashboard: {
    completedOrders: "Completed Orders",
    totalCredit: "Total Credits Topped Up",
    tabs: {
      all: "All Orders",
      subscription: "Subscriptions",
      apiCredit: "API Credits",
    },
    empty: "No orders yet",
    browseSubscription: "Browse Subscription Plans",
    browseApi: "Browse API Platform",
    creditSuffix: "credit",
    apiKey: "API Key",
    activationLink: "Activation Link",
    copied: "Copied",
    copy: "Copy",
  },
  orderDetail: {
    back: "← Back to Dashboard",
    orderNo: "Order No.",
    status: "Status",
    amount: "Amount",
    payMethod: "Payment Method",
    createdAt: "Order Time",
    paidAt: "Payment Time",
    apiKey: "API Key",
    activationLink: "Activation Link",
    processing:
      "Your order is being processed. We'll notify you by email when it's done — you can also refresh this page to check.",
  },
  checkout: {
    subscriptionTitle: "Claude {plan} · {duration}",
    apiTitle: "API Credit Top-Up · ${credit} credit",
    unitPrice: "Unit price ${price}",
    quantity: "Quantity",
    contactEmail: "Contact Email (for delivery notifications)",
    subscriptionNote: "Claude Account Email / Note (for activating the subscription)",
    optionalNote: "Note (optional)",
    subscriptionPlaceholder: "Enter the Claude account email that needs the subscription",
    payMethod: "Payment Method",
    total: "Total ${usd}",
    pay: "Pay",
  },
  payment: {
    title: "Payment",
    orderNo: "Order No.",
    amount: "Amount",
    paymentMethod: "Payment Method",
    usdtAddress: "USDT (TRC20) Receiving Address",
    usdtAmount: "USDT Amount to Pay",
    scanQrCode: "Scan QR Code to Pay",
    copyAddress: "Copy Address",
    copied: "Copied",
    paymentInstructions: "Payment Instructions",
    instruction1: "1. Please use a wallet that supports TRC20 network",
    instruction2: "2. Make sure the network is TRC20, incorrect network may result in loss",
    instruction3: "3. Please include order number in memo: {orderNo}",
    instruction4: "4. After payment, click the button below and upload payment proof",
    uploadProof: "Upload Payment Proof",
    confirmPayment: "Payment Completed",
    waitingConfirm: "Waiting for confirmation...",
    paymentNote: "Payment is usually confirmed within 5-30 minutes. Please be patient. Contact support if you have questions.",
    backToOrder: "Back to Order Details",
  },
  lookup: {
    title: "Track Order",
    subtitle: "Easily check the status of your Claude subscription proxy-payment orders.",
    recentTitle: "Recent orders on this device",
    byEmailTitle: "Query by email",
    byEmailNote:
      "To protect your privacy, we need to verify your identity. Please enter the recipient email you used at checkout.",
    emailPlaceholder: "Email address",
    codePlaceholder: "Verification code",
    getCode: "Get code",
    query: "Query Orders",
    querying: "Querying...",
    resume: "Resume Payment",
    orderPlaced: "Ordered",
    paid: "Paid",
    notFound: "No matching orders found",
    codeSendFailed: "Failed to send verification code",
    queryFailed: "Query failed",
  },
  pay: {
    orderCreated: "Order {orderNo} created",
    redirectHint: "Please click the button below to go to the payment page and complete payment",
    goToPay: "Go to Payment",
    noUrl: "No payment link was obtained, please go back and re-order",
    resultTitle: "Payment Result",
    orderNoLabel: "Order No.: ",
    currentStatus: "Current status: ",
    resultNotFound: "Order information not found. Please refer to the actual charge for payment status",
    viewOrders: "View My Orders",
  },
  enums: {
    plan: {
      pro: "Pro",
      max5x: "Max 5x",
      max20x: "Max 20x",
    },
    planDescription: {
      pro: "For everyday users",
      max5x: "For heavy users",
      max20x: "For power users",
    },
    duration: {
      month: "Monthly",
      quarter: "Quarterly",
      half_year: "Half-Year",
      year: "Yearly",
    },
    payChannel: {
      usdt: "USDT (TRC20)",
    },
    orderStatus: {
      pending: "Pending Payment",
      paid: "Paid, Processing",
      fulfilling: "Processing",
      completed: "Completed",
      refunded: "Refunded",
      cancelled: "Cancelled",
    },
  },
};
