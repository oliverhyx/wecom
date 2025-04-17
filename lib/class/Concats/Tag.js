const Base = require('../Base');

/**
 * 标签管理
 * @public {function} createTag - 创建标签
 * @public {function} updateTag - 更新标签名字
 * @public {function} deleteTag - 删除标签
 * @public {function} addTagUsers - 增加标签成员
 * @public {function} deleteTagUsers - 删除标签成员
 * @public {function} getTagUsers - 获取标签成员
 * @public {function} getTagList - 获取标签列表
 */
class Tag extends Base {
	constructor() {
		super();
	}

	/**
	 * 创建标签
	 * @description 创建企业标签
	 * @param {Object} tag - 标签信息
	 * @param {string} tag.tagname - 标签名称，长度限制为32个字以内（汉字或英文字母），标签名不可与其他标签重名
	 * @param {number} [tag.tagid] - 标签id，非负整型，指定此参数时新增的标签会生成对应的标签id，不指定时则以目前最大的id自增
	 * @returns {Promise<Object>} 包含创建的标签id的对象
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async createTag(tag) {
		// 参数验证
		if (!tag.tagname) {
			throw new Error('标签名称不能为空');
		}
		
		if (tag.tagname.length > 32) {
			throw new Error('标签名称不能超过32个字');
		}
		
		if (tag.tagid !== undefined) {
			if (!Number.isInteger(tag.tagid) || tag.tagid < 0) {
				throw new Error('标签ID必须是非负整数');
			}
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/tag/create', 'POST', tag, 'concat');
		return res;
	}

	/**
	 * 更新标签名字
	 * @description 更新企业标签名称
	 * @param {Object} tag - 标签信息
	 * @param {number} tag.tagid - 标签ID
	 * @param {string} tag.tagname - 标签名称，长度限制为32个字（汉字或英文字母），标签不可与其他标签重名
	 * @returns {Promise<Object>} 更新结果
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async updateTag(tag) {
		// 参数验证
		if (tag.tagid === undefined) {
			throw new Error('标签ID不能为空');
		}
		
		if (!Number.isInteger(tag.tagid)) {
			throw new Error('标签ID必须是整数');
		}
		
		if (!tag.tagname) {
			throw new Error('标签名称不能为空');
		}
		
		if (tag.tagname.length > 32) {
			throw new Error('标签名称不能超过32个字');
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/tag/update', 'POST', tag, 'concat');
		return res;
	}

	/**
	 * 删除标签
	 * @description 删除企业标签
	 * @param {number} tagid - 标签ID
	 * @returns {Promise<Object>} 删除结果
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async deleteTag(tagid) {
		// 参数验证
		if (tagid === undefined) {
			throw new Error('标签ID不能为空');
		}
		
		if (!Number.isInteger(tagid)) {
			throw new Error('标签ID必须是整数');
		}
		
		if (tagid < 0) {
			throw new Error('标签ID必须是非负整数');
		}
		
		const res = await this.curl(`https://qyapi.weixin.qq.com/cgi-bin/tag/delete?tagid=${tagid}`, 'GET', null, 'concat');
		return res;
	}

	/**
	 * 获取标签成员
	 * @description 获取标签下的成员列表
	 * @param {number} tagid - 标签ID
	 * @returns {Promise<Object>} 包含标签成员信息的对象
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async getTagUsers(tagid) {
		// 参数验证
		if (tagid === undefined) {
			throw new Error('标签ID不能为空');
		}
		
		if (!Number.isInteger(tagid)) {
			throw new Error('标签ID必须是整数');
		}
		
		if (tagid < 0) {
			throw new Error('标签ID必须是非负整数');
		}
		
		const res = await this.curl(`https://qyapi.weixin.qq.com/cgi-bin/tag/get?tagid=${tagid}`, 'GET', null, 'concat');
		return res;
	}

	/**
	 * 增加标签成员
	 * @description 向企业标签中添加成员或部门
	 * @param {Object} options - 请求选项
	 * @param {number} options.tagid - 标签ID
	 * @param {string[]} [options.userlist] - 企业成员ID列表，单次请求个数不超过1000
	 * @param {number[]} [options.partylist] - 企业部门ID列表，单次请求个数不超过100
	 * @returns {Promise<Object>} 添加结果，可能包含无效的成员或部门列表
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async addTagUsers(options) {
		// 参数验证
		if (!options || typeof options !== 'object') {
			throw new Error('参数必须是一个对象');
		}
		
		if (options.tagid === undefined) {
			throw new Error('标签ID不能为空');
		}
		
		if (!Number.isInteger(options.tagid)) {
			throw new Error('标签ID必须是整数');
		}
		
		if (options.tagid < 0) {
			throw new Error('标签ID必须是非负整数');
		}
		
		// userlist和partylist不能同时为空
		if ((!options.userlist || !options.userlist.length) && 
			(!options.partylist || !options.partylist.length)) {
			throw new Error('成员列表和部门列表不能同时为空');
		}
		
		// 验证userlist
		if (options.userlist) {
			if (!Array.isArray(options.userlist)) {
				throw new Error('成员列表必须是数组');
			}
			
			if (options.userlist.length > 1000) {
				throw new Error('成员列表不能超过1000个');
			}
		}
		
		// 验证partylist
		if (options.partylist) {
			if (!Array.isArray(options.partylist)) {
				throw new Error('部门列表必须是数组');
			}
			
			if (options.partylist.length > 100) {
				throw new Error('部门列表不能超过100个');
			}
			
			// 验证部门ID是否都是整数
			for (const partyId of options.partylist) {
				if (!Number.isInteger(partyId)) {
					throw new Error('部门ID必须是整数');
				}
			}
		}
		
		const params = {
			tagid: options.tagid
		};
		
		if (options.userlist && options.userlist.length) {
			params.userlist = options.userlist;
		}
		
		if (options.partylist && options.partylist.length) {
			params.partylist = options.partylist;
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/tag/addtagusers', 'POST', params, 'concat');
		return res;
	}

	/**
	 * 删除标签成员
	 * @description 删除标签成员
	 * @param {Object} options - 删除选项
	 * @param {number} options.tagid - 标签ID
	 * @param {string[]} [options.userlist] - 企业成员ID列表，单次请求长度不超过1000
	 * @param {number[]} [options.partylist] - 企业部门ID列表，单次请求长度不超过100
	 * @returns {Promise<Object>} 删除结果，可能包含invalidlist和invalidparty
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async deleteTagUsers(options) {
		// 参数验证
		if (!options.tagid) {
			throw new Error('标签ID不能为空');
		}
		
		if (!Number.isInteger(options.tagid)) {
			throw new Error('标签ID必须是整数');
		}
		
		if ((!options.userlist || !options.userlist.length) && 
			(!options.partylist || !options.partylist.length)) {
			throw new Error('成员列表和部门列表不能同时为空');
		}
		
		// 验证userlist
		if (options.userlist) {
			if (!Array.isArray(options.userlist)) {
				throw new Error('成员列表必须是数组');
			}
			
			if (options.userlist.length > 1000) {
				throw new Error('成员列表不能超过1000个');
			}
		}
		
		// 验证partylist
		if (options.partylist) {
			if (!Array.isArray(options.partylist)) {
				throw new Error('部门列表必须是数组');
			}
			
			if (options.partylist.length > 100) {
				throw new Error('部门列表不能超过100个');
			}
			
			// 验证部门ID是否都是整数
			for (const partyId of options.partylist) {
				if (!Number.isInteger(partyId)) {
					throw new Error('部门ID必须是整数');
				}
			}
		}
		
		const params = {
			tagid: options.tagid
		};
		
		if (options.userlist && options.userlist.length) {
			params.userlist = options.userlist;
		}
		
		if (options.partylist && options.partylist.length) {
			params.partylist = options.partylist;
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/tag/deltagusers', 'POST', params, 'concat');
		return res;
	}

	/**
	 * 获取标签列表
	 * @description 获取企业标签库中的所有标签
	 * @returns {Promise<Object>} 包含标签列表的对象
	 */
	async getTagList() {
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/tag/list', 'GET', null, 'concat');
		return res;
	}
}


module.exports = Tag;