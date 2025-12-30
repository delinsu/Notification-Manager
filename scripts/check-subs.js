const fs = require('fs');
const path = require('path');
const https = require('https');

// --- 配置区域 ---
// 确保这个路径相对于脚本执行的位置是正确的 (通常在项目根目录执行 node scripts/check-subs.js)
const DATA_FILE = 'subscriptions.json'; 
const BARK_SERVER = 'https://bark-server-2z8w.onrender.com/bark';
// 将你的 GitHub Pages 网址填在这里，点击通知可以直接跳转管理
const DASHBOARD_URL = 'https://delinsu.github.io/Notification-Manager/'; 

const BARK_DEVICE_KEY = process.env.BARK_KEY;

if (!BARK_DEVICE_KEY) {
    console.error("Error: BARK_KEY environment variable is not set.");
    process.exit(1);
}

// --- 辅助函数 ---
// 货币符号映射
const currencyMap = {
    'CNY': '¥',
    'USD': '$',
    'HKD': 'HK$',
    'JPY': 'JP¥',
    'EUR': '€',
    'GBP': '£'
};
function getCurrencySymbol(code) {
    return currencyMap[code] || '¥';
}
// 获取北京时间的当前日期对象（清除时分秒）
function getBeijingToday() {
    // 创建一个基于 UTC 的当前时间
    const now = new Date();
    // 使用 Intl 转换为北京时间字符串 "YYYY/MM/DD"
    const beijingTimeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(now);
    
    // 重新构造 Date 对象 (注意 MM/DD/YYYY 格式)
    const [month, day, year] = beijingTimeStr.split('/');
    const beijingDate = new Date(`${year}-${month}-${day}`);
    beijingDate.setHours(0, 0, 0, 0);
    return beijingDate;
}

// 计算下一个扣费日
function getNextBillingDate(startStr, cycle) {
    const today = getBeijingToday();
    let nextDate = new Date(startStr);
    // 简单修正时区偏移带来的日期解析误差，统一处理为当地时间0点
    nextDate.setHours(0,0,0,0);
    
    // 如果开始日期就是未来，直接返回
    if (nextDate >= today) return nextDate;

    // 循环增加直到 >= 今天
    while (nextDate < today) {
        if (cycle === 'month') {
            // 处理月末逻辑，如 1.31 -> 2.28
            const d = nextDate.getDate();
            nextDate.setMonth(nextDate.getMonth() + 1);
            if (nextDate.getDate() !== d) {
                // 如果日期变了（说明溢出到了下个月），设置为上个月最后一天
                nextDate.setDate(0);
            }
        } else if (cycle === 'year') {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
        } else if (cycle === 'week') {
            nextDate.setDate(nextDate.getDate() + 7);
        }
    }
    return nextDate;
}


// Bark 推送函数, 带重试机制的请求
function sendBark(title, body, group = '订阅管理') {
    return new Promise((resolve, reject) => {
        // 构建 Bark 参数
        const params = new URLSearchParams({
            group: group,
            icon: 'https://cdn-icons-png.flaticon.com/512/2933/2933116.png',
            isArchive: 1, // 保存历史记录
            sound: 'minuet', // 提示音
            url: DASHBOARD_URL, // 点击跳转
            level: 'active' // 设为 active 会点亮屏幕
        });

        // 拼接 URL
        const fullUrl = `${BARK_SERVER}/${BARK_DEVICE_KEY}/${encodeURIComponent(title)}/${encodeURIComponent(body)}?${params.toString()}`;

        const req = https.get(fullUrl, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                resolve(res.statusCode);
            } else {
                reject(new Error(`Bark API Status: ${res.statusCode}`));
            }
        });
        req.on('error', (err) => {
            if (retries > 0) {
                console.log(`Request failed, retrying... (${retries} left)`);
                setTimeout(() => {
                    sendRequest(url, retries - 1).then(resolve).catch(reject);
                }, 120000); // 失败后等待 2 分钟重试 (给 Render 启动时间)
            } else {
                reject(err);
            }
        });
        
        // 设置超时，防止 Render 启动太慢导致挂起
        req.setTimeout(150000, () => {
            req.destroy();
        });
    });
}

// --- 主逻辑 ---
async function main() {
    // 读取文件
    let subscriptions = [];
    try {
        const dataPath = path.resolve(__dirname, '..', DATA_FILE);
        if (fs.existsSync(dataPath)) {
            const rawData = fs.readFileSync(dataPath, 'utf8');
            subscriptions = JSON.parse(rawData);
        } else {
            console.log("No subscriptions.json found, skipping.");
            return;
        }
    } catch (e) {
        console.error("Failed to read subscription file:", e.message);
        // 如果文件不存在或解析失败，不做任何事，直接退出
        return;
    }

    const today = getBeijingToday();
    const messages = [];
    let totalDue = 0;

    subscriptions.forEach(sub => {
        if (sub.status !== 'active') return;

        const nextDate = getNextBillingDate(sub.start_date, sub.cycle);
        
        // 计算天数差
        const diffTime = nextDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const symbol = getCurrencySymbol(sub.currency);
        // 逻辑：当天、明天、后天提醒 (0, 1, 2)
        if (diffDays === 0) {
            messages.push(`🔴 [今日扣费] ${sub.name} ${symbol}${sub.price}`);
            totalDue += parseFloat(sub.price);
        } else if (diffDays === 1) {
            messages.push(`🟡 [明天扣费] ${sub.name} ${symbol}${sub.price}`);
        } else if (diffDays <= 3) {
            messages.push(`🔵 [${diffDays}天后] ${sub.name} ${symbol}${sub.price}`);
        }
    });

    if (messages.length > 0) {
        console.log("Found upcoming subscriptions:", messages);
        const title = `订阅提醒：${messages.length} 个项目即将扣费`;
        const body = messages.join('\n');
        
        try {
            await sendBark(title, body);
            console.log("✅ Bark notification sent.");
        } catch (error) {
            console.error("❌ Failed to send Bark:", error.message);
            process.exit(1); // 报错退出，让 GitHub Action 显示红叉
        }
    } else {
        console.log("✅ No subscriptions due in next 3 days.");
    }
}

main();
