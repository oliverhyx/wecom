const Base = require('../Base');

/**
 * 通讯录回调通知
 * @public {function} parseCreateUserNotification - 解析新增成员事件通知
 * @public {function} parseUpdateUserNotification - 解析更新成员事件通知
 * @public {function} parseDeleteUserNotification - 解析删除成员事件通知
 * @public {function} parseCreatePartyNotification - 解析新增部门事件通知
 * @public {function} parseUpdatePartyNotification - 解析更新部门事件通知
 * @public {function} parseDeletePartyNotification - 解析删除部门事件通知
 * @public {function} parseUpdateTagNotification - 解析更新标签事件通知
 */
class Concats extends Base {
    constructor() {
        super();
    }

    /**
     * 解析新增成员事件通知
     * @description 将企业微信新增成员事件的XML通知转换为JSON对象
     * @param {string} xmlString - 企业微信推送的XML格式通知内容
     * @returns {Object} 解析后的通知内容对象
     * @throws {Error} 当XML解析失败时抛出错误
     */
    parseCreateUserNotification(xmlString) {
        if (!xmlString) {
            throw new Error('XML内容不能为空');
        }

        try {
            // 解析XML为JSON对象
            const result = {};

            // 解析基本字段
            result.toUserName = this.extractXmlValue(xmlString, 'ToUserName');
            result.fromUserName = this.extractXmlValue(xmlString, 'FromUserName');
            result.createTime = parseInt(this.extractXmlValue(xmlString, 'CreateTime'), 10);
            result.msgType = this.extractXmlValue(xmlString, 'MsgType');
            result.event = this.extractXmlValue(xmlString, 'Event');
            result.changeType = this.extractXmlValue(xmlString, 'ChangeType');
            
            // 解析用户信息字段
            result.userId = this.extractXmlValue(xmlString, 'UserID');
            result.name = this.extractXmlValue(xmlString, 'Name');
            
            // 解析部门信息
            const departmentStr = this.extractXmlValue(xmlString, 'Department');
            result.department = departmentStr ? departmentStr.split(',').map(Number) : [];
            
            const mainDepartment = this.extractXmlValue(xmlString, 'MainDepartment');
            result.mainDepartment = mainDepartment ? parseInt(mainDepartment, 10) : null;
            
            // 解析部门负责人信息
            const isLeaderInDeptStr = this.extractXmlValue(xmlString, 'IsLeaderInDept');
            result.isLeaderInDept = isLeaderInDeptStr ? isLeaderInDeptStr.split(',').map(item => parseInt(item, 10)) : [];
            
            // 解析直属上级
            const directLeaderStr = this.extractXmlValue(xmlString, 'DirectLeader');
            result.directLeader = directLeaderStr ? directLeaderStr.split(',') : [];
            
            // 解析其他基本信息
            result.position = this.extractXmlValue(xmlString, 'Position');
            result.mobile = this.extractXmlValue(xmlString, 'Mobile');
            result.gender = this.extractXmlValue(xmlString, 'Gender') ? parseInt(this.extractXmlValue(xmlString, 'Gender'), 10) : 0;
            result.email = this.extractXmlValue(xmlString, 'Email');
            result.bizMail = this.extractXmlValue(xmlString, 'BizMail');
            result.status = this.extractXmlValue(xmlString, 'Status') ? parseInt(this.extractXmlValue(xmlString, 'Status'), 10) : null;
            result.avatar = this.extractXmlValue(xmlString, 'Avatar');
            result.alias = this.extractXmlValue(xmlString, 'Alias');
            result.telephone = this.extractXmlValue(xmlString, 'Telephone');
            result.address = this.extractXmlValue(xmlString, 'Address');
            
            // 解析扩展属性
            const extAttrContent = this.extractXmlBlock(xmlString, 'ExtAttr');
            if (extAttrContent) {
                result.extAttr = this.parseExtAttr(extAttrContent);
            }
            
            return result;
        } catch (error) {
            throw new Error(`解析XML失败: ${error.message}`);
        }
    }

    /**
     * 解析更新成员事件
     * @description 解析企业微信通讯录更新成员事件的XML通知
     * @param {string} xmlString - 企业微信推送的XML格式通知内容
     * @returns {Object} 解析后的通知内容对象
     * @throws {Error} 当XML解析失败时抛出错误
     */
    parseUpdateUserEvent(xmlString) {
        if (!xmlString) {
            throw new Error('XML内容不能为空');
        }

        try {
            // 创建结果对象
            const result = {};

            // 解析基本字段
            result.toUserName = this.extractXmlValue(xmlString, 'ToUserName');
            result.fromUserName = this.extractXmlValue(xmlString, 'FromUserName');
            result.createTime = parseInt(this.extractXmlValue(xmlString, 'CreateTime'), 10);
            result.msgType = this.extractXmlValue(xmlString, 'MsgType');
            result.event = this.extractXmlValue(xmlString, 'Event');
            result.changeType = this.extractXmlValue(xmlString, 'ChangeType');
            
            // 解析用户ID信息
            result.userId = this.extractXmlValue(xmlString, 'UserID');
            
            // 解析新的UserID（如果存在）
            const newUserId = this.extractXmlValue(xmlString, 'NewUserID');
            if (newUserId) {
                result.newUserId = newUserId;
            }
            
            // 解析用户基本信息
            const name = this.extractXmlValue(xmlString, 'Name');
            if (name) {
                result.name = name;
            }
            
            // 解析部门信息
            const departmentStr = this.extractXmlValue(xmlString, 'Department');
            result.department = departmentStr ? departmentStr.split(',').map(Number) : [];
            
            const mainDepartment = this.extractXmlValue(xmlString, 'MainDepartment');
            if (mainDepartment) {
                result.mainDepartment = parseInt(mainDepartment, 10);
            }
            
            // 解析部门负责人信息
            const isLeaderInDeptStr = this.extractXmlValue(xmlString, 'IsLeaderInDept');
            if (isLeaderInDeptStr) {
                result.isLeaderInDept = isLeaderInDeptStr.split(',').map(item => parseInt(item, 10));
            }
            
            // 解析直属上级
            const directLeaderStr = this.extractXmlValue(xmlString, 'DirectLeader');
            if (directLeaderStr) {
                result.directLeader = directLeaderStr.split(',');
            }
            
            // 解析其他基本信息
            const position = this.extractXmlValue(xmlString, 'Position');
            if (position) {
                result.position = position;
            }
            
            const mobile = this.extractXmlValue(xmlString, 'Mobile');
            if (mobile) {
                result.mobile = mobile;
            }
            
            const gender = this.extractXmlValue(xmlString, 'Gender');
            if (gender) {
                result.gender = parseInt(gender, 10);
            }
            
            const email = this.extractXmlValue(xmlString, 'Email');
            if (email) {
                result.email = email;
            }
            
            const bizMail = this.extractXmlValue(xmlString, 'BizMail');
            if (bizMail) {
                result.bizMail = bizMail;
            }
            
            const status = this.extractXmlValue(xmlString, 'Status');
            if (status) {
                result.status = parseInt(status, 10);
            }
            
            const avatar = this.extractXmlValue(xmlString, 'Avatar');
            if (avatar) {
                result.avatar = avatar;
            }
            
            const alias = this.extractXmlValue(xmlString, 'Alias');
            if (alias) {
                result.alias = alias;
            }
            
            const telephone = this.extractXmlValue(xmlString, 'Telephone');
            if (telephone) {
                result.telephone = telephone;
            }
            
            const address = this.extractXmlValue(xmlString, 'Address');
            if (address) {
                result.address = address;
            }
            
            // 解析扩展属性
            const extAttrContent = this.extractXmlBlock(xmlString, 'ExtAttr');
            if (extAttrContent) {
                result.extAttr = this.parseExtAttr(extAttrContent);
            }
            
            return result;
        } catch (error) {
            throw new Error(`解析更新成员事件XML失败: ${error.message}`);
        }
    }
    

    /**
     * 解析删除成员事件通知
     * @description 将企业微信删除成员事件的XML通知转换为JSON对象
     * @param {string} xmlString - 企业微信推送的XML格式通知内容
     * @returns {Object} 解析后的通知内容对象
     * @throws {Error} 当XML解析失败时抛出错误
     */
    parseDeleteUserNotification(xmlString) {
        if (!xmlString) {
            throw new Error('XML内容不能为空');
        }

        try {
            // 创建结果对象
            const result = {};

            // 解析基本字段
            result.toUserName = this.extractXmlValue(xmlString, 'ToUserName');
            result.fromUserName = this.extractXmlValue(xmlString, 'FromUserName');
            result.createTime = parseInt(this.extractXmlValue(xmlString, 'CreateTime'), 10);
            result.msgType = this.extractXmlValue(xmlString, 'MsgType');
            result.event = this.extractXmlValue(xmlString, 'Event');
            result.changeType = this.extractXmlValue(xmlString, 'ChangeType');
            
            // 解析用户ID信息
            result.userId = this.extractXmlValue(xmlString, 'UserID');
            
            return result;
        } catch (error) {
            throw new Error(`解析删除成员事件XML失败: ${error.message}`);
        }
    }

    /**
     * 解析新增部门事件通知
     * @description 将企业微信新增部门事件的XML通知转换为JSON对象
     * @param {string} xmlString - 企业微信推送的XML格式通知内容
     * @returns {Object} 解析后的通知内容对象
     * @throws {Error} 当XML解析失败时抛出错误
     */
    parseCreatePartyNotification(xmlString) {
        if (!xmlString) {
            throw new Error('XML内容不能为空');
        }

        try {
            // 创建结果对象
            const result = {};

            // 解析基本字段
            result.toUserName = this.extractXmlValue(xmlString, 'ToUserName');
            result.fromUserName = this.extractXmlValue(xmlString, 'FromUserName');
            result.createTime = parseInt(this.extractXmlValue(xmlString, 'CreateTime'), 10);
            result.msgType = this.extractXmlValue(xmlString, 'MsgType');
            result.event = this.extractXmlValue(xmlString, 'Event');
            result.changeType = this.extractXmlValue(xmlString, 'ChangeType');
            
            // 解析部门信息
            const id = this.extractXmlValue(xmlString, 'Id');
            if (id) {
                result.id = parseInt(id, 10);
            }
            
            const name = this.extractXmlValue(xmlString, 'Name');
            if (name) {
                result.name = name;
            }
            
            const parentId = this.extractXmlValue(xmlString, 'ParentId');
            if (parentId) {
                result.parentId = parseInt(parentId, 10);
            }
            
            const order = this.extractXmlValue(xmlString, 'Order');
            if (order) {
                result.order = parseInt(order, 10);
            }
            
            return result;
        } catch (error) {
            throw new Error(`解析新增部门事件XML失败: ${error.message}`);
        }
    }

    /**
     * 解析更新部门事件通知
     * @description 将企业微信更新部门事件的XML通知转换为JSON对象
     * @param {string} xmlString - 企业微信推送的XML格式通知内容
     * @returns {Object} 解析后的通知内容对象
     * @throws {Error} 当XML解析失败时抛出错误
     */
    parseUpdatePartyNotification(xmlString) {
        if (!xmlString) {
            throw new Error('XML内容不能为空');
        }

        try {
            // 创建结果对象
            const result = {};

            // 解析基本字段
            result.toUserName = this.extractXmlValue(xmlString, 'ToUserName');
            result.fromUserName = this.extractXmlValue(xmlString, 'FromUserName');
            result.createTime = parseInt(this.extractXmlValue(xmlString, 'CreateTime'), 10);
            result.msgType = this.extractXmlValue(xmlString, 'MsgType');
            result.event = this.extractXmlValue(xmlString, 'Event');
            result.changeType = this.extractXmlValue(xmlString, 'ChangeType');
            
            // 解析部门信息
            const id = this.extractXmlValue(xmlString, 'Id');
            if (id) {
                result.id = parseInt(id, 10);
            }
            
            // 部门名称，仅当该字段发生变更时传递
            const name = this.extractXmlValue(xmlString, 'Name');
            if (name) {
                result.name = name;
            }
            
            // 父部门id，仅当该字段发生变更时传递
            const parentId = this.extractXmlValue(xmlString, 'ParentId');
            if (parentId) {
                result.parentId = parseInt(parentId, 10);
            }
            
            return result;
        } catch (error) {
            throw new Error(`解析更新部门事件XML失败: ${error.message}`);
        }
    }

    /**
     * 解析删除部门事件通知
     * @description 将企业微信删除部门事件的XML通知转换为JSON对象
     * @param {string} xmlString - 企业微信推送的XML格式通知内容
     * @returns {Object} 解析后的通知内容对象
     * @throws {Error} 当XML解析失败时抛出错误
     */
    parseDeletePartyNotification(xmlString) {
        if (!xmlString) {
            throw new Error('XML内容不能为空');
        }

        try {
            // 创建结果对象
            const result = {};

            // 解析基本字段
            result.toUserName = this.extractXmlValue(xmlString, 'ToUserName');
            result.fromUserName = this.extractXmlValue(xmlString, 'FromUserName');
            result.createTime = parseInt(this.extractXmlValue(xmlString, 'CreateTime'), 10);
            result.msgType = this.extractXmlValue(xmlString, 'MsgType');
            result.event = this.extractXmlValue(xmlString, 'Event');
            result.changeType = this.extractXmlValue(xmlString, 'ChangeType');
            
            // 解析部门ID
            const id = this.extractXmlValue(xmlString, 'Id');
            if (id) {
                result.id = parseInt(id, 10);
            }
            
            return result;
        } catch (error) {
            throw new Error(`解析删除部门事件XML失败: ${error.message}`);
        }
    }

    /**
     * 解析标签成员变更事件通知
     * @description 将企业微信标签成员变更事件的XML通知转换为JSON对象
     * @param {string} xmlString - 企业微信推送的XML格式通知内容
     * @returns {Object} 解析后的通知内容对象
     * @throws {Error} 当XML解析失败时抛出错误
     */
    parseUpdateTagNotification(xmlString) {
        if (!xmlString) {
            throw new Error('XML内容不能为空');
        }

        try {
            // 创建结果对象
            const result = {};

            // 解析基本字段
            result.toUserName = this.extractXmlValue(xmlString, 'ToUserName');
            result.fromUserName = this.extractXmlValue(xmlString, 'FromUserName');
            result.createTime = parseInt(this.extractXmlValue(xmlString, 'CreateTime'), 10);
            result.msgType = this.extractXmlValue(xmlString, 'MsgType');
            result.event = this.extractXmlValue(xmlString, 'Event');
            result.changeType = this.extractXmlValue(xmlString, 'ChangeType');
            
            // 解析标签ID
            const tagId = this.extractXmlValue(xmlString, 'TagId');
            if (tagId) {
                result.tagId = parseInt(tagId, 10);
            }
            
            // 解析新增成员列表
            const addUserItems = this.extractXmlValue(xmlString, 'AddUserItems');
            if (addUserItems) {
                result.addUserItems = addUserItems.split(',');
            }
            
            // 解析删除成员列表
            const delUserItems = this.extractXmlValue(xmlString, 'DelUserItems');
            if (delUserItems) {
                result.delUserItems = delUserItems.split(',');
            }
            
            // 解析新增部门列表
            const addPartyItems = this.extractXmlValue(xmlString, 'AddPartyItems');
            if (addPartyItems) {
                result.addPartyItems = addPartyItems.split(',').map(id => parseInt(id, 10));
            }
            
            // 解析删除部门列表
            const delPartyItems = this.extractXmlValue(xmlString, 'DelPartyItems');
            if (delPartyItems) {
                result.delPartyItems = delPartyItems.split(',').map(id => parseInt(id, 10));
            }
            
            return result;
        } catch (error) {
            throw new Error(`解析标签成员变更事件XML失败: ${error.message}`);
        }
    }

    /**
     * 解析异步任务完成通知
     * @description 将企业微信异步任务完成的XML通知转换为JSON对象
     * @param {string} xmlString - 企业微信推送的XML格式通知内容
     * @returns {Object} 解析后的通知内容对象
     * @throws {Error} 当XML解析失败时抛出错误
     */
    parseBatchJobResultNotification(xmlString) {
        if (!xmlString) {
            throw new Error('XML内容不能为空');
        }

        try {
            // 创建结果对象
            const result = {};

            // 解析基本字段
            result.toUserName = this.extractXmlValue(xmlString, 'ToUserName');
            result.fromUserName = this.extractXmlValue(xmlString, 'FromUserName');
            result.createTime = parseInt(this.extractXmlValue(xmlString, 'CreateTime'), 10);
            result.msgType = this.extractXmlValue(xmlString, 'MsgType');
            result.event = this.extractXmlValue(xmlString, 'Event');
            
            // 解析BatchJob节点
            const batchJobBlock = this.extractXmlBlock(xmlString, 'BatchJob');
            if (batchJobBlock) {
                result.batchJob = {
                    jobId: this.extractXmlValue(batchJobBlock, 'JobId'),
                    jobType: this.extractXmlValue(batchJobBlock, 'JobType'),
                    errCode: parseInt(this.extractXmlValue(batchJobBlock, 'ErrCode'), 10),
                    errMsg: this.extractXmlValue(batchJobBlock, 'ErrMsg')
                };
            }

            return result;
        } catch (error) {
            throw new Error(`解析异步任务完成通知XML失败: ${error.message}`);
        }
    }
}


module.exports = Concats;