const Base = require('../Base');

/**
 * 企业微信网页授权与登录相关功能
 * @public {function} setBaseInfoUrl - 生成企业微信网页授权链接(静默授权)
 * @public {function} setPrivateInfoUrl - 生成企业微信网页授权链接(手动授权)
 * @public {function} getUserInfo - 获取访问用户身份
 * @public {function} setCorpAppLoginUrl - 生成企业微信扫码登录链接
 * @public {function} setServiceAppLoginUrl - 生成服务商应用扫码登录链接
 */
class Webauth extends Base {
    constructor() {
        super();
    }

    /**
     * 生成企业微信网页授权链接 - 静默授权
     * @description 生成用于获取成员基础信息的网页授权链接，用户无感知
     * @param {string} url - 授权后重定向的回调链接地址
     * @param {string} agentId - 企业应用的id
     * @param {string} [state='STATE'] - 重定向后会带上state参数，企业可以填写a-zA-Z0-9的参数值，长度不可超过128个字节
     * @returns {string} 完整的网页授权链接
     */
    setBaseInfoUrl(url,  agentId, state= 'STATE') {
        return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.corpid}&redirect_uri=${encodeURIComponent(url)}&response_type=code&scope=snsapi_base&state=${state}&agentid=${agentId}#wechat_redirect`
    }

    /**
     * 生成企业微信网页授权链接 - 手动授权
     * @description 生成用于获取成员敏感信息的网页授权链接，需用户手动同意
     * @param {string} url - 授权后重定向的回调链接地址
     * @param {string} agentId - 企业应用的id
     * @param {string} [state='STATE'] - 重定向后会带上state参数，企业可以填写a-zA-Z0-9的参数值，长度不可超过128个字节
     * @returns {string} 完整的网页授权链接
     */
    setPrivateInfoUrl(url,  agentId, state= 'STATE') {
        return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.corpid}&redirect_uri=${encodeURIComponent(url)}&response_type=code&scope=snsapi_privateinfo&state=${state}&agentid=${agentId}#wechat_redirect`
    }

    /**
     * 获取访问用户身份
     * @description 根据code获取成员信息，适用于自建应用与代开发应用
     * @param {string} code - 通过成员授权获取到的code，最大为512字节。每次成员授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。
     * @returns {Promise<Object>} 包含用户身份信息的对象
     * 返回说明：
     * - 企业成员时返回：
     *   {
     *     "errcode": 0,
     *     "errmsg": "ok",
     *     "userid": "USERID", // 成员UserID。若需要获得用户详情信息，可调用通讯录接口。互联企业格式为：CorpId/userid
     *     "user_ticket": "USER_TICKET" // 成员票据，最大为512字节，有效期为1800s。仅当scope为snsapi_privateinfo且用户在应用可见范围内时返回
     *   }
     * - 非企业成员时返回：
     *   {
     *     "errcode": 0,
     *     "errmsg": "ok",
     *     "openid": "OPENID", // 非企业成员的标识，对当前企业唯一。不超过64字节
     *     "external_userid": "EXTERNAL_USERID" // 外部联系人id，当且仅当用户是企业的客户，且跟进人在应用的可见范围内时返回
     *   }
     * - 出错时返回示例：
     *   {
     *     "errcode": 40029,
     *     "errmsg": "invalid code"
     *   }
     * 注意：跳转的域名须完全匹配access_token对应应用的可信域名，否则会返回50001错误。
     * 
     * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
     */
    async getUserInfo(code) {
        // 参数验证
        if (!code) {
            throw new Error('code不能为空');
        }
        
        if (typeof code !== 'string') {
            throw new Error('code必须是字符串');
        }
        
        if (Buffer.from(code).length > 512) {
            throw new Error('code长度不能超过512字节');
        }
        
        const url = `https://qyapi.weixin.qq.com/cgi-bin/auth/getuserinfo?code=${code}`;
        const res = await this.curl(url, 'GET', null, 'agent');
        return res;
    }


    /**
     * 获取访问用户敏感信息
     * @description 根据user_ticket获取成员敏感信息，适用于自建应用与代开发应用
     * @param {string} user_ticket - 成员票据，最大为512字节，有效期为1800s
     * @returns {Promise<Object>} 包含用户敏感信息的对象
     * 返回说明：
     * {
     *   "errcode": 0,
     *   "errmsg": "ok",
     *   "userid": "lisi",
     *   "gender": "1",           // 性别。0表示未定义，1表示男性，2表示女性
     *   "avatar": "http://shp.qpic.cn/bizmp/xxx/0", // 头像url
     *   "qr_code": "https://open.work.weixin.qq.com/wwopen/userQRCode?vcode=xxx", // 员工个人二维码
     *   "mobile": "13800000000", // 手机号
     *   "email": "zhangsan@gzdev.com", // 邮箱
     *   "biz_mail": "zhangsan@qyycs2.wecom.work", // 企业邮箱
     *   "address": "广州市海珠区新港中路" // 地址
     * }
     * 
     * 注意：
     * 1. 成员必须在应用的可见范围内
     * 2. 敏感字段需要管理员在应用详情里选择，且成员oauth2授权时确认后才返回
     * 3. 敏感字段包括：性别、头像、员工个人二维码、手机、邮箱、企业邮箱、地址
     * 4. 第三方应用无法获取手机、邮箱、企业邮箱、地址等敏感信息
     * 
     * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
     */
    async getUserDetail(user_ticket) {
        // 参数验证
        if (!user_ticket) {
            throw new Error('user_ticket不能为空');
        }
        
        if (typeof user_ticket !== 'string') {
            throw new Error('user_ticket必须是字符串');
        }
        
        if (Buffer.from(user_ticket).length > 512) {
            throw new Error('user_ticket长度不能超过512字节');
        }
        
        const url = 'https://qyapi.weixin.qq.com/cgi-bin/auth/getuserdetail';
        const params = {
            user_ticket: user_ticket
        };
        
        const res = await this.curl(url, 'POST', params, 'agent');
        return res;
    }
}


module.exports = Webauth;