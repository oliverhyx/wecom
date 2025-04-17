const Base = require('../Base');

/**
 * 成员管理
 * @public {function} createUser - 创建成员
 * @public {function} getUser - 读取成员信息
 * @public {function} updateUser - 更新成员信息
 * @public {function} deleteUser - 删除成员
 * @public {function} batchDeleteUser - 批量删除成员
 * @public {function} getDepartmentUsers - 获取部门成员
 * @public {function} getDepartmentUserDetails - 获取部门成员详情
 * @public {function} convertToOpenid - 将企业微信的userid转成openid
 * @public {function} convertToUserid - 将openid转成企业微信的userid
 * @public {function} authSucc - 二次验证
 * @public {function} inviteUser - 邀请成员
 * @public {function} getJoinQrcode - 获取加入企业二维码
 * @public {function} getUseridByMobile - 通过手机号获取userid
 * @public {function} getUseridByEmail - 通过邮箱获取userid
 * @public {function} listUserIds - 获取成员ID列表
 * 
 */
class User extends Base {
	constructor() {
		super();
	}

	/**
	 * 创建成员
	 * @description 创建企业微信成员
	 * @param {Object} params - 创建成员的参数
	 * @param {string} params.userid - 成员UserID。企业内必须唯一，长度为1~64个字节
	 * @param {string} params.name - 成员名称。长度为1~64个utf8字符
	 * @param {string} [params.alias] - 成员别名。长度1~64个utf8字符
	 * @param {string} [params.mobile] - 手机号码。企业内必须唯一，mobile/email二者不能同时为空
	 * @param {number[]} [params.department] - 成员所属部门id列表，不超过100个
	 * @param {number[]} [params.order] - 部门内的排序值，默认为0，个数必须和参数department的个数一致
	 * @param {string} [params.position] - 职务信息。长度为0~128个字符
	 * @param {string} [params.gender] - 性别。1表示男性，2表示女性
	 * @param {string} [params.email] - 邮箱。企业内必须唯一，mobile/email二者不能同时为空
	 * @param {string} [params.biz_mail] - 企业邮箱。如果企业已开通腾讯企业邮，可创建企业邮箱账号
	 * @param {string} [params.telephone] - 座机。32字节以内，由纯数字、"-"、"+"或","组成
	 * @param {number[]} [params.is_leader_in_dept] - 是否为部门负责人，个数必须和参数department的个数一致
	 * @param {string[]} [params.direct_leader] - 直属上级UserID，设置范围为企业内成员，可以设置最多1个上级
	 * @param {string} [params.avatar_mediaid] - 成员头像的mediaid
	 * @param {number} [params.enable] - 启用/禁用成员。1表示启用成员，0表示禁用成员
	 * @param {Object} [params.extattr] - 扩展属性
	 * @param {boolean} [params.to_invite] - 是否邀请该成员使用企业微信，默认值为true
	 * @param {string} [params.external_position] - 对外职务，长度12个汉字内
	 * @param {Object} [params.external_profile] - 成员对外属性
	 * @param {string} [params.address] - 地址。长度最大128个字符
	 * @param {number} [params.main_department] - 主部门
	 * @returns {Promise<Object>} 创建结果
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async createUser(params) {
		// 参数验证
		if (!params.userid) {
			throw new Error('成员UserID不能为空');
		}
		
		if (!/^[a-zA-Z0-9_\-\.@]{1,64}$/.test(params.userid) || !/^[a-zA-Z0-9]/.test(params.userid)) {
			throw new Error('UserID格式不正确，只能由数字、字母和"_-@."四种字符组成，且第一个字符必须是数字或字母');
		}
		
		if (!params.name) {
			throw new Error('成员名称不能为空');
		}
		
		if (Buffer.from(params.name).length > 64) {
			throw new Error('成员名称长度不能超过64个utf8字符');
		}
		
		if (!params.mobile && !params.email) {
			throw new Error('手机号码和邮箱不能同时为空');
		}
		
		if (params.department && params.department.length > 100) {
			throw new Error('部门ID列表不能超过100个');
		}
		
		if (params.order && params.department && params.order.length !== params.department.length) {
			throw new Error('部门排序值的个数必须和部门ID列表的个数一致');
		}
		
		if (params.is_leader_in_dept && params.department && params.is_leader_in_dept.length !== params.department.length) {
			throw new Error('部门负责人标识的个数必须和部门ID列表的个数一致');
		}
		
		if (params.position && Buffer.from(params.position).length > 128) {
			throw new Error('职务信息长度不能超过128个字符');
		}
		
		if (params.external_position && Buffer.from(params.external_position).length > 36) {
			throw new Error('对外职务长度不能超过12个汉字');
		}
		
		if (params.address && Buffer.from(params.address).length > 128) {
			throw new Error('地址长度不能超过128个字符');
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/user/create', 'POST', params, 'concat');
		return res;
	}
	
	/**
	 * 读取成员信息
	 * @param {Object} params - 请求参数
	 * @param {string} params.userid - 成员UserID，企业内必须唯一，不区分大小写，长度为1~64个字节
	 * @return {Promise<Object>} 成员信息
	 */
	async getUser(params) {
		// 参数验证
		if (!params.userid) {
			throw new Error('成员UserID不能为空');
		}
		
		if (!/^[a-zA-Z0-9_\-\.@]{1,64}$/.test(params.userid) || !/^[a-zA-Z0-9]/.test(params.userid)) {
			throw new Error('UserID格式不正确，只能由数字、字母和"_-@."四种字符组成，且第一个字符必须是数字或字母');
		}
		
		const url = `https://qyapi.weixin.qq.com/cgi-bin/user/get?userid=${encodeURIComponent(params.userid)}`;
		const res = await this.curl(url, 'GET', null, 'concat');
		return res;
	}

	/**
	 * 更新成员信息
	 * @param {Object} params - 请求参数
	 * @param {string} params.userid - 成员UserID，企业内必须唯一，不区分大小写，长度为1~64个字节
	 * @param {string} [params.name] - 成员名称，长度为1~64个utf8字符
	 * @param {string} [params.alias] - 别名，长度为1-64个utf8字符
	 * @param {string} [params.mobile] - 手机号码，企业内必须唯一
	 * @param {Array<number>} [params.department] - 成员所属部门id列表，不超过100个
	 * @param {Array<number>} [params.order] - 部门内的排序值，默认为0
	 * @param {string} [params.position] - 职务信息，长度为0~128个utf8字符
	 * @param {string} [params.gender] - 性别，1表示男性，2表示女性
	 * @param {string} [params.email] - 邮箱，长度6~64个字节，且为有效的email格式
	 * @param {string} [params.biz_mail] - 企业邮箱账号，长度6~63个字节
	 * @param {Object} [params.biz_mail_alias] - 企业邮箱别名
	 * @param {string} [params.telephone] - 座机，由1-32位的纯数字、"-"、"+"或","组成
	 * @param {Array<number>} [params.is_leader_in_dept] - 部门负责人字段，0-否，1-是
	 * @param {Array<string>} [params.direct_leader] - 直属上级，最多设置1个
	 * @param {string} [params.avatar_mediaid] - 成员头像的mediaid
	 * @param {number} [params.enable] - 启用/禁用成员，1表示启用，0表示禁用
	 * @param {Object} [params.extattr] - 扩展属性
	 * @param {Object} [params.external_profile] - 成员对外属性
	 * @param {string} [params.external_position] - 对外职务，不超过12个汉字
	 * @param {string} [params.nickname] - 视频号名字
	 * @param {string} [params.address] - 地址，长度最大128个字符
	 * @param {number} [params.main_department] - 主部门
	 * @return {Promise<Object>} 更新结果
	 */
	async updateUser(params) {
		// 参数验证
		if (!params.userid) {
			throw new Error('成员UserID不能为空');
		}
		
		if (!/^[a-zA-Z0-9_\-\.@]{1,64}$/.test(params.userid) || !/^[a-zA-Z0-9]/.test(params.userid)) {
			throw new Error('UserID格式不正确，只能由数字、字母和"_-@."四种字符组成，且第一个字符必须是数字或字母');
		}
		
		if (params.name && Buffer.from(params.name).length > 64) {
			throw new Error('成员名称长度不能超过64个字符');
		}
		
		if (params.alias && Buffer.from(params.alias).length > 64) {
			throw new Error('别名长度不能超过64个字符');
		}
		
		if (params.department && params.department.length > 100) {
			throw new Error('部门ID列表不能超过100个');
		}
		
		if (params.order && params.department && params.order.length !== params.department.length) {
			throw new Error('部门排序值的个数必须和部门ID列表的个数一致');
		}
		
		if (params.is_leader_in_dept && params.department && params.is_leader_in_dept.length !== params.department.length) {
			throw new Error('部门负责人标识的个数必须和部门ID列表的个数一致');
		}
		
		if (params.position && Buffer.from(params.position).length > 128) {
			throw new Error('职务信息长度不能超过128个字符');
		}
		
		if (params.external_position && Buffer.from(params.external_position).length > 36) {
			throw new Error('对外职务长度不能超过12个汉字');
		}
		
		if (params.address && Buffer.from(params.address).length > 128) {
			throw new Error('地址长度不能超过128个字符');
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/user/update', 'POST', params, 'concat');
		return res;
	}

	/**
	 * 删除成员
	 * @description 删除企业微信成员，若绑定了腾讯企业邮，则会同时删除邮箱账号
	 * @param {string} userid - 成员UserID，对应管理端的账号
	 * @returns {Promise<Object>} 删除结果
	 * @throws {Error} 当必填参数缺失时抛出错误
	 */
	async deleteUser(userid) {
		// 参数验证
		if (!userid) {
			throw new Error('成员UserID不能为空');
		}
		
		if (!/^[a-zA-Z0-9_\-\.@]{1,64}$/.test(userid) || !/^[a-zA-Z0-9]/.test(userid)) {
			throw new Error('UserID格式不正确，只能由数字、字母和"_-@."四种字符组成，且第一个字符必须是数字或字母');
		}
		
		const res = await this.curl(`https://qyapi.weixin.qq.com/cgi-bin/user/delete?userid=${encodeURIComponent(userid)}`, 'GET', null, 'concat');
		return res;
	}

	/**
	 * 批量删除成员
	 * @description 批量删除企业微信成员，若绑定了腾讯企业邮，则会同时删除邮箱账号
	 * @param {string[]} useridlist - 成员UserID列表，对应管理端的账号，最多支持200个
	 * @returns {Promise<Object>} 删除结果
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async batchDeleteUser(useridlist) {
		// 参数验证
		if (!useridlist || !Array.isArray(useridlist) || useridlist.length === 0) {
			throw new Error('成员UserID列表不能为空');
		}
		
		if (useridlist.length > 200) {
			throw new Error('成员UserID列表最多支持200个');
		}
		
		// 验证每个userid的格式
		for (const userid of useridlist) {
			if (!/^[a-zA-Z0-9_\-\.@]{1,64}$/.test(userid) || !/^[a-zA-Z0-9]/.test(userid)) {
				throw new Error('UserID格式不正确，只能由数字、字母和"_-@."四种字符组成，且第一个字符必须是数字或字母');
			}
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/user/batchdelete', 'POST', { useridlist }, 'concat');
		return res;
	}

	/**
	 * 获取部门成员
	 * @description 获取部门成员列表
	 * @param {number} department_id - 获取的部门id
	 * @returns {Promise<Object>} 部门成员列表
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async getDepartmentUsers(department_id) {
		// 参数验证
		if (!department_id) {
			throw new Error('部门ID不能为空');
		}
		
		if (typeof department_id !== 'number') {
			throw new Error('部门ID必须为数字');
		}
		
		const res = await this.curl(`https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?department_id=${department_id}`, 'GET', null, 'concat');
		return res;
	}

	/**
	 * 获取部门成员详情
	 * @description 获取部门成员详细信息列表
	 * @param {number} department_id - 获取的部门id
	 * @returns {Promise<Object>} 部门成员详细信息列表
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async getDepartmentUserDetails(department_id) {
		// 参数验证
		if (!department_id) {
			throw new Error('部门ID不能为空');
		}
		
		if (typeof department_id !== 'number') {
			throw new Error('部门ID必须为数字');
		}
		
		const res = await this.curl(`https://qyapi.weixin.qq.com/cgi-bin/user/list?department_id=${department_id}`, 'GET', null, 'concat');
		return res;
	}

	/**
	 * 将企业微信的userid转成openid
	 * @description 用于企业支付场景，将企业微信的userid转成openid
	 * @param {string} userid - 企业内的成员id
	 * @returns {Promise<Object>} 包含openid的结果
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async convertToOpenid(userid) {
		// 参数验证
		if (!userid) {
			throw new Error('成员ID不能为空');
		}
		
		if (typeof userid !== 'string') {
			throw new Error('成员ID必须为字符串');
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/user/convert_to_openid', 'POST', { userid }, 'concat');
		return res;
	}

	/**
	 * 将openid转成企业微信的userid
	 * @description 用于企业支付场景，将openid转成企业微信的userid
	 * @param {string} openid - 在使用企业支付之后，返回结果的openid
	 * @returns {Promise<Object>} 包含userid的结果
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async convertToUserid(openid) {
		// 参数验证
		if (!openid) {
			throw new Error('openid不能为空');
		}
		
		if (typeof openid !== 'string') {
			throw new Error('openid必须为字符串');
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/user/convert_to_userid', 'POST', { openid }, 'concat');
		return res;
	}

	/**
	 * 二次验证
	 * @description 企业在开启二次验证时，必须在管理端填写企业二次验证页面的url。
	 * 当成员登录企业微信或关注微信插件（原企业号）进入企业时，会自动跳转到企业的验证页面。
	 * 企业收到code后，使用"通讯录同步助手"调用接口"根据code获取成员信息"获取成员的userid。
	 * 如果成员是首次加入企业，企业获取到userid，并验证了成员信息后，调用此接口即可让成员成功加入企业。
	 * @param {string} userid - 成员UserID。对应管理端的账号
	 * @returns {Promise<Object>} 操作结果
	 * @throws {Error} 当必填参数缺失或参数格式错误时抛出错误
	 */
	async authSucc(userid) {
		// 参数验证
		if (!userid) {
			throw new Error('成员UserID不能为空');
		}
		
		if (typeof userid !== 'string') {
			throw new Error('成员UserID必须为字符串');
		}
		
		const res = await this.curl(`https://qyapi.weixin.qq.com/cgi-bin/user/authsucc?userid=${userid}`, 'GET', null, 'concat');
		return res;
	}

	/**
	 * 邀请成员
	 * @description 批量邀请成员使用企业微信，邀请后将通过短信或邮件下发通知
	 * @param {Object} params - 邀请成员的参数
	 * @param {string[]} [params.user] - 成员ID列表, 最多支持1000个
	 * @param {number[]} [params.party] - 部门ID列表，最多支持100个
	 * @param {number[]} [params.tag] - 标签ID列表，最多支持100个
	 * @returns {Promise<Object>} 包含邀请结果的对象，可能包含invaliduser、invalidparty、invalidtag字段
	 * @throws {Error} 当参数格式错误或三者同时为空时抛出错误
	 */
	async inviteUser(params) {
		// 参数验证
		if (!params) {
			throw new Error('参数不能为空');
		}
		
		const { user, party, tag } = params;
		
		// 验证三者不能同时为空
		if ((!user || user.length === 0) && 
			(!party || party.length === 0) && 
			(!tag || tag.length === 0)) {
			throw new Error('user, party, tag三者不能同时为空');
		}
		
		// 验证数组长度限制
		if (user && user.length > 1000) {
			throw new Error('成员ID列表最多支持1000个');
		}
		
		if (party && party.length > 100) {
			throw new Error('部门ID列表最多支持100个');
		}
		
		if (tag && tag.length > 100) {
			throw new Error('标签ID列表最多支持100个');
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/batch/invite', 'POST', params, 'concat');
		return res;
	}

	/**
	 * 获取加入企业二维码
	 * @description 获取实时成员加入企业的二维码
	 * @param {number} [sizeType] - 二维码尺寸类型，1: 171 x 171; 2: 399 x 399; 3: 741 x 741; 4: 2052 x 2052
	 * @returns {Promise<Object>} 包含二维码链接的对象，二维码有效期7天
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async getJoinQrcode(sizeType) {
		// 参数验证
		if (sizeType !== undefined) {
			if (![1, 2, 3, 4].includes(Number(sizeType))) {
				throw new Error('二维码尺寸类型必须是1-4之间的整数');
			}
		}
		
		// 构建请求URL
		let url = 'https://qyapi.weixin.qq.com/cgi-bin/corp/get_join_qrcode';
		
		// 如果提供了尺寸参数，添加到URL
		if (sizeType !== undefined) {
			url += `?size_type=${sizeType}`;
		}
		
		const res = await this.curl(url, 'GET', null, 'concat');
		return res;
	}

	/**
	 * 通过手机号获取userid
	 * @description 通过手机号获取其所对应的userid
	 * @param {string} mobile - 用户在企业微信通讯录中的手机号码。长度为5~32个字节
	 * @returns {Promise<Object>} 包含userid的对象
	 * @throws {Error} 当参数缺失或格式错误时抛出错误
	 */
	async getUseridByMobile(mobile) {
		// 参数验证
		if (!mobile) {
			throw new Error('手机号不能为空');
		}
		
		if (mobile.length < 5 || mobile.length > 32) {
			throw new Error('手机号长度必须在5~32个字节之间');
		}
		
		const params = {
			mobile
		};
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/user/getuserid', 'POST', params, 'concat');
		return res;
	}

	/**
	 * 通过邮箱获取userid
	 * @description 通过邮箱获取其所对应的userid
	 * @param {string} email - 用户在企业微信通讯录中的邮箱
	 * @param {number} [emailType] - 邮箱类型：1-企业邮箱（默认）；2-个人邮箱
	 * @returns {Promise<Object>} 包含userid的对象
	 * @throws {Error} 当参数缺失或格式错误时抛出错误
	 */
	async getUseridByEmail(email, emailType) {
		// 参数验证
		if (!email) {
			throw new Error('邮箱不能为空');
		}
		
		// 构建请求参数
		const params = {
			email
		};
		
		// 如果提供了邮箱类型参数，添加到请求体
		if (emailType !== undefined) {
			if (![1, 2].includes(Number(emailType))) {
				throw new Error('邮箱类型必须是1或2');
			}
			params.email_type = emailType;
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/user/get_userid_by_email', 'POST', params, 'concat');
		return res;
	}
    
	/**
	 * 获取成员ID列表
	 * @description 获取企业成员的userid与对应的部门ID列表
	 * @param {Object} [options] - 请求选项
	 * @param {string} [options.cursor] - 用于分页查询的游标，字符串类型，由上一次调用返回，首次调用不填
	 * @param {number} [options.limit] - 分页，预期请求的数据量，取值范围 1 ~ 10000
	 * @returns {Promise<Object>} 包含用户-部门关系列表的对象
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async listUserIds(options = {}) {
		const params = {};
		
		// 添加可选参数
		if (options.cursor) {
			params.cursor = options.cursor;
		}
		
		if (options.limit !== undefined) {
			if (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 10000) {
				throw new Error('limit参数必须是1到10000之间的整数');
			}
			params.limit = options.limit;
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/user/list_id', 'POST', params, 'concat');
		return res;
	}
}

module.exports = User;