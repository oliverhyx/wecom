const Base = require('../Base');

/**
 * 企业微信登录授权相关功能
 * @public {function} setCorpAppLoginUrl - 生成企业微信扫码登录链接
 * @public {function} setServiceAppLoginUrl - 生成服务商应用扫码登录链接
 * @public {function} getUserInfo - 获取访问用户身份
 */
class Authsucc extends Base {
    constructor() {
        super();
    }

    /**
     * 获取用户二次验证信息
     * @description 根据code获取成员二次验证信息，适用于通讯录同步或自建应用
     * @param {string} code - 用户进入二次验证页面时，企业微信颁发的code，最大为512字节。每次成员授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期。
     * @returns {Promise<Object>} 包含用户二次验证信息的对象
     * 返回说明：
     * - 成功时返回：
     *   {
     *     "errcode": 0,
     *     "errmsg": "ok",
     *     "userid": "USERID", // 成员UserID。若需要获得用户详情信息，可调用通讯录接口：读取成员。
     *     "tfa_code": "TFA_CODE" // 二次验证授权码，开发者可以调用通过二次验证接口，解锁企业微信终端。有效期五分钟，且只能使用一次。
     *   }
     * - 出错时返回示例：
     *   {
     *     "errcode": 40029,
     *     "errmsg": "invalid code"
     *   }
     * 
     * 注意：
     * 1. 仅『通讯录同步』或者自建应用可调用。
     * 2. 如用自建应用调用，用户需要在二次验证范围和应用可见范围内，并且验证页面的链接必须填该自建应用的oauth2链接。
     * 3. 接口并发限制为20。
     * 
     * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
     */
    async getTfaInfo(code) {
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
        
        const url = 'https://qyapi.weixin.qq.com/cgi-bin/auth/get_tfa_info';
        const params = {
            code: code
        };
        
        const res = await this.curl(url, 'POST', params, 'agent');
        return res;
    }
    /**
     * 通过二次验证
     * @description 企业在开启二次验证时，必须在管理端填写企业二次验证页面的url。当成员登录企业微信或关注微信插件（原企业号）进入企业时，会自动跳转到企业的验证页面。
     * 企业收到code后，使用"通讯录同步助手"调用接口"根据code获取成员信息"获取成员的userid。
     * 如果成员是首次加入企业，企业获取到userid，并验证了成员信息后，调用此接口即可让成员成功加入企业。
     * @param {string} userid - 成员UserID。对应管理端的账号
     * @returns {Promise<Object>} 包含操作结果的对象
     * 返回说明：
     * {
     *   "errcode": 0,
     *   "errmsg": "ok"
     * }
     * 
     * 注意：
     * 1. 仅『通讯录同步』可调用。
     * 2. 调用接口的频率限制为600次/分钟。
     * 
     * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
     */
    async authSucc(userid) {
        // 参数验证
        if (!userid) {
            throw new Error('userid不能为空');
        }
        
        if (typeof userid !== 'string') {
            throw new Error('userid必须是字符串');
        }
        
        const url = `https://qyapi.weixin.qq.com/cgi-bin/user/authsucc?userid=${encodeURIComponent(userid)}`;
        const res = await this.curl(url, 'GET', null, 'agent');
        return res;
    }

    /**
     * 使用二次验证
     * @description 企业在开启二次验证时，如果成员是首次加入企业，企业获取到userid和tfa_code后，调用此接口即可让成员成功通过二次验证。
     * @param {string} userid - 成员UserID。对应管理端的账号
     * @param {string} tfa_code - 获取用户二次验证信息接口返回的tfa_code
     * @returns {Promise<Object>} 包含操作结果的对象
     * 返回说明：
     * {
     *   "errcode": 0,
     *   "errmsg": "ok"
     * }
     * 
     * 注意：
     * 1. 仅『通讯录同步』或者自建应用可调用。
     * 2. 如用自建应用调用，用户需要在二次验证范围和应用可见范围内，并且验证页面的链接必须填该自建应用的oauth2链接。
     * 3. tfa_code五分钟内有效且只能使用一次。
     * 4. 调用接口的并发限制为20次/分钟。
     * 
     * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
     */
    async tfaSucc(userid, tfa_code) {
        // 参数验证
        if (!userid) {
            throw new Error('userid不能为空');
        }
        
        if (typeof userid !== 'string') {
            throw new Error('userid必须是字符串');
        }
        
        if (!tfa_code) {
            throw new Error('tfa_code不能为空');
        }
        
        if (typeof tfa_code !== 'string') {
            throw new Error('tfa_code必须是字符串');
        }
        
        const url = 'https://qyapi.weixin.qq.com/cgi-bin/user/tfa_succ';
        const params = {
            userid: userid,
            tfa_code: tfa_code
        };
        
        const res = await this.curl(url, 'POST', params, 'agent');
        return res;
    }

}


module.exports = Authsucc;