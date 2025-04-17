const Base = require('../Base');

/**
 * 异步导出通讯录相关功能
 * @public {function} exportSimpleUser - 异步导出成员
 * @public {function} exportUser - 异步导出成员详情
 * @public {function} exportDepartment - 异步导出部门
 * @public {function} exportTagUser - 异步导出标签成员
 * @public {function} getExportResult - 获取异步导出结果
 * @public {function} parseExportNotification - 解析异步导出任务完成通知
 */
class Asyncoutport extends Base {
    constructor() {
        super();
    }


    /**
     * 异步导出成员
     * @description 异步导出企业微信通讯录成员，返回任务ID
     * @param {Object} options - 导出选项
     * @param {string} options.encoding_aeskey - Base64编码后的加密密钥，长度固定为43，从a-z, A-Z, 0-9共62个字符中选取
     * @param {number} [options.block_size=1000000] - 每块数据的人员数，支持范围[10^4,10^6]，默认值为10^6
     * @returns {Promise<Object>} 包含任务ID的对象
     * @throws {Error} 当参数格式错误时抛出错误
     */
    async exportSimpleUser(options) {
        // 参数验证
        if (!options || !options.encoding_aeskey) {
            throw new Error('加密密钥不能为空');
        }

        if (options.encoding_aeskey.length !== 43) {
            throw new Error('加密密钥长度必须为43个字符');
        }

        if (!/^[a-zA-Z0-9]{43}$/.test(options.encoding_aeskey)) {
            throw new Error('加密密钥只能包含a-z, A-Z, 0-9字符');
        }

        if (options.block_size !== undefined) {
            const size = Number(options.block_size);
            if (isNaN(size) || size < 10000 || size > 1000000) {
                throw new Error('每块数据的人员数必须在10^4到10^6之间');
            }
        }

        const params = {
            encoding_aeskey: options.encoding_aeskey
        };

        if (options.block_size !== undefined) {
            params.block_size = options.block_size;
        }

        const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/export/simple_user', 'POST', params, 'concat');
        return res;
    }

    /**
     * 异步导出成员详情
     * @description 异步导出企业微信通讯录成员详情，返回任务ID
     * @param {Object} options - 导出选项
     * @param {string} options.encoding_aeskey - Base64编码后的加密密钥，长度固定为43，从a-z, A-Z, 0-9共62个字符中选取
     * @param {number} [options.block_size=1000000] - 每块数据的人员数，支持范围[10^4,10^6]，默认值为10^6
     * @returns {Promise<Object>} 包含任务ID的对象
     * @throws {Error} 当参数格式错误时抛出错误
     */
    async exportUser(options) {
        // 参数验证
        if (!options || !options.encoding_aeskey) {
            throw new Error('加密密钥不能为空');
        }

        if (options.encoding_aeskey.length !== 43) {
            throw new Error('加密密钥长度必须为43个字符');
        }

        if (!/^[a-zA-Z0-9]{43}$/.test(options.encoding_aeskey)) {
            throw new Error('加密密钥只能包含a-z, A-Z, 0-9字符');
        }

        if (options.block_size !== undefined) {
            const size = Number(options.block_size);
            if (isNaN(size) || size < 10000 || size > 1000000) {
                throw new Error('每块数据的人员数必须在10^4到10^6之间');
            }
        }

        const params = {
            encoding_aeskey: options.encoding_aeskey
        };

        if (options.block_size !== undefined) {
            params.block_size = options.block_size;
        }

        const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/export/user', 'POST', params, 'concat');
        return res;
    }

    /**
     * 异步导出部门
     * @description 异步导出企业微信通讯录部门，返回任务ID
     * @param {Object} options - 导出选项
     * @param {string} options.encoding_aeskey - Base64编码后的加密密钥，长度固定为43，从a-z, A-Z, 0-9共62个字符中选取
     * @param {number} [options.block_size=1000000] - 每块数据的部门数，支持范围[10^4,10^6]，默认值为10^6
     * @returns {Promise<Object>} 包含任务ID的对象
     * @throws {Error} 当参数格式错误时抛出错误
     */
    async exportDepartment(options) {
        // 参数验证
        if (!options || !options.encoding_aeskey) {
            throw new Error('加密密钥不能为空');
        }

        if (options.encoding_aeskey.length !== 43) {
            throw new Error('加密密钥长度必须为43个字符');
        }

        if (!/^[a-zA-Z0-9]{43}$/.test(options.encoding_aeskey)) {
            throw new Error('加密密钥只能包含a-z, A-Z, 0-9字符');
        }

        if (options.block_size !== undefined) {
            const size = Number(options.block_size);
            if (isNaN(size) || size < 10000 || size > 1000000) {
                throw new Error('每块数据的部门数必须在10^4到10^6之间');
            }
        }

        const params = {
            encoding_aeskey: options.encoding_aeskey
        };

        if (options.block_size !== undefined) {
            params.block_size = options.block_size;
        }

        const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/export/department', 'POST', params, 'concat');
        return res;
    }

    /**
     * 异步导出标签成员
     * @description 异步导出企业微信标签成员，返回任务ID
     * @param {Object} options - 导出选项
     * @param {number} options.tagid - 需要导出的标签ID
     * @param {string} options.encoding_aeskey - Base64编码后的加密密钥，长度固定为43，从a-z, A-Z, 0-9共62个字符中选取
     * @param {number} [options.block_size=1000000] - 每块数据的人员数和部门数之和，支持范围[10^4,10^6]，默认值为10^6
     * @returns {Promise<Object>} 包含任务ID的对象
     * @throws {Error} 当参数格式错误时抛出错误
     */
    async exportTagUser(options) {
        // 参数验证
        if (!options) {
            throw new Error('导出选项不能为空');
        }

        if (options.tagid === undefined || options.tagid === null) {
            throw new Error('标签ID不能为空');
        }

        if (!Number.isInteger(options.tagid)) {
            throw new Error('标签ID必须是整数');
        }

        if (!options.encoding_aeskey) {
            throw new Error('加密密钥不能为空');
        }

        if (options.encoding_aeskey.length !== 43) {
            throw new Error('加密密钥长度必须为43个字符');
        }

        if (!/^[a-zA-Z0-9]{43}$/.test(options.encoding_aeskey)) {
            throw new Error('加密密钥只能包含a-z, A-Z, 0-9字符');
        }

        if (options.block_size !== undefined) {
            const size = Number(options.block_size);
            if (isNaN(size) || size < 10000 || size > 1000000) {
                throw new Error('每块数据的人员数和部门数之和必须在10^4到10^6之间');
            }
        }

        const params = {
            tagid: options.tagid,
            encoding_aeskey: options.encoding_aeskey
        };

        if (options.block_size !== undefined) {
            params.block_size = options.block_size;
        }

        const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/export/taguser', 'POST', params, 'concat');
        return res;
    }

    /**
     * 获取异步导出结果
     * @description 获取异步导出企业微信通讯录的结果
     * @param {string} jobid - 导出任务接口成功后返回的任务ID
     * @returns {Promise<Object>} 包含导出结果的对象
     * @throws {Error} 当参数格式错误时抛出错误
     */
    async getExportResult(jobid) {
        // 参数验证
        if (!jobid) {
            throw new Error('任务ID不能为空');
        }

        if (typeof jobid !== 'string') {
            throw new Error('任务ID必须是字符串');
        }

        // 构建请求URL
        const url = `https://qyapi.weixin.qq.com/cgi-bin/export/get_result?jobid=${jobid}`;

        const res = await this.curl(url, 'GET', null, 'concat');
        return res;
    }


    /**
     * 解析异步导出任务完成通知
     * @description 将企业微信异步导出任务完成的XML通知转换为JSON对象
     * @param {string} xmlString - 企业微信推送的XML格式通知内容
     * @returns {Object} 解析后的通知内容对象
     * @throws {Error} 当XML解析失败时抛出错误
     */
    parseExportNotification(xmlString) {
        if (!xmlString) {
            throw new Error('XML内容不能为空');
        }

        try {
            // 简单的XML解析实现
            const result = {};

            // 解析基本字段
            result.toUserName = this.extractXmlValue(xmlString, 'ToUserName');
            result.fromUserName = this.extractXmlValue(xmlString, 'FromUserName');
            result.createTime = parseInt(this.extractXmlValue(xmlString, 'CreateTime'), 10);
            result.msgType = this.extractXmlValue(xmlString, 'MsgType');
            result.event = this.extractXmlValue(xmlString, 'Event');

            // 解析BatchJob节点
            result.batchJob = {
                jobId: this.extractXmlValue(xmlString, 'JobId'),
                jobType: this.extractXmlValue(xmlString, 'JobType'),
                errCode: parseInt(this.extractXmlValue(xmlString, 'ErrCode'), 10),
                errMsg: this.extractXmlValue(xmlString, 'ErrMsg')
            };

            return result;
        } catch (error) {
            throw new Error(`解析XML失败: ${error.message}`);
        }
    }
}


module.exports = Asyncoutport;