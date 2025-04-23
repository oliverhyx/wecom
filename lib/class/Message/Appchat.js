const Base = require('../Base');


class Appchat extends Base {
	constructor() {
		super();
	}

	/**
	 * 创建群聊会话
	 * @description 创建企业微信群聊会话，用于后续发送群聊消息
	 * @param {Object} options - 群聊配置参数
	 * @param {string[]} options.userlist - 群成员id列表，至少2人，至多2000人
	 * @param {string} [options.name] - 群聊名，最多50个utf8字符，超过将截断
	 * @param {string} [options.owner] - 指定群主的id。如果不指定，系统会随机从userlist中选一人作为群主
	 * @param {string} [options.chatid] - 群聊的唯一标志，不能与已有的群重复。只允许字符0-9及字母a-zA-Z，最长32个字符
	 * @returns {Promise<Object>} 返回创建结果，包含errcode、errmsg和chatid字段
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async createChat(options = {}) {
		// 参数验证
		if (!options.userlist || !Array.isArray(options.userlist)) {
			throw new Error('userlist必须是数组');
		}

		if (options.userlist.length < 2) {
			throw new Error('群成员至少需要2人');
		}

		if (options.userlist.length > 2000) {
			throw new Error('群成员不能超过2000人');
		}

		if (options.name && Buffer.from(options.name).length > 50) {
			throw new Error('群聊名不能超过50个utf8字符');
		}

		if (options.chatid) {
			if (typeof options.chatid !== 'string') {
				throw new Error('chatid必须是字符串');
			}
			if (options.chatid.length > 32) {
				throw new Error('chatid长度不能超过32个字符');
			}
			if (!/^[0-9a-zA-Z]+$/.test(options.chatid)) {
				throw new Error('chatid只能包含数字和字母');
			}
		}

		// 构建请求参数
		const params = {
			userlist: options.userlist
		};

		// 添加可选参数
		if (options.name) params.name = options.name;
		if (options.owner) params.owner = options.owner;
		if (options.chatid) params.chatid = options.chatid;

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/appchat/create', 'POST', params, 'agent');
		return res;
	}

	/**
	 * 修改群聊会话
	 * @description 修改企业微信群聊的配置，包括群名、群主、成员等
	 * @param {Object} options - 群聊配置参数
	 * @param {string} options.chatid - 群聊id
	 * @param {string} [options.name] - 新的群聊名，最多50个utf8字符，超过将截断
	 * @param {string} [options.owner] - 新群主的id
	 * @param {string[]} [options.add_user_list] - 添加成员的id列表
	 * @param {string[]} [options.del_user_list] - 踢出成员的id列表
	 * @returns {Promise<Object>} 返回修改结果，包含errcode和errmsg字段
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async updateChat(options = {}) {
		// 参数验证
		if (!options.chatid) {
			throw new Error('chatid为必填参数');
		}

		if (options.name && Buffer.from(options.name).length > 50) {
			throw new Error('群聊名不能超过50个utf8字符');
		}

		if (options.add_user_list && !Array.isArray(options.add_user_list)) {
			throw new Error('add_user_list必须是数组');
		}

		if (options.del_user_list && !Array.isArray(options.del_user_list)) {
			throw new Error('del_user_list必须是数组');
		}

		// 构建请求参数
		const params = {
			chatid: options.chatid
		};

		// 添加可选参数
		if (options.name) params.name = options.name;
		if (options.owner) params.owner = options.owner;
		if (options.add_user_list) params.add_user_list = options.add_user_list;
		if (options.del_user_list) params.del_user_list = options.del_user_list;

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/appchat/update', 'POST', params, 'agent');
		return res;
	}

	/**
	 * 获取群聊会话
	 * @description 获取企业微信群聊的详细信息，包括群名、群主、成员等
	 * @param {string} chatid - 群聊id
	 * @returns {Promise<Object>} 返回群聊信息，包含chat_info对象，其中包含chatid、name、owner、userlist、chat_type等字段
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async getChat(chatid) {
		// 参数验证
		if (!chatid) {
			throw new Error('chatid为必填参数');
		}

		if (typeof chatid !== 'string') {
			throw new Error('chatid必须是字符串');
		}

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/appchat/get', 'GET', {
			chatid
		}, 'agent');
		return res;
	}

	/**
	 * 发送群聊消息
	 * @description 向企业微信群聊发送消息，支持文本、图片、视频、文件、图文等类型
	 * @param {Object} options - 消息配置参数
	 * @param {string} options.chatid - 群聊id
	 * @param {string} options.msgtype - 消息类型，支持text/image/voice/video/file/textcard/news/mpnews/markdown等类型
	 * @param {Object} options.content - 消息内容，根据msgtype不同而不同
	 * @param {number} [options.safe=0] - 表示是否是保密消息，0表示否，1表示是，默认0
	 * @returns {Promise<Object>} 返回发送结果，包含errcode和errmsg字段
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async sendMessage(options = {}) {
		// 参数验证
		if (!options.chatid) {
			throw new Error('chatid为必填参数');
		}

		if (!options.msgtype) {
			throw new Error('msgtype为必填参数');
		}

		if (!options.content) {
			throw new Error('content为必填参数');
		}

		// 构建请求参数
		const params = {
			chatid: options.chatid,
			msgtype: options.msgtype
		};

		// 根据消息类型设置消息内容
		params[options.msgtype] = options.content;

		// 添加可选参数
		if (options.safe !== undefined) {
			params.safe = options.safe;
		}

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/appchat/send', 'POST', params, 'agent');
		return res;
	}

}


module.exports = Appchat;