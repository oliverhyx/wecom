# 企业微信网页授权 (Authorize.Webauth)

`Authorize.Webauth` 类提供了企业微信网页授权相关功能，用于获取用户访问企业微信网页时的身份信息，支持静默授权和手动授权两种模式。

## 目录

- [初始化](#初始化)
- [网页授权功能](#网页授权功能)
  - [生成静默授权链接](#生成静默授权链接)
  - [生成手动授权链接](#生成手动授权链接)
  - [获取访问用户身份](#获取访问用户身份)
  - [获取访问用户敏感信息](#获取访问用户敏感信息)

## 初始化

```javascript
const { Authorize } = require('@neuit/wecom');
const webauth = new Authorize.Webauth();
```

## 网页授权功能

### 生成静默授权链接

生成用于获取成员基础信息的网页授权链接，用户无需手动操作，即可实现静默授权。

```javascript
/**
 * @param {string} url - 授权后重定向的回调链接地址
 * @param {string} agentId - 企业应用的id
 * @param {string} [state='STATE'] - 重定向后会带上state参数
 * @returns {string} 完整的网页授权链接
 */
const authUrl = webauth.setBaseInfoUrl('https://example.com/callback', '1000002', 'my_state');
```

#### 参数详情

| 参数名  | 类型   | 必填 | 描述                                   |
| ------- | ------ | ---- | -------------------------------------- |
| url     | string | 是   | 授权后重定向的回调链接地址             |
| agentId | string | 是   | 企业应用的id                           |
| state   | string | 否   | 重定向后会带上state参数，默认为'STATE' |

#### 返回结果

```
https://open.weixin.qq.com/connect/oauth2/authorize?appid=ww123456789&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&response_type=code&scope=snsapi_base&state=my_state&agentid=1000002#wechat_redirect
```

### 生成手动授权链接

生成用于获取成员敏感信息的网页授权链接，需用户手动点击同意授权。

```javascript
/**
 * @param {string} url - 授权后重定向的回调链接地址
 * @param {string} agentId - 企业应用的id
 * @param {string} [state='STATE'] - 重定向后会带上state参数
 * @returns {string} 完整的网页授权链接
 */
const authUrl = webauth.setPrivateInfoUrl('https://example.com/callback', '1000002', 'my_state');
```

#### 参数详情

| 参数名  | 类型   | 必填 | 描述                                   |
| ------- | ------ | ---- | -------------------------------------- |
| url     | string | 是   | 授权后重定向的回调链接地址             |
| agentId | string | 是   | 企业应用的id                           |
| state   | string | 否   | 重定向后会带上state参数，默认为'STATE' |

#### 返回结果

```
https://open.weixin.qq.com/connect/oauth2/authorize?appid=ww123456789&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&response_type=code&scope=snsapi_privateinfo&state=my_state&agentid=1000002#wechat_redirect
```

### 获取访问用户身份

根据授权回调的code获取成员信息，适用于自建应用与代开发应用。

```javascript
/**
 * @param {string} code - 通过成员授权获取到的code
 * @returns {Promise<Object>} 包含用户身份信息的对象
 */
const userInfo = await webauth.getUserInfo('CODE_FROM_CALLBACK');
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述                          |
| ------ | ------ | ---- | ----------------------------- |
| code   | string | 是   | 通过成员授权获取到的code      |

#### 返回结果

企业成员返回结果：

```javascript
{
  "errcode": 0,
  "errmsg": "ok",
  "userid": "zhangsan",
  "user_ticket": "USER_TICKET" // 仅当scope为snsapi_privateinfo且用户在应用可见范围内时返回
}
```

非企业成员返回结果：

```javascript
{
  "errcode": 0,
  "errmsg": "ok",
  "openid": "oFGhsxLJkjXegb4bLJk23432532",
  "external_userid": "woFGhsxLJkjXegb4bLJkhG92RQ" // 当且仅当用户是企业的客户时返回
}
```

### 获取访问用户敏感信息

根据user_ticket获取成员敏感信息，需要配合手动授权链接使用。

```javascript
/**
 * @param {string} user_ticket - 成员票据
 * @returns {Promise<Object>} 包含用户敏感信息的对象
 */
const userDetail = await webauth.getUserDetail('USER_TICKET_FROM_USERINFO');
```

#### 参数详情

| 参数名      | 类型   | 必填 | 描述                     |
| ----------- | ------ | ---- | ------------------------ |
| user_ticket | string | 是   | 成员票据，有效期为1800s  |

#### 返回结果

```javascript
{
  "errcode": 0,
  "errmsg": "ok",
  "userid": "zhangsan",
  "gender": "1",           // 性别。0表示未定义，1表示男性，2表示女性
  "avatar": "http://shp.qpic.cn/bizmp/xxx/0", // 头像url
  "qr_code": "https://open.work.weixin.qq.com/wwopen/userQRCode?vcode=xxx", // 员工个人二维码
  "mobile": "13800000000", // 手机号
  "email": "zhangsan@example.com", // 邮箱
  "biz_mail": "zhangsan@business.com", // 企业邮箱
  "address": "广州市海珠区新港中路" // 地址
}
```

## 完整使用示例

```javascript
const { Authorize } = require('@neuit/wecom');

// Web应用处理企业微信网页授权
async function handleWebAuth() {
  try {
    const webauth = new Authorize.Webauth();
    
    // 1. 构造静默授权链接（在网页中跳转到此URL）
    const redirectUri = 'https://example.com/callback';
    const agentId = '1000002';
    const authUrl = webauth.setBaseInfoUrl(redirectUri, agentId, 'state1');
    console.log('授权链接:', authUrl);
    
    // 2. 用户访问链接后，企业微信会跳转到您的回调页面，URL中包含code参数
    // 假设已经从回调URL的查询参数中获取了code
    const code = 'CODE_FROM_CALLBACK';
    
    // 3. 通过code获取用户身份信息
    const userInfo = await webauth.getUserInfo(code);
    console.log('用户身份信息:', userInfo);
    
    // 4. 如果需要获取敏感信息，必须使用手动授权链接
    const privateAuthUrl = webauth.setPrivateInfoUrl(redirectUri, agentId, 'state2');
    console.log('敏感信息授权链接:', privateAuthUrl);
    
    // 5. 用户手动授权后，通过获取的user_ticket获取敏感信息
    if (userInfo.user_ticket) {
      const userDetail = await webauth.getUserDetail(userInfo.user_ticket);
      console.log('用户敏感信息:', userDetail);
    }
    
  } catch (error) {
    console.error('网页授权处理失败:', error);
  }
}

// 执行示例
handleWebAuth();
```

## 注意事项

1. 回调链接域名必须在企业微信管理后台配置为可信域名
2. user_ticket仅当scope为snsapi_privateinfo且用户在应用可见范围内时返回
3. 敏感字段需要管理员在应用详情里选择，且成员手动授权确认后才返回
4. 获取敏感信息的user_ticket有效期为1800秒（30分钟）
5. code只能使用一次，5分钟未被使用会自动过期
6. 第三方应用无法获取手机、邮箱、企业邮箱、地址等敏感信息 