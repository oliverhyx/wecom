# 企业微信通讯录 - 异步导出 (Asyncoutport)

`Asyncoutport` 类是企业微信通讯录异步导出模块，提供了通过异步任务的方式批量导出企业微信通讯录成员、部门和标签的功能。适合处理大批量数据导出的场景。

## 目录

- [初始化](#初始化)
- [导出功能](#导出功能)
  - [异步导出成员](#异步导出成员)
  - [异步导出成员详情](#异步导出成员详情)
  - [异步导出部门](#异步导出部门)
  - [异步导出标签成员](#异步导出标签成员)
  - [获取异步导出结果](#获取异步导出结果)
- [通知处理](#通知处理)
  - [解析异步导出任务完成通知](#解析异步导出任务完成通知)

## 初始化

```javascript
const { Asyncoutport } = require('@neuit/wecom');
const asyncoutport = new Asyncoutport();
```

## 导出功能

### 异步导出成员

异步导出企业微信通讯录成员，返回任务ID。导出的数据包括成员基础信息。

```javascript
/**
 * @param {Object} options - 导出选项
 * @returns {Promise<Object>} 包含任务ID的对象
 */
await asyncoutport.exportSimpleUser({
  encoding_aeskey: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrst',  // 必填，43位加密密钥
  block_size: 100000                                                  // 可选，每块数据的人员数
});
```

#### 参数详情

| 参数名          | 类型   | 必填 | 描述                                             |
| --------------- | ------ | ---- | ------------------------------------------------ |
| encoding_aeskey | string | 是   | Base64编码的加密密钥，长度固定为43，a-z,A-Z,0-9  |
| block_size      | number | 否   | 每块数据的人员数，范围10^4~10^6，默认为10^6      |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  jobid: 'jobid_xxxxxx'  // 异步任务ID
}
```

### 异步导出成员详情

异步导出企业微信通讯录成员详情，返回任务ID。导出的数据包括成员的详细信息。

```javascript
/**
 * @param {Object} options - 导出选项
 * @returns {Promise<Object>} 包含任务ID的对象
 */
await asyncoutport.exportUser({
  encoding_aeskey: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrst',  // 必填，43位加密密钥
  block_size: 100000                                                  // 可选，每块数据的人员数
});
```

#### 参数详情

| 参数名          | 类型   | 必填 | 描述                                             |
| --------------- | ------ | ---- | ------------------------------------------------ |
| encoding_aeskey | string | 是   | Base64编码的加密密钥，长度固定为43，a-z,A-Z,0-9  |
| block_size      | number | 否   | 每块数据的人员数，范围10^4~10^6，默认为10^6      |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  jobid: 'jobid_xxxxxx'  // 异步任务ID
}
```

### 异步导出部门

异步导出企业微信通讯录部门，返回任务ID。导出的数据包括部门的详细信息。

```javascript
/**
 * @param {Object} options - 导出选项
 * @returns {Promise<Object>} 包含任务ID的对象
 */
await asyncoutport.exportDepartment({
  encoding_aeskey: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrst',  // 必填，43位加密密钥
  block_size: 100000                                                  // 可选，每块数据的部门数
});
```

#### 参数详情

| 参数名          | 类型   | 必填 | 描述                                             |
| --------------- | ------ | ---- | ------------------------------------------------ |
| encoding_aeskey | string | 是   | Base64编码的加密密钥，长度固定为43，a-z,A-Z,0-9  |
| block_size      | number | 否   | 每块数据的部门数，范围10^4~10^6，默认为10^6      |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  jobid: 'jobid_xxxxxx'  // 异步任务ID
}
```

### 异步导出标签成员

异步导出企业微信标签成员，返回任务ID。导出的数据包括特定标签下的成员和部门列表。

```javascript
/**
 * @param {Object} options - 导出选项
 * @returns {Promise<Object>} 包含任务ID的对象
 */
await asyncoutport.exportTagUser({
  tagid: 1,                                                           // 必填，标签ID
  encoding_aeskey: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrst',  // 必填，43位加密密钥
  block_size: 100000                                                  // 可选，每块数据的人员数和部门数之和
});
```

#### 参数详情

| 参数名          | 类型   | 必填 | 描述                                                |
| --------------- | ------ | ---- | --------------------------------------------------- |
| tagid           | number | 是   | 需要导出的标签ID                                    |
| encoding_aeskey | string | 是   | Base64编码的加密密钥，长度固定为43，a-z,A-Z,0-9     |
| block_size      | number | 否   | 每块数据的人员数和部门数之和，范围10^4~10^6，默认为10^6 |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  jobid: 'jobid_xxxxxx'  // 异步任务ID
}
```

### 获取异步导出结果

获取异步导出企业微信通讯录的结果。可以通过轮询这个接口获取异步任务的完成情况和结果数据。

```javascript
/**
 * @param {string} jobid - 导出任务接口返回的任务ID
 * @returns {Promise<Object>} 包含导出结果的对象
 */
await asyncoutport.getExportResult('jobid_xxxxxx');
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述                     |
| ------ | ------ | ---- | ------------------------ |
| jobid  | string | 是   | 异步任务ID               |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  status: 2,                 // 任务状态：1-处理中，2-完成，3-失败
  data_list: [               // 数据列表，任务完成后有效
    {
      url: 'https://xxx',    // 数据下载链接，需使用加密密钥进行解密
      size: 1024,            // 文件大小，单位字节
      md5: 'xxxxxx'          // 文件md5
    }
    // ... 更多数据块
  ]
}
```

## 通知处理

### 解析异步导出任务完成通知

解析企业微信异步导出任务完成的XML通知，转换为JSON对象格式。当配置了回调URL时，企业微信会在任务完成后推送通知。

```javascript
/**
 * @param {string} xmlString - 企业微信推送的XML格式通知内容
 * @returns {Object} 解析后的通知内容对象
 */
const notification = asyncoutport.parseExportNotification('<xml>...</xml>');
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
  createTime: 1234567890,
  msgType: 'event',
  event: 'batch_job_result',
  batchJob: {
    jobId: 'jobid_xxxxxx',
    jobType: 'export_simple_user',
    errCode: 0,
    errMsg: 'ok'
  }
}
```

## 完整使用示例

```javascript
const { Asyncoutport } = require('@neuit/wecom');
const crypto = require('crypto'); // 用于生成加密密钥

// 异步导出示例
async function exportExample() {
  try {
    const asyncoutport = new Asyncoutport();
    
    // 1. 生成随机的43位加密密钥
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let encoding_aeskey = '';
    for (let i = 0; i < 43; i++) {
      encoding_aeskey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    console.log('生成的加密密钥:', encoding_aeskey);
    
    // 2. 发起异步导出成员任务
    const exportResult = await asyncoutport.exportUser({
      encoding_aeskey: encoding_aeskey,
      block_size: 100000
    });
    console.log('成员导出任务已提交，任务ID:', exportResult.jobid);
    
    // 3. 轮询获取任务结果
    let isCompleted = false;
    const jobid = exportResult.jobid;
    
    while (!isCompleted) {
      const result = await asyncoutport.getExportResult(jobid);
      console.log(`任务状态: ${result.status}`);
      
      if (result.status === 2) {  // 任务已完成
        isCompleted = true;
        console.log('任务已完成，可下载的数据列表:', result.data_list);
        
        // 处理下载链接...
        // 注意：下载后的数据需要使用之前的encoding_aeskey进行解密
      } else if (result.status === 3) { // 任务失败
        isCompleted = true;
        console.error('导出任务失败:', result.errmsg);
      } else {
        // 等待一段时间后再次查询
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
  } catch (error) {
    console.error('异步导出操作失败:', error);
  }
}

// 执行示例
exportExample();
```

## 注意事项

1. 加密密钥必须是43位，且只能包含a-z, A-Z, 0-9字符
2. 导出的数据文件需要使用提交任务时指定的加密密钥解密
3. 导出任务下载链接的有效期较短，建议尽快下载
4. 导出任务可能需要较长时间完成，建议使用轮询或回调方式获取结果
5. 出于安全考虑，手机号等敏感字段在导出时会被部分隐藏
6. 任务ID (jobid) 的有效期为7天
7. 当设置了回调URL时，企业微信会在任务完成后推送XML格式的通知，可使用parseExportNotification方法解析 