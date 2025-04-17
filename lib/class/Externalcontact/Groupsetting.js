const Base = require('../Base');

/**
 * 客户群「加入群聊」管理
 * @description 企业可通过接口配置客户群「加入群聊」的方式。配置后，客户通过扫描群二维码或点击小程序上的按钮，即可进入企业的客户群
 * @public {function} addJoinWay - 配置客户群进群方式
 * @public {function} getJoinWay - 获取客户群进群方式配置
 * @public {function} updateJoinWay - 更新客户群进群方式配置
 * @public {function} deleteJoinWay - 删除客户群进群方式配置
 */
class Groupsetting extends Base {
	constructor() {
		super();
	}


	/**
	 * 配置客户群进群方式
	 * @description 生成并配置「加入群聊」的二维码或者小程序按钮
	 * @param {Object} options - 配置参数
	 * @param {number} options.scene - 必填，场景。1-群的小程序插件，2-群的二维码插件
	 * @param {string[]} options.chat_id_list - 必填，使用该配置的客户群ID列表，最多支持5个
	 * @param {string} [options.remark] - 联系方式的备注信息，用于助记，超过30个字符将被截断
	 * @param {number} [options.auto_create_room=1] - 当群满了后，是否自动新建群。0-否；1-是
	 * @param {string} [options.room_base_name] - 自动建群的群名前缀，当auto_create_room为1时有效，最长40个utf8字符
	 * @param {number} [options.room_base_id] - 自动建群的群起始序号，当auto_create_room为1时有效
	 * @param {string} [options.state] - 企业自定义的state参数，用于区分不同的入群渠道，不超过30个UTF-8字符
	 * @returns {Promise<Object>} 返回的结果对象，包含config_id
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async addJoinWay(options) {
		if (!options || typeof options !== 'object') {
			throw new Error('参数必须是一个对象');
		}

		if (!options.scene || ![1, 2].includes(options.scene)) {
			throw new Error('scene参数无效，必须是1或2');
		}

		if (!options.chat_id_list || !Array.isArray(options.chat_id_list) || options.chat_id_list.length === 0 || options.chat_id_list.length > 5) {
			throw new Error('chat_id_list必须是包含1-5个群ID的数组');
		}

		const params = {
			scene: options.scene,
			chat_id_list: options.chat_id_list
		};

		// 添加可选参数
		if (options.remark !== undefined) params.remark = options.remark;
		if (options.auto_create_room !== undefined) params.auto_create_room = options.auto_create_room;
		if (options.room_base_name !== undefined) params.room_base_name = options.room_base_name;
		if (options.room_base_id !== undefined) params.room_base_id = options.room_base_id;
		if (options.state !== undefined) params.state = options.state;

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/add_join_way', 'POST', params, 'agent');
		return res;
	}

	/**
	 * 获取客户群进群方式配置
	 * @description 获取企业配置的群二维码或小程序按钮
	 * @param {string} configId - 配置id
	 * @returns {Promise<Object>} 返回的结果对象，包含配置详情
	 * @throws {Error} 当参数缺失时抛出错误
	 */
	async getJoinWay(configId) {
		if (!configId) {
			throw new Error('configId不能为空');
		}

		const params = {
			config_id: configId
		};

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/get_join_way', 'POST', params, 'agent');
		return res;
	}

	/**
	 * 更新客户群进群方式配置
	 * @description 更新进群方式配置信息(使用覆盖的方式更新)
	 * @param {Object} options - 配置参数
	 * @param {string} options.config_id - 必填，企业联系方式的配置id
	 * @param {number} options.scene - 必填，场景。1-群的小程序插件，2-群的二维码插件
	 * @param {string[]} options.chat_id_list - 必填，使用该配置的客户群ID列表，最多支持5个
	 * @param {string} [options.remark] - 联系方式的备注信息，用于助记，超过30个字符将被截断
	 * @param {number} [options.auto_create_room] - 当群满了后，是否自动新建群。0-否；1-是
	 * @param {string} [options.room_base_name] - 自动建群的群名前缀，当auto_create_room为1时有效，最长40个utf8字符
	 * @param {number} [options.room_base_id] - 自动建群的群起始序号，当auto_create_room为1时有效
	 * @param {string} [options.state] - 企业自定义的state参数，用于区分不同的入群渠道，不超过30个UTF-8字符
	 * @returns {Promise<Object>} 返回的结果对象
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async updateJoinWay(options) {
		if (!options || typeof options !== 'object') {
			throw new Error('参数必须是一个对象');
		}

		if (!options.config_id) {
			throw new Error('config_id不能为空');
		}

		if (!options.scene || ![1, 2].includes(options.scene)) {
			throw new Error('scene参数无效，必须是1或2');
		}

		if (!options.chat_id_list || !Array.isArray(options.chat_id_list) || options.chat_id_list.length === 0 || options.chat_id_list.length > 5) {
			throw new Error('chat_id_list必须是包含1-5个群ID的数组');
		}

		const params = {
			config_id: options.config_id,
			scene: options.scene,
			chat_id_list: options.chat_id_list
		};

		// 添加可选参数
		if (options.remark !== undefined) params.remark = options.remark;
		if (options.auto_create_room !== undefined) params.auto_create_room = options.auto_create_room;
		if (options.room_base_name !== undefined) params.room_base_name = options.room_base_name;
		if (options.room_base_id !== undefined) params.room_base_id = options.room_base_id;
		if (options.state !== undefined) params.state = options.state;

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/update_join_way', 'POST', params, 'agent');
		return res;
	}

	/**
	 * 删除客户群进群方式配置
	 * @description 删除一个进群方式配置
	 * @param {string} configId - 企业联系方式的配置id
	 * @returns {Promise<Object>} 返回的结果对象
	 * @throws {Error} 当参数缺失时抛出错误
	 */
	async deleteJoinWay(configId) {
		if (!configId) {
			throw new Error('configId不能为空');
		}

		const params = {
			config_id: configId
		};

		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/del_join_way', 'POST', params, 'agent');
		return res;
	}
}


module.exports = Groupsetting;