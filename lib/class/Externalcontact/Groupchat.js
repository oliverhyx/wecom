const Base = require('../Base');

/**
 * 客户群管理
 * @description 企业微信客户群管理相关接口，用于获取客户群列表、客户群详情、客户群统计数据等
 * @public {function} getGroupchatList - 获取客户群列表
 * @public {function} getGroupchatDetail - 获取客户群详情
 * @public {function} opengidToChatid - 客户群opengid转换
 */
class Groupchat extends Base {
	constructor() {
		super();
	}

	/**
	 * 获取客户群列表
	 * @description 获取配置过客户群管理的客户群列表
	 * @param {Object} options - 请求选项
	 * @param {number} [options.status_filter=0] - 客户群跟进状态过滤。0-所有列表(不过滤)，1-离职待继承，2-离职继承中，3-离职继承完成
	 * @param {Object} [options.owner_filter] - 群主过滤
	 * @param {string[]} [options.owner_filter.userid_list] - 用户ID列表，最多100个
	 * @param {string} [options.cursor] - 用于分页查询的游标，由上一次调用返回，首次调用不填
	 * @param {number} options.limit - 预期请求的数据量，取值范围 1 ~ 1000
	 * @returns {Promise<Object>} 包含客户群列表的对象
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async getGroupchatList(options) {
		// 参数验证
		if (!options || typeof options !== 'object') {
			throw new Error('参数必须是一个对象');
		}
		
		if (!options.limit) {
			throw new Error('分页大小不能为空');
		}
		
		if (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 1000) {
			throw new Error('分页大小必须是1到1000之间的整数');
		}
		
		// 验证status_filter
		if (options.status_filter !== undefined) {
			if (![0, 1, 2, 3].includes(options.status_filter)) {
				throw new Error('客户群跟进状态过滤值无效，必须是0、1、2或3');
			}
		}
		
		// 验证owner_filter
		if (options.owner_filter) {
			if (typeof options.owner_filter !== 'object') {
				throw new Error('群主过滤必须是一个对象');
			}
			
			if (options.owner_filter.userid_list) {
				if (!Array.isArray(options.owner_filter.userid_list)) {
					throw new Error('用户ID列表必须是数组');
				}
    
				if (options.owner_filter.userid_list.length > 100) {
					throw new Error('用户ID列表不能超过100个');
				}
			}
		}
		
		const params = {
			limit: options.limit
		};
		
		// 添加可选参数
		if (options.status_filter !== undefined) {
			params.status_filter = options.status_filter;
		}
		
		if (options.owner_filter) {
			params.owner_filter = options.owner_filter;
		}
		
		if (options.cursor) {
			params.cursor = options.cursor;
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/list', 'POST', params, 'agent');
		return res;
	}

	/**
	 * 获取客户群详情
	 * @description 通过客户群ID，获取详情。包括群名、群成员列表、群成员入群时间、入群方式等
	 * @param {Object} options - 请求选项
	 * @param {string} options.chat_id - 客户群ID
	 * @param {number} [options.need_name] - 是否需要返回群成员的名字。0-不返回；1-返回。默认不返回
	 * @returns {Promise<Object>} 包含客户群详情的对象
	 * @throws {Error} 当参数格式错误时抛出错误
	 * @example
	 * // 返回结果示例:
	 * // {
	 * //   "errcode": 0,
	 * //   "errmsg": "ok",
	 * //   "group_chat": {
	 * //     "chat_id": "wrOgQhDgAAMYQiS5ol9G7gK9JVAAAA",
	 * //     "name": "销售客服群",
	 * //     "owner": "ZhuShengBen",
	 * //     "create_time": 1572505490,
	 * //     "notice": "文明沟通，拒绝脏话",
	 * //     "member_list": [...],
	 * //     "admin_list": [...],
	 * //     "member_version": "71217227bbd112ecfe3a49c482195cb4"
	 * //   }
	 * // }
	 */
	async getGroupchatDetail(options) {
		// 参数验证
		if (!options || typeof options !== 'object') {
			throw new Error('参数必须是一个对象');
		}
		
		if (!options.chat_id) {
			throw new Error('客户群ID不能为空');
		}
		
		// 验证need_name参数
		if (options.need_name !== undefined && ![0, 1].includes(options.need_name)) {
			throw new Error('need_name参数必须是0或1');
		}
		
		const params = {
			chat_id: options.chat_id
		};
		
		// 添加可选参数
		if (options.need_name !== undefined) {
			params.need_name = options.need_name;
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/groupchat/get', 'POST', params, 'agent');
		return res;
	}

	/**
	 * 客户群opengid转换
	 * @description 将小程序获取到的群ID(opengid)转换为企业微信的客户群ID(chat_id)
	 * @param {string} opengid - 小程序在微信获取到的群ID，参见wx.getGroupEnterInfo
	 * @returns {Promise<Object>} 包含客户群ID的对象
	 * @throws {Error} 当参数格式错误时抛出错误
	 * @example
	 * // 返回结果示例:
	 * // {
	 * //   "errcode": 0,
	 * //   "errmsg": "ok",
	 * //   "chat_id": "ooAAAAAAAAAAA"
	 * // }
	 */
	async opengidToChatid(opengid) {
		// 参数验证
		if (!opengid) {
			throw new Error('群ID(opengid)不能为空');
		}
		
		const params = {
			opengid: opengid
		};
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/externalcontact/opengid_to_chatid', 'POST', params, 'agent');
		return res;
	}
}


module.exports = Groupchat;