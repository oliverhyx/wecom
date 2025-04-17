const Base = require('../Base');

/**
 * 部门管理
 * @public {function} createDepartment - 创建部门
 * @public {function} updateDepartment - 更新部门
 * @public {function} deleteDepartment - 删除部门
 * @public {function} listDepartment - 获取部门列表
 * @public {function} listSimpleDepartment - 获取子部门ID列表
 * @public {function} getDepartment - 获取单个部门详情
 */
class Department extends Base {
	constructor() {
		super();
	}

	/**
	 * 创建部门
	 * @description 创建企业部门
	 * @param {Object} department - 部门信息
	 * @param {string} department.name - 部门名称，同一个层级的部门名称不能重复，长度限制为1~64个UTF-8字符
	 * @param {number} department.parentid - 父部门id，32位整型
	 * @param {string} [department.name_en] - 英文名称，同一个层级的部门名称不能重复，长度限制为1~64个字符
	 * @param {number} [department.order] - 在父部门中的次序值，order值大的排序靠前，有效的值范围是[0, 2^32)
	 * @param {number} [department.id] - 部门id，32位整型，指定时必须大于1，若不填该参数，将自动生成id
	 * @returns {Promise<Object>} 包含创建的部门id的对象
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async createDepartment(department) {
		// 参数验证
		if (!department.name) {
			throw new Error('部门名称不能为空');
		}
		
		if (department.name.length > 64) {
			throw new Error('部门名称不能超过64个字符');
		}
		
		if (!/^[^\\\:*?"<>|]+$/.test(department.name)) {
			throw new Error('部门名称不能包含\\:*?"<>|等字符');
		}
		
		if (department.name_en && department.name_en.length > 64) {
			throw new Error('部门英文名称不能超过64个字符');
		}
		
		if (department.name_en && !/^[^\\\:*?"<>|]+$/.test(department.name_en)) {
			throw new Error('部门英文名称不能包含\\:*?"<>|等字符');
		}
		
		if (!department.parentid) {
			throw new Error('父部门ID不能为空');
		}
		
		if (!Number.isInteger(department.parentid)) {
			throw new Error('父部门ID必须是整数');
		}
		
		if (department.order !== undefined && (!Number.isInteger(department.order) || department.order < 0)) {
			throw new Error('部门排序值必须是非负整数');
		}
		
		if (department.id !== undefined) {
			if (!Number.isInteger(department.id) || department.id <= 1) {
				throw new Error('部门ID必须是大于1的整数');
			}
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/department/create', 'POST', department, 'concat');
		return res;
	}

	/**
	 * 更新部门
	 * @description 更新企业通讯录中的部门信息
	 * @param {Object} department - 部门信息
	 * @param {number} department.id - 部门id，必须大于1
	 * @param {string} [department.name] - 部门名称，长度限制为1~64个字符，字符不能包括\:*?"<>｜
	 * @param {string} [department.name_en] - 英文名称，长度限制为1~64个字符，字符不能包括\:*?"<>｜
	 * @param {number} [department.parentid] - 父部门id
	 * @param {number} [department.order] - 在父部门中的次序值，order值大的排序靠前，有效的值范围是[0, 2^32)
	 * @returns {Promise<Object>} 更新结果
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async updateDepartment(department) {
		// 参数验证
		if (!department.id) {
			throw new Error('部门ID不能为空');
		}
		
		if (!Number.isInteger(department.id) || department.id <= 1) {
			throw new Error('部门ID必须是大于1的整数');
		}
		
		if (department.name !== undefined) {
			if (department.name.length > 64) {
				throw new Error('部门名称不能超过64个字符');
			}
			
			if (!/^[^\\\:*?"<>|]+$/.test(department.name)) {
				throw new Error('部门名称不能包含\\:*?"<>|等字符');
			}
		}
		
		if (department.name_en !== undefined) {
			if (department.name_en.length > 64) {
				throw new Error('部门英文名称不能超过64个字符');
			}
			
			if (!/^[^\\\:*?"<>|]+$/.test(department.name_en)) {
				throw new Error('部门英文名称不能包含\\:*?"<>|等字符');
			}
		}
		
		if (department.parentid !== undefined && !Number.isInteger(department.parentid)) {
			throw new Error('父部门ID必须是整数');
		}
		
		if (department.order !== undefined && (!Number.isInteger(department.order) || department.order < 0)) {
			throw new Error('部门排序值必须是非负整数');
		}
		
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/department/update', 'POST', department, 'concat');
		return res;
	}

	/**
	 * 删除部门
	 * @description 删除企业通讯录中的部门
	 * @param {number} id - 部门id
	 * @returns {Promise<Object>} 删除结果
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async deleteDepartment(id) {
		// 参数验证
		if (id === undefined || id === null) {
			throw new Error('部门ID不能为空');
		}
		
		if (!Number.isInteger(id)) {
			throw new Error('部门ID必须是整数');
		}
		
		if (id <= 0) {
			throw new Error('部门ID必须是正整数');
		}
		
		// 注意：API不能删除根部门；不能删除含有子部门、成员的部门
		const res = await this.curl(`https://qyapi.weixin.qq.com/cgi-bin/department/delete?id=${id}`, 'GET', null, 'concat');
		return res;
	}
	/**
	 * 获取部门列表
	 * @description 获取企业通讯录中的部门列表
	 * @param {number} [id] - 部门id。获取指定部门及其下的子部门。如果不填，默认获取全量组织架构
	 * @returns {Promise<Object>} 包含部门列表的对象
	 * @throws {Error} 当参数格式错误时抛出错误
	 * @deprecated 由于该接口性能较低，建议换用获取子部门ID列表与获取单个部门详情
	 */
	async listDepartment(id) {
		// 构建请求URL
		let url = 'https://qyapi.weixin.qq.com/cgi-bin/department/list';
		
		// 如果提供了部门ID，添加到URL参数中
		if (id !== undefined) {
			// 参数验证
			if (!Number.isInteger(id)) {
				throw new Error('部门ID必须是整数');
			}
			
			url += `?id=${id}`;
		}
		
		const res = await this.curl(url, 'GET', null, 'concat');
		return res;
	}

	/**
	 * 获取子部门ID列表
	 * @description 获取企业通讯录中指定部门及其下的子部门ID列表
	 * @param {number} [id] - 部门id。获取指定部门及其下的子部门（递归）。如果不填，默认获取全量组织架构
	 * @returns {Promise<Object>} 包含部门ID列表的对象
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async listSimpleDepartment(id) {
		// 构建请求URL
		let url = 'https://qyapi.weixin.qq.com/cgi-bin/department/simplelist';
		
		// 如果提供了部门ID，添加到URL参数中
		if (id !== undefined) {
			// 参数验证
			if (!Number.isInteger(id)) {
				throw new Error('部门ID必须是整数');
			}
			
			url += `?id=${id}`;
		}
		
		const res = await this.curl(url, 'GET', null, 'concat');
		return res;
	}

	/**
	 * 获取单个部门详情
	 * @description 获取企业通讯录中指定部门的详细信息
	 * @param {number} id - 部门id
	 * @returns {Promise<Object>} 包含部门详情的对象
	 * @throws {Error} 当参数格式错误时抛出错误
	 */
	async getDepartment(id) {
		// 参数验证
		if (id === undefined) {
			throw new Error('部门ID不能为空');
		}
		
		if (!Number.isInteger(id)) {
			throw new Error('部门ID必须是整数');
		}
		
		// 构建请求URL
		const url = `https://qyapi.weixin.qq.com/cgi-bin/department/get?id=${id}`;
		
		const res = await this.curl(url, 'GET', null, 'concat');
		return res;
	}
}


module.exports = Department;