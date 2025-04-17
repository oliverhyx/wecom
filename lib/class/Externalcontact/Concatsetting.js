const Base = require('../Base');

/**
 * 联系我与客户入群方式
 * @public {function} addContactWay - 添加企业客户联系方式
 * @public {function} getContactWay - 获取企业已配置的「联系我」方式
 * @public {function} listContactWay - 获取企业已配置的「联系我」列表
 * @public {function} updateContactWay - 更新企业已配置的「联系我」方式
 * @public {function} deleteContactWay - 删除企业已配置的「联系我」方式
 * @public {function} closeTempChat - 结束临时会话
 */
class Concatsetting extends Base {
	constructor() {
		super();
	}

	/**
	 * 添加企业客户联系方式
	 * @description 配置客户联系「联系我」方式
	 * @param {Object} options - 配置参数
	 * @param {number} options.type - 必填，联系方式类型,1-单人, 2-多人
	 * @param {number} options.scene - 必填，场景，1-在小程序中联系，2-通过二维码联系
	 * @param {number} [options.style] - 在小程序中联系时使用的控件样式
	 * @param {string} [options.remark] - 联系方式的备注信息，用于助记，不超过30个字符
	 * @param {boolean} [options.skip_verify] - 外部客户添加时是否无需验证，默认为true
	 * @param {string} [options.state] - 企业自定义的state参数，用于区分不同的添加渠道，不超过30个字符
	 * @param {string[]} [options.user] - 使用该联系方式的用户userID列表，在type为1时为必填，且只能有一个
	 * @param {number[]} [options.party] - 使用该联系方式的部门id列表，只在type为2时有效
	 * @param {boolean} [options.is_temp] - 是否临时会话模式，默认为false
	 * @param {number} [options.expires_in] - 临时会话二维码有效期，以秒为单位，默认7天
	 * @param {number} [options.chat_expires_in] - 临时会话有效期，以秒为单位，默认24小时
	 * @param {string} [options.unionid] - 可进行临时会话的客户unionid
	 * @param {boolean} [options.is_exclusive] - 是否开启同一外部企业客户只能添加同一个员工
	 * @param {Object} [options.conclusions] - 结束语，会话结束时自动发送给客户
	 * @returns {Promise<Object>} 返回的结果对象
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async addContactWay(options) {
		if (!options || typeof options !== 'object') {
			throw new Error('参数必须是一个对象');
		}

		if (!options.type || ![1, 2].includes(options.type)) {
			throw new Error('type参数无效，必须是1或2');
		}

		if (!options.scene || ![1, 2].includes(options.scene)) {
			throw new Error('scene参数无效，必须是1或2');
		}

		if (options.type === 1 && (!options.user || !Array.isArray(options.user) || options.user.length !== 1)) {
			throw new Error('type为1时，user必须是只包含一个用户ID的数组');
		}

		const params = {
			type: options.type,
			scene: options.scene
		};

		// 添加可选参数
		if (options.style !== undefined) params.style = options.style;
		if (options.remark !== undefined) params.remark = options.remark;
		if (options.skip_verify !== undefined) params.skip_verify = options.skip_verify;
		if (options.state !== undefined) params.state = options.state;
		if (options.user !== undefined) params.user = options.user;
		if (options.party !== undefined) params.party = options.party;
		if (options.is_temp !== undefined) params.is_temp = options.is_temp;
		if (options.expires_in !== undefined) params.expires_in = options.expires_in;
		if (options.chat_expires_in !== undefined) params.chat_expires_in = options.chat_expires_in;
		if (options.unionid !== undefined) params.unionid = options.unionid;
		if (options.is_exclusive !== undefined) params.is_exclusive = options.is_exclusive;
		if (options.conclusions !== undefined) params.conclusions = options.conclusions;

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/add_contact_way', 'POST', params, 'agent');
		return res;
	}

	/**
	 * 获取企业已配置的「联系我」方式
	 * @param {string} configId - 联系方式的配置id
	 * @returns {Promise<Object>} 返回的结果对象
	 * @throws {Error} 当参数缺失时抛出错误
	 */
	async getContactWay(configId) {
		if (!configId) {
			throw new Error('configId不能为空');
		}

		const params = {
			config_id: configId
		};

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/get_contact_way', 'POST', params, 'agent');
		return res;
	}

	/**
	 * 获取企业已配置的「联系我」列表
	 * @param {Object} [options] - 查询参数
	 * @param {number} [options.start_time] - 「联系我」创建起始时间戳
	 * @param {number} [options.end_time] - 「联系我」创建结束时间戳
	 * @param {string} [options.cursor] - 分页查询游标
	 * @param {number} [options.limit] - 每次查询的分页大小，默认100，最多1000
	 * @returns {Promise<Object>} 返回的结果对象
	 */
	async listContactWay(options = {}) {
		const params = {};
		
		if (options.start_time) params.start_time = options.start_time;
		if (options.end_time) params.end_time = options.end_time;
		if (options.cursor) params.cursor = options.cursor;
		if (options.limit) params.limit = options.limit;

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/list_contact_way', 'POST', params, 'agent');
		return res;
	}

	/**
	 * 更新企业已配置的「联系我」方式
	 * @param {Object} options - 更新参数
	 * @param {string} options.config_id - 必填，企业联系方式的配置id
	 * @param {string} [options.remark] - 联系方式的备注信息
	 * @param {boolean} [options.skip_verify] - 外部客户添加时是否无需验证
	 * @param {number} [options.style] - 样式
	 * @param {string} [options.state] - 企业自定义的state参数
	 * @param {string[]} [options.user] - 使用该联系方式的用户列表
	 * @param {number[]} [options.party] - 使用该联系方式的部门列表
	 * @param {number} [options.expires_in] - 临时会话二维码有效期
	 * @param {number} [options.chat_expires_in] - 临时会话有效期
	 * @param {string} [options.unionid] - 可进行临时会话的客户unionid
	 * @param {Object} [options.conclusions] - 结束语
	 * @returns {Promise<Object>} 返回的结果对象
	 * @throws {Error} 当必填参数缺失时抛出错误
	 */
	async updateContactWay(options) {
		if (!options || !options.config_id) {
			throw new Error('config_id不能为空');
		}

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/update_contact_way', 'POST', options, 'agent');
		return res;
	}

	/**
	 * 删除企业已配置的「联系我」方式
	 * @param {string} configId - 企业联系方式的配置id
	 * @returns {Promise<Object>} 返回的结果对象
	 * @throws {Error} 当参数缺失时抛出错误
	 */
	async deleteContactWay(configId) {
		if (!configId) {
			throw new Error('configId不能为空');
		}

		const params = {
			config_id: configId
		};

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/del_contact_way', 'POST', params, 'agent');
		return res;
	}

	/**
	 * 结束临时会话
	 * @param {string} userId - 企业成员的userid
	 * @param {string} externalUserId - 客户的外部联系人userid
	 * @returns {Promise<Object>} 返回的结果对象
	 * @throws {Error} 当参数缺失时抛出错误
	 */
	async closeTempChat(userId, externalUserId) {
		if (!userId) {
			throw new Error('userId不能为空');
		}
		if (!externalUserId) {
			throw new Error('externalUserId不能为空');
		}

		const params = {
			userid: userId,
			external_userid: externalUserId
		};

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/close_temp_chat', 'POST', params, 'agent');
		return res;
	}

}


module.exports = Concatsetting;