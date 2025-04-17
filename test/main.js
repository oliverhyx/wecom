const {
    Base,
    Authorize,
    Callback,
    Concats,
    Externalcontact
} = require('../lib/main')

// 初始化对象
const base = new Base();
const message = new Externalcontact.Message();

async function main() {
    const res = await message.addGroupWelcomeTemplate({
        text: {
            content: '1234567890'
        }
    });
    console.log(res);
}

main();