# 企业微信通讯录 - 异步导入 (Asyncimport)

`Asyncimport` 类是企业微信通讯录异步导入模块，提供了通过异步任务的方式批量导入或更新企业微信通讯录成员和部门的功能。适合处理大批量数据导入的场景。

## 目录

- [初始化](#初始化)
- [异步导入功能](#异步导入功能)
  - [增量更新成员](#增量更新成员)
  - [全量覆盖成员](#全量覆盖成员)
  - [全量覆盖部门](#全量覆盖部门)
  - [获取异步任务结果](#获取异步任务结果)

## 初始化

```javascript
const { Asyncimport } = require('@neuit/wecom');
const asyncimport = new Asyncimport();
```

## 异步导入功能

### 增量更新成员

以userid为主键，增量更新企业微信通讯录成员。该接口会将填写的成员信息与已有的成员信息合并，如果没有填写的字段不会被覆盖。

```javascript
/**
 * @param {Object} options - 更新选项
 * @returns {Promise<Object>} 包含jobid的对象
 */
await asyncimport.syncUser({
  media_id: 'MEDIA_ID',            // 必填，上传的csv文件的media_id
  to_invite: true,                  // 可选，是否邀请新建的成员使用企业微信，默认为true
  callback: {                       // 可选，回调信息
    url: 'https://example.com/callback',
    token: 'TOKEN',
    encodingaeskey: 'ENCODINGAESKEY'
  }
});
```

#### 参数详情

| 参数名                    | 类型    | 必填 | 描述                                       |
| ------------------------- | ------- | ---- | ------------------------------------------ |
| media_id                  | string  | 是   | 上传的csv文件的media_id                    |
| to_invite                 | boolean | 否   | 是否邀请新建的成员使用企业微信，默认为true |
| callback                  | Object  | 否   | 回调信息                                   |
| callback.url              | string  | 否   | 企业应用接收企业微信推送请求的地址         |
| callback.token            | string  | 否   | 用于生成签名                               |
| callback.encodingaeskey   | string  | 否   | 用于消息体的加密，AES密钥的Base64编码      |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  jobid: 'jobid_xxxxxx'  // 异步任务ID
}
```

### 全量覆盖成员

以userid为主键，全量覆盖企业的通讯录成员。任务完成后企业的通讯录成员将完全与提交的文件保持一致。

```javascript
/**
 * @param {Object} options - 导入选项
 * @returns {Promise<Object>} 包含jobid的对象
 */
await asyncimport.replaceUser({
  media_id: 'MEDIA_ID',            // 必填，上传的csv文件的media_id
  to_invite: true,                  // 可选，是否邀请新建的成员使用企业微信，默认为true
  callback: {                       // 可选，回调信息
    url: 'https://example.com/callback',
    token: 'TOKEN',
    encodingaeskey: 'ENCODINGAESKEY'
  }
});
```

#### 参数详情

| 参数名                    | 类型    | 必填 | 描述                                       |
| ------------------------- | ------- | ---- | ------------------------------------------ |
| media_id                  | string  | 是   | 上传的csv文件的media_id                    |
| to_invite                 | boolean | 否   | 是否邀请新建的成员使用企业微信，默认为true |
| callback                  | Object  | 否   | 回调信息                                   |
| callback.url              | string  | 否   | 企业应用接收企业微信推送请求的地址         |
| callback.token            | string  | 否   | 用于生成签名                               |
| callback.encodingaeskey   | string  | 否   | 用于消息体的加密，AES密钥的Base64编码      |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  jobid: 'jobid_xxxxxx'  // 异步任务ID
}
```

### 全量覆盖部门

以partyid为键，全量覆盖企业的通讯录组织架构。任务完成后企业的通讯录组织架构将完全与提交的文件保持一致。

```javascript
/**
 * @param {Object} options - 导入选项
 * @returns {Promise<Object>} 包含jobid的对象
 */
await asyncimport.replaceParty({
  media_id: 'MEDIA_ID',            // 必填，上传的csv文件的media_id
  callback: {                       // 可选，回调信息
    url: 'https://example.com/callback',
    token: 'TOKEN',
    encodingaeskey: 'ENCODINGAESKEY'
  }
});
```

#### 参数详情

| 参数名                    | 类型    | 必填 | 描述                                       |
| ------------------------- | ------- | ---- | ------------------------------------------ |
| media_id                  | string  | 是   | 上传的csv文件的media_id                    |
| callback                  | Object  | 否   | 回调信息                                   |
| callback.url              | string  | 否   | 企业应用接收企业微信推送请求的地址         |
| callback.token            | string  | 否   | 用于生成签名                               |
| callback.encodingaeskey   | string  | 否   | 用于消息体的加密，AES密钥的Base64编码      |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  jobid: 'jobid_xxxxxx'  // 异步任务ID
}
```

### 获取异步任务结果

获取已提交的异步任务的执行结果。可以通过轮询这个接口获取异步任务的完成情况。

```javascript
/**
 * @param {string} jobid - 异步任务ID
 * @returns {Promise<Object>} 包含任务状态和结果的对象
 */
await asyncimport.getBatchResult('jobid_xxxxxx');
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述                     |
| ------ | ------ | ---- | ------------------------ |
| jobid  | string | 是   | 异步任务ID，最大64字节   |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  status: 3,                 // 任务状态：1表示任务开始，2表示任务进行中，3表示任务已完成
  type: 'replace_user',      // 操作类型：sync_user、replace_user或replace_party
  total: 3,                  // 任务运行总条数
  percentage: 100,           // 任务完成百分比，100表示任务完成
  result: [                  // 详细结果，任务完成后有效
    {
      userid: 'zhangsan',
      errcode: 0,
      errmsg: 'ok'
    },
    {
      userid: 'lisi',
      errcode: 0,
      errmsg: 'ok'
    }
    // ... 更多结果
  ]
}
```

## 完整使用示例

```javascript
const { Asyncimport } = require('@neuit/wecom');

// 异步导入示例
async function importExample() {
  try {
    const asyncimport = new Asyncimport();
    
    // 1. 上传CSV文件获取media_id (使用其他接口完成)
    // 假设已获取到media_id
    const media_id = 'MEDIA_ID_EXAMPLE';
    
    // 2. 发起增量更新成员任务
    const syncResult = await asyncimport.syncUser({
      media_id: media_id,
      to_invite: true
    });
    console.log('增量更新任务已提交，任务ID:', syncResult.jobid);
    
    // 3. 轮询获取任务结果
    let isCompleted = false;
    const jobid = syncResult.jobid;
    
    while (!isCompleted) {
      const result = await asyncimport.getBatchResult(jobid);
      console.log(`任务进度: ${result.percentage}%`);
      
      if (result.status === 3) {  // 任务已完成
        isCompleted = true;
        console.log('任务已完成，结果:', result);
      } else {
        // 等待一段时间后再次查询
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
  } catch (error) {
    console.error('异步导入操作失败:', error);
  }
}

// 执行示例
importExample();
```

## 注意事项

1. 导入前需要先将CSV文件通过素材管理接口上传获取media_id
2. CSV文件的格式必须符合企业微信的要求，不同的导入类型有不同的格式要求
3. 全量覆盖操作会完全替换现有数据，请谨慎使用
4. 异步任务可能需要较长时间完成，建议通过轮询或回调方式获取结果
5. 回调方式需要配置可外网访问的URL，并实现相应的接收逻辑
6. 任务ID (jobid) 的有效期为7天
7. 导入文件中的敏感字段不允许明文导出，结果中会使用特定字符替代 