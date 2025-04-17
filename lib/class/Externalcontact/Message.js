const Base = require('../Base');

/**
 * 客户群「加入群聊」管理
 * @description 企业可通过接口配置客户群「加入群聊」的方式。配置后，客户通过扫描群二维码或点击小程序上的按钮，即可进入企业的客户群
 * @public {function} addJoinWay - 配置客户群进群方式
 * @public {function} getJoinWay - 获取客户群进群方式配置
 * @public {function} updateJoinWay - 更新客户群进群方式配置
 * @public {function} deleteJoinWay - 删除客户群进群方式配置
 */
class Message extends Base {
	constructor() {
		super();
	}

	/**
	 * 创建企业群发消息任务
	 * @description 添加企业群发消息的任务并通知成员发送给相关客户或客户群
	 * @param {Object} options - 群发消息配置参数
	 * @param {string} [options.chat_type='single'] - 群发任务类型，single发送给客户，group发送给客户群
	 * @param {string[]} [options.external_userid] - 客户的external_userid列表，chat_type为single时有效，最多1万个
	 * @param {string[]} [options.chat_id_list] - 客户群ID列表，chat_type为group时有效，最多2000个
	 * @param {Object} [options.tag_filter] - 按标签筛选群发客户
	 * @param {string} [options.sender] - 发送成员userid，群发给客户群时必填
	 * @param {boolean} [options.allow_select=false] - 是否允许成员重新选择待发送客户列表
	 * @param {Object} [options.text] - 文本消息内容
	 * @param {string} options.text.content - 消息文本内容，最多4000字节
	 * @param {Object[]} [options.attachments] - 附件列表，最多9个
	 * @returns {Promise<Object>} 返回群发任务结果，包含msgid和失败列表
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async addMsgTemplate(options) {
		if (!options || typeof options !== 'object') {
			throw new Error('参数必须是一个对象');
		}

		// 验证必要参数
		if (!options.text && (!options.attachments || !options.attachments.length)) {
			throw new Error('text和attachments不能同时为空');
		}

		if (options.chat_type === 'group' && !options.sender) {
			throw new Error('发送给客户群时sender为必填项');
		}

		// 构建请求参数
		const params = {};

		// 添加可选参数
		if (options.chat_type) params.chat_type = options.chat_type;
		if (options.external_userid) params.external_userid = options.external_userid;
		if (options.chat_id_list) params.chat_id_list = options.chat_id_list;
		if (options.tag_filter) params.tag_filter = options.tag_filter;
		if (options.sender) params.sender = options.sender;
		if (options.allow_select !== undefined) params.allow_select = options.allow_select;
		if (options.text) params.text = options.text;
		if (options.attachments) params.attachments = options.attachments;

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/add_msg_template', 'POST', params, 'agent');
		return res;
	}
	/**
	 * 提醒成员群发
	 * @description 重新触发群发通知，提醒成员完成群发任务，24小时内每个群发最多触发三次提醒
	 * @param {string} msgid - 群发消息的id，通过获取群发记录列表接口返回
	 * @returns {Promise<Object>} 返回提醒结果
	 * @throws {Error} 当必填参数缺失时抛出错误
	 */
	async remindGroupmsgSend(msgid) {
		if (!msgid) {
			throw new Error('msgid为必填参数');
		}

		const params = {
			msgid
		};

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/remind_groupmsg_send', 'POST', params, 'agent');
		return res;
	}

	/**
	 * 停止企业群发
	 * @description 停止无需成员继续发送的企业群发
	 * @param {string} msgid - 群发消息的id，通过获取群发记录列表接口返回
	 * @returns {Promise<Object>} 返回停止结果
	 * @throws {Error} 当必填参数缺失时抛出错误
	 */
	async cancelGroupmsgSend(msgid) {
		if (!msgid) {
			throw new Error('msgid为必填参数');
		}

		const params = {
			msgid
		};

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/cancel_groupmsg_send', 'POST', params, 'agent');
		return res;
	}


	/**
	 * 获取群发记录列表
	 * @description 企业和第三方应用可通过此接口获取企业与成员的群发记录
	 * @param {Object} options - 请求参数
	 * @param {string} options.chat_type - 群发任务的类型，默认为single表示发送给客户，group表示发送给客户群
	 * @param {number} options.start_time - 群发任务记录开始时间
	 * @param {number} options.end_time - 群发任务记录结束时间
	 * @param {string} [options.creator] - 群发任务创建人企业账号id
	 * @param {number} [options.filter_type] - 创建人类型。0：企业发表 1：个人发表 2：所有类型(默认)
	 * @param {number} [options.limit] - 返回的最大记录数，整型，最大值100，默认值50
	 * @param {string} [options.cursor] - 用于分页查询的游标，由上一次调用返回，首次调用可不填
	 * @returns {Promise<Object>} 返回群发记录列表结果
	 * @throws {Error} 当必填参数缺失时抛出错误
	 */
	async getGroupmsgListV2(options = {}) {
		if (!options.chat_type) {
			throw new Error('chat_type为必填参数');
		}
		if (!options.start_time) {
			throw new Error('start_time为必填参数');
		}
		if (!options.end_time) {
			throw new Error('end_time为必填参数');
		}

		const params = {
			chat_type: options.chat_type,
			start_time: options.start_time,
			end_time: options.end_time
		};

		if (options.creator) params.creator = options.creator;
		if (options.filter_type !== undefined) params.filter_type = options.filter_type;
		if (options.limit) params.limit = options.limit;
		if (options.cursor) params.cursor = options.cursor;

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/get_groupmsg_list_v2', 'POST', params, 'agent');
		return res;
	}

	/**
	 * 获取群发成员发送任务列表
	 * @description 获取企业群发成员发送任务列表
	 * @param {Object} options - 请求参数
	 * @param {string} options.msgid - 群发消息的id
	 * @param {number} [options.limit] - 返回的最大记录数，整型，最大值1000，默认值500
	 * @param {string} [options.cursor] - 用于分页查询的游标，由上一次调用返回，首次调用可不填
	 * @returns {Promise<Object>} 返回群发成员发送任务列表结果
	 * @throws {Error} 当必填参数缺失时抛出错误
	 */
	async getGroupmsgTask(options = {}) {
		if (!options.msgid) {
			throw new Error('msgid为必填参数');
		}

		const params = {
			msgid: options.msgid
		};

		if (options.limit) params.limit = options.limit;
		if (options.cursor) params.cursor = options.cursor;

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/get_groupmsg_task', 'POST', params, 'agent');
		return res;
	}

	/**
	 * 获取企业群发成员执行结果
	 * @description 获取企业群发成员执行结果
	 * @param {Object} options - 请求参数
	 * @param {string} options.msgid - 群发消息的id
	 * @param {string} options.userid - 发送成员userid
	 * @param {number} [options.limit] - 返回的最大记录数，整型，最大值1000，默认值500
	 * @param {string} [options.cursor] - 用于分页查询的游标，由上一次调用返回，首次调用可不填
	 * @returns {Promise<Object>} 返回群发成员执行结果
	 * @throws {Error} 当必填参数缺失时抛出错误
	 */
	async getGroupmsgSendResult(options = {}) {
		if (!options.msgid) {
			throw new Error('msgid为必填参数');
		}
		if (!options.userid) {
			throw new Error('userid为必填参数');
		}

		const params = {
			msgid: options.msgid,
			userid: options.userid
		};

		if (options.limit) params.limit = options.limit;
		if (options.cursor) params.cursor = options.cursor;

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/get_groupmsg_send_result', 'POST', params, 'agent');
		return res;
	}

	/**
	 * 发送新客户欢迎语
	 * @description 企业可通过成员向新添加的客户发送个性化的欢迎语
	 * @param {Object} options - 请求参数
	 * @param {string} options.welcome_code - 发送欢迎语的凭证，有效期20秒
	 * @param {Object} [options.text] - 文本消息内容
	 * @param {string} [options.text.content] - 消息文本内容，最长4000字节
	 * @param {Array} [options.attachments] - 附件，最多可添加9个附件
	 * @param {string} options.attachments[].msgtype - 附件类型，可选image、link、miniprogram或video
	 * @param {Object} [options.attachments[].image] - 图片类型的附件
	 * @param {string} [options.attachments[].image.media_id] - 图片的media_id
	 * @param {string} [options.attachments[].image.pic_url] - 图片的链接
	 * @param {Object} [options.attachments[].link] - 图文类型的附件
	 * @param {string} options.attachments[].link.title - 图文消息标题，最长128字节
	 * @param {string} [options.attachments[].link.picurl] - 图文消息封面url
	 * @param {string} [options.attachments[].link.desc] - 图文消息描述，最长512字节
	 * @param {string} options.attachments[].link.url - 图文消息链接
	 * @param {Object} [options.attachments[].miniprogram] - 小程序类型的附件
	 * @param {string} options.attachments[].miniprogram.title - 小程序消息标题，最长64字节
	 * @param {string} options.attachments[].miniprogram.pic_media_id - 小程序消息封面mediaid
	 * @param {string} options.attachments[].miniprogram.appid - 关联到企业的小程序appid
	 * @param {string} options.attachments[].miniprogram.page - 小程序page路径
	 * @param {Object} [options.attachments[].video] - 视频类型的附件
	 * @param {string} options.attachments[].video.media_id - 视频的media_id
	 * @param {Object} [options.attachments[].file] - 文件类型的附件
	 * @param {string} options.attachments[].file.media_id - 文件的media_id
	 * @returns {Promise<Object>} 返回发送结果
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async sendWelcomeMsg(options = {}) {
		if (!options.welcome_code) {
			throw new Error('welcome_code为必填参数');
		}

		if (!options.text && (!options.attachments || !options.attachments.length)) {
			throw new Error('text和attachments不能同时为空');
		}

		if (options.attachments && options.attachments.length > 9) {
			throw new Error('attachments最多支持9个附件');
		}

		const params = {
			welcome_code: options.welcome_code
		};

		if (options.text) {
			params.text = options.text;
		}

		if (options.attachments) {
			params.attachments = options.attachments;
		}

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/send_welcome_msg', 'POST', params, 'agent');
		return res;
	}

	/**
	 * 添加入群欢迎语素材
	 * @param {Object} options - 入群欢迎语素材配置
	 * @param {Object} [options.text] - 文本内容
	 * @param {string} [options.text.content] - 消息文本内容,最长为3000字节
	 * @param {Object} [options.image] - 图片
	 * @param {string} [options.image.media_id] - 图片的media_id
	 * @param {string} [options.image.pic_url] - 图片的链接
	 * @param {Object} [options.link] - 图文消息
	 * @param {string} options.link.title - 图文消息标题，最长为128字节
	 * @param {string} [options.link.picurl] - 图文消息封面的url
	 * @param {string} [options.link.desc] - 图文消息的描述，最长为512字节
	 * @param {string} options.link.url - 图文消息的链接
	 * @param {Object} [options.miniprogram] - 小程序消息
	 * @param {string} options.miniprogram.title - 小程序消息标题，最长为64字节
	 * @param {string} options.miniprogram.pic_media_id - 小程序消息封面的mediaid
	 * @param {string} options.miniprogram.appid - 小程序appid
	 * @param {string} options.miniprogram.page - 小程序page路径
	 * @param {Object} [options.file] - 文件
	 * @param {string} options.file.media_id - 文件id
	 * @param {Object} [options.video] - 视频
	 * @param {string} options.video.media_id - 视频媒体文件id
	 * @param {number} [options.agentid] - 授权方安装的应用agentid
	 * @param {number} [options.notify] - 是否通知成员将这条入群欢迎语应用到客户群中，0-不通知，1-通知
	 * @returns {Promise<Object>} 返回添加结果
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async addGroupWelcomeTemplate(options = {}) {
		if (!options.text && !options.image && !options.link && !options.miniprogram && !options.file && !options.video) {
			throw new Error('text、image、link、miniprogram、file、video不能全部为空');
		}

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/group_welcome_template/add', 'POST', options, 'agent');
		return res;
	}

	/**
	 * 编辑入群欢迎语素材
	 * @param {Object} options - 入群欢迎语素材配置
	 * @param {string} options.template_id - 欢迎语素材id
	 * @param {Object} [options.text] - 文本内容
	 * @param {string} [options.text.content] - 消息文本内容,最长为3000字节
	 * @param {Object} [options.image] - 图片
	 * @param {string} [options.image.media_id] - 图片的media_id
	 * @param {string} [options.image.pic_url] - 图片的链接
	 * @param {Object} [options.link] - 图文消息
	 * @param {string} options.link.title - 图文消息标题，最长为128字节
	 * @param {string} [options.link.picurl] - 图文消息封面的url
	 * @param {string} [options.link.desc] - 图文消息的描述，最长为512字节
	 * @param {string} options.link.url - 图文消息的链接
	 * @param {Object} [options.miniprogram] - 小程序消息
	 * @param {string} options.miniprogram.title - 小程序消息标题，最长为64字节
	 * @param {string} options.miniprogram.pic_media_id - 小程序消息封面的mediaid
	 * @param {string} options.miniprogram.appid - 小程序appid
	 * @param {string} options.miniprogram.page - 小程序page路径
	 * @param {Object} [options.file] - 文件
	 * @param {string} options.file.media_id - 文件id
	 * @param {Object} [options.video] - 视频
	 * @param {string} options.video.media_id - 视频媒体文件id
	 * @param {number} [options.agentid] - 授权方安装的应用agentid
	 * @returns {Promise<Object>} 返回编辑结果
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async editGroupWelcomeTemplate(options = {}) {
		if (!options.template_id) {
			throw new Error('template_id为必填参数');
		}

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/group_welcome_template/edit', 'POST', options, 'agent');
		return res;
	}

	/**
	 * 获取入群欢迎语素材
	 * @param {Object} options - 入群欢迎语素材配置
	 * @param {string} options.template_id - 群欢迎语的素材id
	 * @returns {Promise<Object>} 返回欢迎语素材详情
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async getGroupWelcomeTemplate(options = {}) {
		if (!options.template_id) {
			throw new Error('template_id为必填参数');
		}

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/group_welcome_template/get', 'POST', options, 'agent');
		return res;
	}

	/**
	 * 删除入群欢迎语素材
	 * @param {Object} options - 入群欢迎语素材配置
	 * @param {string} options.template_id - 群欢迎语的素材id
	 * @param {number} [options.agentid] - 授权方安装的应用agentid
	 * @returns {Promise<Object>} 返回删除结果
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async delGroupWelcomeTemplate(options = {}) {
		if (!options.template_id) {
			throw new Error('template_id为必填参数');
		}

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/group_welcome_template/del', 'POST', options, 'agent');
		return res;
	}
}


module.exports = Message;