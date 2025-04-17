const Base = require('../Base');

/**
 * 企业微信登录授权相关功能
 * @public {function} setCorpAppLoginUrl - 生成企业微信扫码登录链接
 * @public {function} setServiceAppLoginUrl - 生成服务商应用扫码登录链接
 * @public {function} getUserInfo - 获取访问用户身份
 */
class Webauth extends Base {
    constructor() {
        super();
    }

  
    /**
     * 生成企业微信扫码登录链接
     * @description 开发者需要构造此链接来获取code参数，用于后续获取用户信息
     * @param {string} url - 登录成功后重定向的回调链接地址，需进行URLEncode，域名必须配置为可信域名
     * @param {string} agentId - 企业自建应用/服务商代开发应用的AgentID
     * @param {string} [state='STATE'] - 用于保持请求和回调的状态，授权请求后原样带回给企业，可用于防止CSRF攻击
     * @param {string} [lang] - 语言类型。zh：中文；en：英文
     * @returns {string} 完整的企业微信扫码登录链接
     */
    setCorpAppLoginUrl(url, agentId, state = 'STATE', lang) {
        let loginUrl = `https://login.work.weixin.qq.com/wwlogin/sso/login?login_type=CorpApp&appid=${this.corpid}&redirect_uri=${encodeURIComponent(url)}&state=${encodeURIComponent(state)}&agentid=${agentId}`;
        
        // 如果提供了语言参数，添加到URL中
        if (lang) {
            loginUrl += `&lang=${lang}`;
        }
        
        return loginUrl;
    }
    
    /**
     * 生成服务商应用扫码登录链接
     * @description 开发者需要构造此链接来获取code参数，用于后续获取用户信息
     * @param {string} url - 登录成功后重定向的回调链接地址，需进行URLEncode，域名必须配置为可信域名
     * @param {string} agentId - 企业自建应用/服务商代开发应用的AgentID
     * @param {string} [state='STATE'] - 用于保持请求和回调的状态，授权请求后原样带回给企业，可用于防止CSRF攻击，需进行URLEncode
     * @param {string} [lang] - 语言类型。zh：中文；en：英文
     * @returns {string} 完整的服务商应用扫码登录链接
     * 
     * 注意：redirect_uri的域名必须配置为可信域名，不同应用类型配置方法不同：
     * - 自建应用：OAuth可信域名或者Web网页授权回调域名
     * - 代开发应用：OAuth可信域名或者Web网页授权回调域名
     * - 第三方应用："登录授权"的可信域名
     */
    setServiceAppLoginUrl(url, agentId, state = 'STATE', lang) {
        let loginUrl = `https://login.work.weixin.qq.com/wwlogin/sso/login?login_type=ServiceApp&appid=${this.corpid}&redirect_uri=${encodeURIComponent(url)}&state=${encodeURIComponent(state)}&agentid=${agentId}`;
        
        // 如果提供了语言参数，添加到URL中
        if (lang) {
            loginUrl += `&lang=${lang}`;
        }
        
        return loginUrl;
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
     *     "userid": "USERID" // 成员UserID。若需要获得用户详情信息，可调用通讯录接口。
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

}


module.exports = Webauth;