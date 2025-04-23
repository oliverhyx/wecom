const {
    Base,
    Authorize,
    Callback,
    Concats,
    Externalcontact,
    Message
} = require('../lib/main')

// 初始化对象
const base = new Base();
const message = new Externalcontact.Message();

async function main() {
    // const user = new Concats.User();
    // const res = await user.listUserIds();

    const user = new Externalcontact.User();
    const res = await user.getDepartmentUsers(4);
    console.log(res);
    // const res = await message.addGroupWelcomeTemplate({
    //     text: {
    //         content: '1234567890'
    //     }
    // });
    // console.log(res);

    // const webauth = new Authorize.Webauth();
    // const res = await webauth.getUserInfo('tmfAz-vOQYkk3eUPC8mLVCXc4RQROf_yf-h6LNx13Sk');
    // console.log(res);
    // const appmessage = new Message.Appmessage();
    // const res = await appmessage.sendMessage({
    //     agentid: 1000003,
    //     touser: 'oliverhuang',
    //     msgtype: 'textcard',
    //     content: {
    //       title: `客户12提交问卷`,
    //       description: `32的客户 233提交了一个问卷，当前ai分析结果正在分析中，分析完后通知`,
    //       url: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=ww454f46eb3af0c1dc&redirect_uri=${encodeURIComponent('http://health.nimihealth.cn/mobile-test/view?id=  ' + 1)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`,
    //         btntxt: '立即查看'
    //     }
    // })
    // console.log(res);
    // const groupchat = new Externalcontact.Groupchat();
    // console.log(await groupchat.getGroupchatList({
    //     limit: 1000,
    //     status_filter: 0
    // }));
    // { chat_id: 'wr03SPaQAAdnuUsBAEPqtk83is3VU_Pg', status: 0 },
    // { chat_id: 'wr03SPaQAAh0D30ZBvPdBNolnzBNF7sQ', status: 0 },
    // { chat_id: 'wr03SPaQAAcXgmyG0M3N8d9Qvtw7iFbg', status: 0 }
    // const res = await groupchat.getGroupchatDetail({
    //     chat_id: 'wr03SPaQAAdnuUsBAEPqtk83is3VU_Pg',
    //     need_name: 1
    //   });
    // console.log(res);

    // const appchat = new Message.Appchat();
    // console.log(await appchat.getChat('wr03SPaQAAdnuUsBAEPqtk83is3VU_Pg'));
}

main();