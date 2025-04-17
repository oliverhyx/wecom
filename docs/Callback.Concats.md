# 企业微信通讯录 - 回调通知处理 (Callback.Concats)

`Callback.Concats` 类是企业微信通讯录回调通知解析模块，提供了将企业微信推送的 XML 格式通知转换为 JSON 对象的功能，用于处理通讯录变更事件。

## 目录

- [初始化](#初始化)
- [通讯录成员变更事件](#通讯录成员变更事件)
  - [解析新增成员事件通知](#解析新增成员事件通知)
  - [解析更新成员事件通知](#解析更新成员事件通知)
  - [解析删除成员事件通知](#解析删除成员事件通知)
- [通讯录部门变更事件](#通讯录部门变更事件)
  - [解析新增部门事件通知](#解析新增部门事件通知)
  - [解析更新部门事件通知](#解析更新部门事件通知)
  - [解析删除部门事件通知](#解析删除部门事件通知)
- [标签变更事件](#标签变更事件)
  - [解析标签成员变更事件通知](#解析标签成员变更事件通知)
- [异步任务事件](#异步任务事件)
  - [解析异步任务完成通知](#解析异步任务完成通知)

## 初始化

```javascript
const { Callback } = require('@neuit/wecom');
const callbackConcats = new Callback.Concats();
```

## 通讯录成员变更事件

### 解析新增成员事件通知

解析企业微信推送的新增成员事件通知，转换为 JSON 格式便于处理。

```javascript
/**
 * @param {string} xmlString - 企业微信推送的XML格式通知内容
 * @returns {Object} 解析后的通知内容对象
 */
const result = callbackConcats.parseCreateUserNotification('<xml>...</xml>');
```

#### 参数详情

| 参数名    | 类型   | 必填 | 描述                          |
| --------- | ------ | ---- | ----------------------------- |
| xmlString | string | 是   | 企业微信推送的XML格式通知内容 |

#### 返回结果

```javascript
{
  toUserName: 'toUser',
  fromUserName: 'fromUser',
  createTime: 1234567890,           // 消息创建时间（整型）
  msgType: 'event',                 // 消息类型
  event: 'change_contact',          // 事件类型
  changeType: 'create_user',        // 变更类型
  userId: 'zhangsan',               // 成员UserID
  name: '张三',                     // 成员名称
  department: [1, 2],               // 成员所属部门id列表
  mainDepartment: 1,                // 主部门
  isLeaderInDept: [1, 0],           // 在所在的部门内是否为上级
  directLeader: ['lisi'],           // 直属上级UserID
  position: '产品经理',             // 职位信息
  mobile: '13800000000',            // 手机号码
  gender: 1,                        // 性别：1表示男性，2表示女性
  email: 'zhangsan@example.com',    // 邮箱
  bizMail: 'zhangsan@biz.example.com',  // 企业邮箱
  status: 1,                        // 激活状态: 1=已激活，2=已禁用，4=未激活
  avatar: 'http://wx.qlogo.cn/...',  // 头像url
  alias: 'jackzhang',               // 别名
  telephone: '020-123456',          // 座机
  address: '广州市天河区',          // 地址
  extAttr: {                        // 扩展属性
    attrs: [
      {
        name: '自定义属性',
        value: '自定义属性值'
      }
    ]
  }
}
```

### 解析更新成员事件通知

解析企业微信推送的更新成员事件通知，转换为 JSON 格式便于处理。

```javascript
/**
 * @param {string} xmlString - 企业微信推送的XML格式通知内容
 * @returns {Object} 解析后的通知内容对象
 */
const result = callbackConcats.parseUpdateUserEvent('<xml>...</xml>');
```

#### 参数详情

| 参数名    | 类型   | 必填 | 描述                          |
| --------- | ------ | ---- | ----------------------------- |
| xmlString | string | 是   | 企业微信推送的XML格式通知内容 |

#### 返回结果

```javascript
{
  toUserName: 'toUser',
  fromUserName: 'fromUser',
  createTime: 1234567890,           // 消息创建时间（整型）
  msgType: 'event',                 // 消息类型
  event: 'change_contact',          // 事件类型
  changeType: 'update_user',        // 变更类型
  userId: 'zhangsan',               // 成员UserID
  newUserId: 'zhangsan_new',        // 新的UserID，变更时存在
  // ... 其他字段与解析新增成员事件通知相同，但仅包含变更的字段
}
```

### 解析删除成员事件通知

解析企业微信推送的删除成员事件通知，转换为 JSON 格式便于处理。

```javascript
/**
 * @param {string} xmlString - 企业微信推送的XML格式通知内容
 * @returns {Object} 解析后的通知内容对象
 */
const result = callbackConcats.parseDeleteUserNotification('<xml>...</xml>');
```

#### 参数详情

| 参数名    | 类型   | 必填 | 描述                          |
| --------- | ------ | ---- | ----------------------------- |
| xmlString | string | 是   | 企业微信推送的XML格式通知内容 |

#### 返回结果

```javascript
{
  toUserName: 'toUser',
  fromUserName: 'fromUser',
  createTime: 1234567890,           // 消息创建时间（整型）
  msgType: 'event',                 // 消息类型
  event: 'change_contact',          // 事件类型
  changeType: 'delete_user',        // 变更类型
  userId: 'zhangsan'                // 成员UserID
}
```

## 通讯录部门变更事件

### 解析新增部门事件通知

解析企业微信推送的新增部门事件通知，转换为 JSON 格式便于处理。

```javascript
/**
 * @param {string} xmlString - 企业微信推送的XML格式通知内容
 * @returns {Object} 解析后的通知内容对象
 */
const result = callbackConcats.parseCreatePartyNotification('<xml>...</xml>');
```

#### 参数详情

| 参数名    | 类型   | 必填 | 描述                          |
| --------- | ------ | ---- | ----------------------------- |
| xmlString | string | 是   | 企业微信推送的XML格式通知内容 |

#### 返回结果

```javascript
{
  toUserName: 'toUser',
  fromUserName: 'fromUser',
  createTime: 1234567890,           // 消息创建时间（整型）
  msgType: 'event',                 // 消息类型
  event: 'change_contact',          // 事件类型
  changeType: 'create_party',       // 变更类型
  id: 2,                            // 部门id
  name: '研发部',                   // 部门名称
  parentId: 1,                      // 父部门id
  order: 1                          // 部门排序
}
```

### 解析更新部门事件通知

解析企业微信推送的更新部门事件通知，转换为 JSON 格式便于处理。

```javascript
/**
 * @param {string} xmlString - 企业微信推送的XML格式通知内容
 * @returns {Object} 解析后的通知内容对象
 */
const result = callbackConcats.parseUpdatePartyNotification('<xml>...</xml>');
```

#### 参数详情

| 参数名    | 类型   | 必填 | 描述                          |
| --------- | ------ | ---- | ----------------------------- |
| xmlString | string | 是   | 企业微信推送的XML格式通知内容 |

#### 返回结果

```javascript
{
  toUserName: 'toUser',
  fromUserName: 'fromUser',
  createTime: 1234567890,           // 消息创建时间（整型）
  msgType: 'event',                 // 消息类型
  event: 'change_contact',          // 事件类型
  changeType: 'update_party',       // 变更类型
  id: 2,                            // 部门id
  name: '技术研发部',               // 部门名称（变更时存在）
  parentId: 1                       // 父部门id（变更时存在）
}
```

### 解析删除部门事件通知

解析企业微信推送的删除部门事件通知，转换为 JSON 格式便于处理。

```javascript
/**
 * @param {string} xmlString - 企业微信推送的XML格式通知内容
 * @returns {Object} 解析后的通知内容对象
 */
const result = callbackConcats.parseDeletePartyNotification('<xml>...</xml>');
```

#### 参数详情

| 参数名    | 类型   | 必填 | 描述                          |
| --------- | ------ | ---- | ----------------------------- |
| xmlString | string | 是   | 企业微信推送的XML格式通知内容 |

#### 返回结果

```javascript
{
  toUserName: 'toUser',
  fromUserName: 'fromUser',
  createTime: 1234567890,           // 消息创建时间（整型）
  msgType: 'event',                 // 消息类型
  event: 'change_contact',          // 事件类型
  changeType: 'delete_party',       // 变更类型
  id: 2                             // 部门id
}
```

## 标签变更事件

### 解析标签成员变更事件通知

解析企业微信推送的标签成员变更事件通知，转换为 JSON 格式便于处理。

```javascript
/**
 * @param {string} xmlString - 企业微信推送的XML格式通知内容
 * @returns {Object} 解析后的通知内容对象
 */
const result = callbackConcats.parseUpdateTagNotification('<xml>...</xml>');
```

#### 参数详情

| 参数名    | 类型   | 必填 | 描述                          |
| --------- | ------ | ---- | ----------------------------- |
| xmlString | string | 是   | 企业微信推送的XML格式通知内容 |

#### 返回结果

```javascript
{
  toUserName: 'toUser',
  fromUserName: 'fromUser',
  createTime: 1234567890,           // 消息创建时间（整型）
  msgType: 'event',                 // 消息类型
  event: 'change_contact',          // 事件类型
  changeType: 'update_tag',         // 变更类型
  tagId: 1,                         // 标签id
  addUserItems: ['zhangsan', 'lisi'], // 标签中新增的成员userid列表
  delUserItems: ['wangwu'],         // 标签中删除的成员userid列表
  addPartyItems: [1, 2],            // 标签中新增的部门id列表
  delPartyItems: [3]                // 标签中删除的部门id列表
}
```

## 异步任务事件

### 解析异步任务完成通知

解析企业微信推送的异步任务完成通知，转换为 JSON 格式便于处理。适用于异步导入/导出任务。

```javascript
/**
 * @param {string} xmlString - 企业微信推送的XML格式通知内容
 * @returns {Object} 解析后的通知内容对象
 */
const result = callbackConcats.parseBatchJobResultNotification('<xml>...</xml>');
```

#### 参数详情

| 参数名    | 类型   | 必填 | 描述                          |
| --------- | ------ | ---- | ----------------------------- |
| xmlString | string | 是   | 企业微信推送的XML格式通知内容 |

#### 返回结果

```javascript
{
  toUserName: 'toUser',
  fromUserName: 'fromUser',
  createTime: 1234567890,           // 消息创建时间（整型）
  msgType: 'event',                 // 消息类型
  event: 'batch_job_result',        // 事件类型
  batchJob: {                       // 异步任务信息
    jobId: 'job_id_xxxxx',          // 异步任务id
    jobType: 'sync_user',           // 任务类型
    errCode: 0,                     // 错误码
    errMsg: 'ok'                    // 错误信息
  }
}
```

## 完整使用示例

```javascript
const { Callback } = require('@neuit/wecom');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

// 示例：设置回调服务器接收企业微信推送通知
async function setupCallbackServer() {
  const app = express();
  const PORT = 3000;
  
  // 配置解析XML的中间件
  app.use(bodyParser.text({ type: 'text/xml' }));
  
  // 企业微信通讯录回调处理
  const callbackConcats = new Callback.Concats();
  
  // 处理企业微信验证请求
  app.get('/callback', (req, res) => {
    const { msg_signature, timestamp, nonce, echostr } = req.query;
    // 验证URL有效性的逻辑...
    res.send(echostr);
  });
  
  // 处理企业微信推送的事件通知
  app.post('/callback', (req, res) => {
    try {
      const xmlString = req.body;
      
      // 判断事件类型并解析
      if (xmlString.includes('<ChangeType>create_user</ChangeType>')) {
        // 解析新增成员事件
        const result = callbackConcats.parseCreateUserNotification(xmlString);
        console.log('新增成员:', result);
        
        // 处理新增成员的业务逻辑...
      }
      else if (xmlString.includes('<ChangeType>update_user</ChangeType>')) {
        // 解析更新成员事件
        const result = callbackConcats.parseUpdateUserEvent(xmlString);
        console.log('更新成员:', result);
        
        // 处理更新成员的业务逻辑...
      }
      else if (xmlString.includes('<ChangeType>delete_user</ChangeType>')) {
        // 解析删除成员事件
        const result = callbackConcats.parseDeleteUserNotification(xmlString);
        console.log('删除成员:', result);
        
        // 处理删除成员的业务逻辑...
      }
      else if (xmlString.includes('<ChangeType>create_party</ChangeType>')) {
        // 解析新增部门事件
        const result = callbackConcats.parseCreatePartyNotification(xmlString);
        console.log('新增部门:', result);
        
        // 处理新增部门的业务逻辑...
      }
      else if (xmlString.includes('<ChangeType>update_party</ChangeType>')) {
        // 解析更新部门事件
        const result = callbackConcats.parseUpdatePartyNotification(xmlString);
        console.log('更新部门:', result);
        
        // 处理更新部门的业务逻辑...
      }
      else if (xmlString.includes('<ChangeType>delete_party</ChangeType>')) {
        // 解析删除部门事件
        const result = callbackConcats.parseDeletePartyNotification(xmlString);
        console.log('删除部门:', result);
        
        // 处理删除部门的业务逻辑...
      }
      else if (xmlString.includes('<ChangeType>update_tag</ChangeType>')) {
        // 解析标签成员变更事件
        const result = callbackConcats.parseUpdateTagNotification(xmlString);
        console.log('标签成员变更:', result);
        
        // 处理标签成员变更的业务逻辑...
      }
      else if (xmlString.includes('<Event>batch_job_result</Event>')) {
        // 解析异步任务完成通知
        const result = callbackConcats.parseBatchJobResultNotification(xmlString);
        console.log('异步任务完成:', result);
        
        // 处理异步任务完成的业务逻辑...
      }
      
      // 返回成功响应
      res.send('success');
    } catch (error) {
      console.error('处理回调失败:', error);
      res.status(500).send('处理失败');
    }
  });
  
  // 启动服务器
  app.listen(PORT, () => {
    console.log(`回调服务器启动在端口 ${PORT}`);
  });
}

// 执行示例
setupCallbackServer();
```

## 注意事项

1. 需要在企业微信管理后台配置通讯录变更回调地址并启用
2. 回调URL需要支持企业微信的验证请求，详见企业微信开发文档
3. 回调服务器必须可以从外网访问，建议使用HTTPS协议
4. 接收到XML通知后，需要根据XML内容判断事件类型，再调用相应的解析方法
5. 响应企业微信通知时必须返回字符串"success"，否则企业微信会重试
6. 解析方法仅负责将XML转换为JSON，处理业务逻辑需要在应用中实现
7. 推送给回调URL的XML数据需要进行解密，本示例假设已解密 