# 企业微信通讯录 - 成员管理 (User)

`User` 类是企业微信通讯录成员管理模块，提供了完整的企业微信成员管理相关接口，包括创建、读取、更新、删除成员，以及更多成员管理功能。

## 目录

- [初始化](#初始化)
- [基本方法](#基本方法)
  - [创建成员](#创建成员)
  - [读取成员信息](#读取成员信息)
  - [更新成员信息](#更新成员信息)
  - [删除成员](#删除成员)
  - [批量删除成员](#批量删除成员)
- [部门成员管理](#部门成员管理)
  - [获取部门成员](#获取部门成员)
  - [获取部门成员详情](#获取部门成员详情)
- [OpenID与UserID转换](#openid与userid转换)
  - [将UserID转成OpenID](#将userid转成openid)
  - [将OpenID转成UserID](#将openid转成userid)
- [成员邀请与验证](#成员邀请与验证)
  - [二次验证](#二次验证)
  - [邀请成员](#邀请成员)
  - [获取加入企业二维码](#获取加入企业二维码)
- [成员查询](#成员查询)
  - [通过手机号获取UserID](#通过手机号获取userid)
  - [通过邮箱获取UserID](#通过邮箱获取userid)
  - [获取成员ID列表](#获取成员id列表)

## 初始化

```javascript
const { User } = require('@neuit/wecom');
const user = new User();
```

## 基本方法

### 创建成员

创建企业微信成员，若创建的成员已存在，将返回错误码。

```javascript
/**
 * @param {Object} params - 创建成员的参数
 * @returns {Promise<Object>} 创建结果
 */
await user.createUser({
  userid: 'zhangsan', // 必填，企业内必须唯一，1~64字节
  name: '张三',        // 必填，1~64个utf8字符
  mobile: '13800138000', // 手机号码与邮箱二者不能同时为空
  department: [1, 2],  // 成员所属部门id列表
  // ... 其他可选参数
});
```

#### 参数详情

| 参数名             | 类型        | 必填 | 描述                                       |
| ------------------ | ----------- | ---- | ------------------------------------------ |
| userid             | string      | 是   | 成员UserID，企业内必须唯一，1~64字节       |
| name               | string      | 是   | 成员名称，1~64个utf8字符                   |
| alias              | string      | 否   | 成员别名，1~64个utf8字符                   |
| mobile             | string      | 否*  | 手机号码，企业内必须唯一                   |
| department         | number[]    | 否   | 成员所属部门id列表，不超过100个            |
| order              | number[]    | 否   | 部门内的排序值，与department数量一致       |
| position           | string      | 否   | 职务信息，0~128个字符                      |
| gender             | string      | 否   | 性别：1-男性，2-女性                       |
| email              | string      | 否*  | 邮箱，企业内必须唯一                       |
| biz_mail           | string      | 否   | 企业邮箱，需企业开通企业邮箱               |
| telephone          | string      | 否   | 座机，32字节以内                           |
| is_leader_in_dept  | number[]    | 否   | 是否为部门负责人，与department数量一致     |
| direct_leader      | string[]    | 否   | 直属上级UserID，最多1个                    |
| avatar_mediaid     | string      | 否   | 成员头像的mediaid                          |
| enable             | number      | 否   | 启用/禁用成员：1-启用(默认)，0-禁用        |
| extattr            | Object      | 否   | 扩展属性                                   |
| to_invite          | boolean     | 否   | 是否邀请该成员使用企业微信，默认true       |
| external_position  | string      | 否   | 对外职务，不超过12个汉字                   |
| external_profile   | Object      | 否   | 成员对外属性                               |
| address            | string      | 否   | 地址，不超过128个字符                      |
| main_department    | number      | 否   | 主部门                                     |

*注：mobile和email必须至少有一个非空

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'created'
}
```

### 读取成员信息

读取企业微信成员的详细信息。

```javascript
/**
 * @param {Object} params - 请求参数
 * @returns {Promise<Object>} 成员信息
 */
await user.getUser({
  userid: 'zhangsan' // 成员UserID
});
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述                               |
| ------ | ------ | ---- | ---------------------------------- |
| userid | string | 是   | 成员UserID，1~64字节               |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  userid: 'zhangsan',
  name: '张三',
  department: [1, 2],
  position: '产品经理',
  mobile: '13800138000',
  gender: '1',
  email: 'zhangsan@example.com',
  avatar: 'http://wx.qlogo.cn/...',
  // ... 其他返回字段
}
```

### 更新成员信息

更新企业微信成员信息。

```javascript
/**
 * @param {Object} params - 请求参数
 * @returns {Promise<Object>} 更新结果
 */
await user.updateUser({
  userid: 'zhangsan', // 必填，要更新的成员UserID
  name: '张三三',      // 可选，更新的名称
  // ... 其他可选参数，与createUser参数基本一致
});
```

#### 参数详情

参数与 [创建成员](#创建成员) 相同，但仅 `userid` 是必填的。

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'updated'
}
```

### 删除成员

删除企业微信成员，若成员绑定了企业邮箱，则同时删除邮箱账号。

```javascript
/**
 * @param {string} userid - 成员UserID
 * @returns {Promise<Object>} 删除结果
 */
await user.deleteUser('zhangsan');
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述                               |
| ------ | ------ | ---- | ---------------------------------- |
| userid | string | 是   | 成员UserID，1~64字节               |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'deleted'
}
```

### 批量删除成员

批量删除企业微信成员。

```javascript
/**
 * @param {string[]} useridlist - 成员UserID列表
 * @returns {Promise<Object>} 删除结果
 */
await user.batchDeleteUser(['zhangsan', 'lisi', 'wangwu']);
```

#### 参数详情

| 参数名     | 类型     | 必填 | 描述                           |
| ---------- | -------- | ---- | ------------------------------ |
| useridlist | string[] | 是   | 成员UserID列表，最多支持200个  |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'deleted'
}
```

## 部门成员管理

### 获取部门成员

获取部门成员列表，返回的是基础信息（userid、name等），若需要详细信息请使用 [获取部门成员详情](#获取部门成员详情)。

```javascript
/**
 * @param {number} department_id - 部门ID
 * @returns {Promise<Object>} 部门成员列表
 */
await user.getDepartmentUsers(1);
```

#### 参数详情

| 参数名        | 类型   | 必填 | 描述        |
| ------------- | ------ | ---- | ----------- |
| department_id | number | 是   | 部门ID      |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  userlist: [
    {
      userid: 'zhangsan',
      name: '张三',
      department: [1, 2]
    },
    {
      userid: 'lisi',
      name: '李四',
      department: [1]
    }
    // ... 更多成员
  ]
}
```

### 获取部门成员详情

获取部门成员的详细信息列表。

```javascript
/**
 * @param {number} department_id - 部门ID
 * @returns {Promise<Object>} 部门成员详细信息列表
 */
await user.getDepartmentUserDetails(1);
```

#### 参数详情

| 参数名        | 类型   | 必填 | 描述        |
| ------------- | ------ | ---- | ----------- |
| department_id | number | 是   | 部门ID      |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  userlist: [
    {
      userid: 'zhangsan',
      name: '张三',
      department: [1, 2],
      position: '产品经理',
      mobile: '13800138000',
      gender: '1',
      email: 'zhangsan@example.com',
      avatar: 'http://wx.qlogo.cn/...',
      // ... 更多详细字段
    }
    // ... 更多成员
  ]
}
```

## OpenID与UserID转换

### 将UserID转成OpenID

将企业微信的UserID转成微信的OpenID，常用于企业支付场景。

```javascript
/**
 * @param {string} userid - 企业微信的成员UserID
 * @returns {Promise<Object>} 包含OpenID的结果
 */
await user.convertToOpenid('zhangsan');
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述              |
| ------ | ------ | ---- | ----------------- |
| userid | string | 是   | 企业微信的成员ID  |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  openid: 'oDOGms-6yCnGrRovBj2yHij5JL6E'
}
```

### 将OpenID转成UserID

将微信的OpenID转成企业微信的UserID。

```javascript
/**
 * @param {string} openid - 微信的OpenID
 * @returns {Promise<Object>} 包含UserID的结果
 */
await user.convertToUserid('oDOGms-6yCnGrRovBj2yHij5JL6E');
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述          |
| ------ | ------ | ---- | ------------- |
| openid | string | 是   | 微信的OpenID  |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  userid: 'zhangsan'
}
```

## 成员邀请与验证

### 二次验证

当企业开启二次验证时，在成员尝试加入企业时，调用此接口确认成员可加入企业。

```javascript
/**
 * @param {string} userid - 成员UserID
 * @returns {Promise<Object>} 操作结果
 */
await user.authSucc('zhangsan');
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述         |
| ------ | ------ | ---- | ------------ |
| userid | string | 是   | 成员UserID   |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok'
}
```

### 邀请成员

批量邀请成员加入企业微信，会通过短信或邮件发送邀请通知。

```javascript
/**
 * @param {Object} params - 邀请成员的参数
 * @returns {Promise<Object>} 邀请结果
 */
await user.inviteUser({
  user: ['zhangsan', 'lisi'],     // 成员ID列表
  party: [1, 2],                  // 部门ID列表
  tag: [1, 2]                     // 标签ID列表
});
```

#### 参数详情

| 参数名 | 类型     | 必填 | 描述                        |
| ------ | -------- | ---- | --------------------------- |
| user   | string[] | 否*  | 成员ID列表，最多1000个      |
| party  | number[] | 否*  | 部门ID列表，最多100个       |
| tag    | number[] | 否*  | 标签ID列表，最多100个       |

*注：user、party、tag三者不能同时为空

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  invaliduser: ['zhangsan'], // 无效的成员ID列表
  invalidparty: [],          // 无效的部门ID列表 
  invalidtag: []             // 无效的标签ID列表
}
```

### 获取加入企业二维码

获取实时成员加入企业的二维码，可用于让未激活的成员扫码加入企业。

```javascript
/**
 * @param {number} [sizeType] - 二维码尺寸类型
 * @returns {Promise<Object>} 包含二维码链接的结果
 */
await user.getJoinQrcode(2); // 尺寸类型2: 399 x 399
```

#### 参数详情

| 参数名   | 类型   | 必填 | 描述                                              |
| -------- | ------ | ---- | ------------------------------------------------- |
| sizeType | number | 否   | 二维码尺寸类型：1(171x171), 2(399x399), 3(741x741), 4(2052x2052) |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  join_qrcode: 'https://wework.qpic.cn/...'
}
```

## 成员查询

### 通过手机号获取UserID

通过手机号查询对应的企业微信成员UserID。

```javascript
/**
 * @param {string} mobile - 手机号码
 * @returns {Promise<Object>} 包含UserID的结果
 */
await user.getUseridByMobile('13800138000');
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述                       |
| ------ | ------ | ---- | -------------------------- |
| mobile | string | 是   | 手机号码，5~32个字节       |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  userid: 'zhangsan'
}
```

### 通过邮箱获取UserID

通过邮箱查询对应的企业微信成员UserID。

```javascript
/**
 * @param {string} email - 邮箱
 * @param {number} [emailType] - 邮箱类型
 * @returns {Promise<Object>} 包含UserID的结果
 */
await user.getUseridByEmail('zhangsan@example.com', 1);
```

#### 参数详情

| 参数名    | 类型   | 必填 | 描述                         |
| --------- | ------ | ---- | ---------------------------- |
| email     | string | 是   | 邮箱                         |
| emailType | number | 否   | 邮箱类型：1-企业邮箱，2-个人邮箱 |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  userid: 'zhangsan'
}
```

### 获取成员ID列表

获取企业成员的UserID与对应的部门ID列表，支持分页查询。

```javascript
/**
 * @param {Object} [options] - 请求选项
 * @returns {Promise<Object>} 包含用户-部门关系列表的结果
 */
await user.listUserIds({
  cursor: 'abcd1234', // 分页游标，首次不填
  limit: 100          // 单次拉取数量，1~10000
});
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述                             |
| ------ | ------ | ---- | -------------------------------- |
| cursor | string | 否   | 分页游标，由上次调用返回，首次不填 |
| limit  | number | 否   | 单次拉取数量，1~10000            |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  next_cursor: 'efgh5678', // 下次请求的游标
  dept_user: [
    {
      userid: 'zhangsan',
      department: [1, 2]
    },
    {
      userid: 'lisi',
      department: [1]
    }
    // ... 更多成员
  ]
}
```

## 完整使用示例

```javascript
const { User } = require('@neuit/wecom');

// 创建用户管理实例
async function userManagement() {
  try {
    const user = new User();
    
    // 创建成员
    const createResult = await user.createUser({
      userid: 'newuser001',
      name: '测试用户',
      mobile: '13800138001',
      department: [1]
    });
    console.log('创建成员结果:', createResult);
    
    // 获取成员信息
    const userInfo = await user.getUser({
      userid: 'newuser001'
    });
    console.log('成员信息:', userInfo);
    
    // 更新成员信息
    const updateResult = await user.updateUser({
      userid: 'newuser001',
      name: '测试用户已更新',
      position: '工程师'
    });
    console.log('更新成员结果:', updateResult);
    
    // 获取部门成员
    const departmentUsers = await user.getDepartmentUsers(1);
    console.log('部门成员数量:', departmentUsers.userlist.length);
    
    // 邀请成员
    const inviteResult = await user.inviteUser({
      user: ['newuser001']
    });
    console.log('邀请成员结果:', inviteResult);
    
    // 最后删除测试成员
    const deleteResult = await user.deleteUser('newuser001');
    console.log('删除成员结果:', deleteResult);
    
  } catch (error) {
    console.error('成员管理操作失败:', error);
  }
}

// 执行示例
userManagement();
``` 