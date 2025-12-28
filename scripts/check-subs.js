const fs = require('fs');
const path = require('path');
const https = require('https');

// 读取数据文件
const dataPath = path.join(__dirname, '../subscriptions.json');
const subscriptions = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Bark 配置
const BARK_SERVER = 'https://bark-server-2z8w.onrender.com/bark';
const BARK_DEVICE_KEY = process.env.BARK_KEY; // 从 GitHub Secrets 获取

if (!BARK_DEVICE_KEY) {
    console.error("Error: BARK_KEY environment variable is not set.");
    process.exit(1);
}

// 简单的日期处理函数 (不依赖 dayjs 以减少 action 安装依赖的时间)
function addDate(dateStr, cycle) {
    const date = new Date(dateStr);
    if (cycle === 'month') date.setMonth(date.getMonth() + 1);
    else if (cycle === 'year') date.setFullYear(date.getFullYear() + 1);
    else if (cycle === 'week') date.setDate(date.getDate() + 7);
    return date;
}

function getNextBillingDate(startStr, cycle) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 清除时分秒
    
    let nextDate = new Date(startStr);
    
    // 如果起始日期就是未来，直接返回
    if (nextDate >= today) return nextDate;

    // 循环直到日期 >= 今天
    while (nextDate < today) {
        nextDate = addDate(nextDate, cycle);
    }
    return nextDate;
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// 封装一个带重试机制的请求函数
function sendRequest(url, retries = 3) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                resolve(res.statusCode);
            } else {
                reject(new Error(`Status Code: ${res.statusCode}`));
            }
        });
        req.on('error', (err) => {
            if (retries > 0) {
                console.log(`Request failed, retrying... (${retries} left)`);
                setTimeout(() => {
                    sendRequest(url, retries - 1).then(resolve).catch(reject);
                }, 5000); // 失败后等待 5 秒重试 (给 Render 启动时间)
            } else {
                reject(err);
            }
        });
        
        // 设置超时，防止 Render 启动太慢导致挂起
        req.setTimeout(60000, () => { // 60秒超时
            req.destroy();
        });
    });
}
async function main() {
    const todayStr = formatDate(new Date());
    const messages = [];
    subscriptions.forEach(sub => {
        if (sub.status !== 'active') return;
        const nextDate = getNextBillingDate(sub.start_date, sub.cycle);
        const nextDateStr = formatDate(nextDate);
        const diffTime = nextDate - new Date(todayStr);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        console.log(`Checking ${sub.name}: Next bill ${nextDateStr}, Days left: ${diffDays}`);
        if (diffDays === 0) {
            messages.push(`【今日扣费】${sub.name} (¥${sub.price})`);
        } else if (diffDays > 0 && diffDays <= 2) {
            messages.push(`【${diffDays}天后】${sub.name} 即将扣费`);
        }
    });
    if (messages.length > 0) {
        const title = "订阅扣费提醒";
        const body = messages.join('\n');
        const url = `${BARK_SERVER}/${BARK_DEVICE_KEY}/${encodeURIComponent(title)}/${encodeURIComponent(body)}?group=订阅管理&icon=https://cdn-icons-png.flaticon.com/512/2933/2933116.png`;
        
        console.log("Sending notification to Bark...");
        
        try {
            await sendRequest(url);
            console.log("Notification sent successfully!");
        } catch (error) {
            console.error("Failed to send notification after retries:", error.message);
            // 即使失败也不要 exit(1)，以免 GitHub Action 标记为失败（除非你想收到 Action 失败的邮件）
        }
    } else {
        console.log("No subscriptions due soon.");
    }
}
main();
