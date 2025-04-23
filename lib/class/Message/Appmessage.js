const Base = require('../Base');


class Appmessage extends Base {
	constructor() {
		super();
	}
	/**
	 * 发送应用消息
	 * @param {Object} options - 消息配置参数
	 * @param {string} [options.touser] - 指定接收消息的成员，成员ID列表（多个接收者用'|'分隔，最多支持1000个）。特殊情况：指定为"@all"，则向该企业应用的全部成员发送
	 * @param {string} [options.toparty] - 指定接收消息的部门，部门ID列表，多个接收者用'|'分隔，最多支持100个。当touser为"@all"时忽略本参数
	 * @param {string} [options.totag] - 指定接收消息的标签，标签ID列表，多个接收者用'|'分隔，最多支持100个。当touser为"@all"时忽略本参数
	 * @param {string} options.msgtype - 消息类型，支持text/image/voice/video/file/textcard/news/mpnews/markdown/miniprogram_notice/template_card等类型
	 * @param {Object} options.content - 消息内容，根据msgtype不同而不同
	 * @param {number} [options.safe=0] - 表示是否是保密消息，0表示可对外分享，1表示不能分享且内容显示水印，默认为0
	 * @param {number} [options.enable_id_trans=0] - 表示是否开启id转译，0表示否，1表示是，默认0
	 * @param {number} [options.enable_duplicate_check=0] - 表示是否开启重复消息检查，0表示否，1表示是，默认0
	 * @param {number} [options.duplicate_check_interval=1800] - 表示重复消息检查的时间间隔，默认1800s，最大不超过4小时
	 * @returns {Promise<Object>} 返回发送结果，包含errcode、errmsg、invaliduser、invalidparty、invalidtag等字段
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async sendMessage(options = {}) {
		if (!options.msgtype) {
			throw new Error('msgtype为必填参数');
		}
        
		if (!options.content) {
			throw new Error('content为必填参数');
		}

		// 构建请求参数
		const params = {
			msgtype: options.msgtype,
			agentid: this.agentid || options.agentid
		};

		// 添加接收人参数
		if (options.touser) params.touser = options.touser;
		if (options.toparty) params.toparty = options.toparty;
		if (options.totag) params.totag = options.totag;

		// 根据消息类型设置消息内容
		params[options.msgtype] = options.content;

		// 添加可选参数
		if (options.safe !== undefined) params.safe = options.safe;
		if (options.enable_id_trans !== undefined) params.enable_id_trans = options.enable_id_trans;
		if (options.enable_duplicate_check !== undefined) params.enable_duplicate_check = options.enable_duplicate_check;
		if (options.duplicate_check_interval !== undefined) params.duplicate_check_interval = options.duplicate_check_interval;

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/message/send', 'POST', params, 'agent');
		return res;
	}
}


module.exports = Appmessage;