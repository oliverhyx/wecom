const Base = require('../Base');

/**
 * 异步导入通讯录相关功能
 * @public {function} syncUser - 增量更新成员
 * @public {function} replaceUser - 全量覆盖成员
 * @public {function} replaceParty - 全量覆盖部门
 * @public {function} getBatchResult - 获取异步任务结果
 */
class Asyncimport extends Base {
	constructor() {
		super();
	}

	/**
	 * 增量更新成员
	 * @description 以userid为主键，增量更新企业微信通讯录成员
	 * @param {Object} options - 更新选项
	 * @param {string} options.media_id - 上传的csv文件的media_id
	 * @param {boolean} [options.to_invite=true] - 是否邀请新建的成员使用企业微信
	 * @param {Object} [options.callback] - 回调信息
	 * @param {string} [options.callback.url] - 企业应用接收企业微信推送请求的访问协议和地址
	 * @param {string} [options.callback.token] - 用于生成签名
	 * @param {string} [options.callback.encodingaeskey] - 用于消息体的加密，是AES密钥的Base64编码
	 * @returns {Promise<Object>} 包含jobid的对象
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async syncUser(options) {
		// 参数验证
		if (!options || !options.media_id) {
			throw new Error('media_id不能为空');
		}
		
		if (typeof options.media_id !== 'string') {
			throw new Error('media_id必须是字符串');
		}
		
		const params = {
			media_id: options.media_id
		};
		
		// 添加可选参数
		if (options.to_invite !== undefined) {
			params.to_invite = !!options.to_invite;
		}
		
		// 处理回调信息
		if (options.callback) {
			if (typeof options.callback !== 'object') {
				throw new Error('callback必须是对象');
			}
			
			params.callback = {};
			
			if (options.callback.url) {
				if (typeof options.callback.url !== 'string') {
					throw new Error('callback.url必须是字符串');
				}
				params.callback.url = options.callback.url;
			}
			
			if (options.callback.token) {
				if (typeof options.callback.token !== 'string') {
					throw new Error('callback.token必须是字符串');
				}
				params.callback.token = options.callback.token;
			}
			
			if (options.callback.encodingaeskey) {
				if (typeof options.callback.encodingaeskey !== 'string') {
					throw new Error('callback.encodingaeskey必须是字符串');
				}
				params.callback.encodingaeskey = options.callback.encodingaeskey;
			}
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/batch/syncuser', 'POST', params, 'concat');
		return res;
	}

	/**
	 * 全量覆盖成员
	 * @description 以userid为主键，全量覆盖企业的通讯录成员，任务完成后企业的通讯录成员与提交的文件完全保持一致
	 * @param {Object} options - 导入选项
	 * @param {string} options.media_id - 上传的csv文件的media_id
	 * @param {boolean} [options.to_invite=true] - 是否邀请新建的成员使用企业微信
	 * @param {Object} [options.callback] - 回调信息
	 * @param {string} [options.callback.url] - 企业应用接收企业微信推送请求的访问协议和地址
	 * @param {string} [options.callback.token] - 用于生成签名
	 * @param {string} [options.callback.encodingaeskey] - 用于消息体的加密，是AES密钥的Base64编码
	 * @returns {Promise<Object>} 包含jobid的对象
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async replaceUser(options) {
		// 参数验证
		if (!options) {
			throw new Error('导入选项不能为空');
		}
		
		if (!options.media_id) {
			throw new Error('media_id不能为空');
		}
		
		if (typeof options.media_id !== 'string') {
			throw new Error('media_id必须是字符串');
		}
		
		const params = {
			media_id: options.media_id
		};
		
		// 添加可选参数
		if (options.to_invite !== undefined) {
			params.to_invite = !!options.to_invite;
		}
		
		// 处理回调信息
		if (options.callback) {
			if (typeof options.callback !== 'object') {
				throw new Error('callback必须是对象');
			}
			
			params.callback = {};
			
			if (options.callback.url) {
				if (typeof options.callback.url !== 'string') {
					throw new Error('callback.url必须是字符串');
				}
				params.callback.url = options.callback.url;
			}
			
			if (options.callback.token) {
				if (typeof options.callback.token !== 'string') {
					throw new Error('callback.token必须是字符串');
				}
				params.callback.token = options.callback.token;
			}
			
			if (options.callback.encodingaeskey) {
				if (typeof options.callback.encodingaeskey !== 'string') {
					throw new Error('callback.encodingaeskey必须是字符串');
				}
				params.callback.encodingaeskey = options.callback.encodingaeskey;
			}
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/batch/replaceuser', 'POST', params, 'concat');
		return res;
	}
    
	/**
	 * 全量覆盖部门
	 * @description 以partyid为键，全量覆盖企业的通讯录组织架构
	 * @param {Object} options - 导入选项
	 * @param {string} options.media_id - 上传的csv文件的media_id
	 * @param {Object} [options.callback] - 回调信息
	 * @param {string} [options.callback.url] - 企业应用接收企业微信推送请求的访问协议和地址，支持http或https协议
	 * @param {string} [options.callback.token] - 用于生成签名
	 * @param {string} [options.callback.encodingaeskey] - 用于消息体的加密，是AES密钥的Base64编码
	 * @returns {Promise<Object>} 包含jobid的对象
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async replaceParty(options) {
		// 参数验证
		if (!options) {
			throw new Error('导入选项不能为空');
		}
		
		if (!options.media_id) {
			throw new Error('media_id不能为空');
		}
		
		if (typeof options.media_id !== 'string') {
			throw new Error('media_id必须是字符串');
		}
		
		const params = {
			media_id: options.media_id
		};
		
		// 处理回调信息
		if (options.callback) {
			if (typeof options.callback !== 'object') {
				throw new Error('callback必须是对象');
			}
			
			params.callback = {};
			
			if (options.callback.url) {
				if (typeof options.callback.url !== 'string') {
					throw new Error('callback.url必须是字符串');
				}
				params.callback.url = options.callback.url;
			}
			
			if (options.callback.token) {
				if (typeof options.callback.token !== 'string') {
					throw new Error('callback.token必须是字符串');
				}
				params.callback.token = options.callback.token;
			}
			
			if (options.callback.encodingaeskey) {
				if (typeof options.callback.encodingaeskey !== 'string') {
					throw new Error('callback.encodingaeskey必须是字符串');
				}
				params.callback.encodingaeskey = options.callback.encodingaeskey;
			}
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/batch/replaceparty', 'POST', params, 'concat');
		return res;
	}

	/**
	 * 获取异步任务结果
	 * @description 获取已提交的异步任务的执行结果
	 * @param {string} jobid - 异步任务id，最大长度为64字节
	 * @returns {Promise<Object>} 包含任务状态和结果的对象
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async getBatchResult(jobid) {
		// 参数验证
		if (!jobid) {
			throw new Error('任务ID不能为空');
		}
		
		if (typeof jobid !== 'string') {
			throw new Error('任务ID必须是字符串');
		}
		
		if (jobid.length > 64) {
			throw new Error('任务ID长度不能超过64字节');
		}
		
		// 构建请求URL
		const url = `https://qyapi.weixin.qq.com/cgi-bin/batch/getresult?jobid=${jobid}`;
		
		const res = await this.curl(url, 'GET', null, 'concat');
		return res;
		
		/* 返回结果示例:
		{
			"errcode": 0,
			"errmsg": "ok",
			"status": 1,        // 任务状态：1表示任务开始，2表示任务进行中，3表示任务已完成
			"type": "replace_user", // 操作类型：sync_user(增量更新成员)、replace_user(全量覆盖成员)、replace_party(全量覆盖部门)
			"total": 3,         // 任务运行总条数
			"percentage": 33,   // 目前运行百分比，当任务完成时为100
			"result": []        // 详细的处理结果，当任务完成后此字段有效
		}
		*/
	}
}


module.exports = Asyncimport;