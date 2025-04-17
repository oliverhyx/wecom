# 企业微信扫码登录 (Authorize.Weblogin)

`Authorize.Weblogin` 类提供了企业微信扫码登录相关功能，用于实现网页上的企业微信扫码登录，支持自建应用和服务商应用两种登录方式。

## 目录

- [初始化](#初始化)
- [扫码登录功能](#扫码登录功能)
  - [生成企业应用扫码登录链接](#生成企业应用扫码登录链接)
  - [生成服务商应用扫码登录链接](#生成服务商应用扫码登录链接)
  - [获取访问用户身份](#获取访问用户身份)

## 初始化

```javascript
const { Authorize } = require('@neuit/wecom');
const weblogin = new Authorize.Weblogin();
```

## 扫码登录功能

### 生成企业应用扫码登录链接

生成用于企业自建应用的企业微信扫码登录链接，用户可使用企业微信APP扫码登录网页应用。

```javascript
/**
 * @param {string} url - 登录成功后重定向的回调链接地址
 * @param {string} agentId - 企业自建应用/服务商代开发应用的AgentID
 * @param {string} [state='STATE'] - 用于保持请求和回调的状态
 * @param {string} [lang] - 语言类型
 * @returns {string} 完整的企业微信扫码登录链接
 */
const loginUrl = weblogin.setCorpAppLoginUrl(
  'https://example.com/callback',
  '1000002',
  'my_state',
  'zh'
);
```

#### 参数详情

| 参数名  | 类型   | 必填 | 描述                                     |
| ------- | ------ | ---- | ---------------------------------------- |
| url     | string | 是   | 登录成功后重定向的回调链接地址           |
| agentId | string | 是   | 企业自建应用的AgentID                     |
| state   | string | 否   | 用于保持请求和回调的状态，默认为'STATE'   |
| lang    | string | 否   | 语言类型。zh：中文；en：英文              |

#### 返回结果

```
https://login.work.weixin.qq.com/wwlogin/sso/login?login_type=CorpApp&appid=ww123456789&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&state=my_state&agentid=1000002&lang=zh
```

### 生成服务商应用扫码登录链接

生成用于第三方服务商应用的企业微信扫码登录链接，用户可使用企业微信APP扫码登录第三方网页应用。

```javascript
/**
 * @param {string} url - 登录成功后重定向的回调链接地址
 * @param {string} agentId - 企业自建应用/服务商代开发应用的AgentID
 * @param {string} [state='STATE'] - 用于保持请求和回调的状态
 * @param {string} [lang] - 语言类型
 * @returns {string} 完整的服务商应用扫码登录链接
 */
const loginUrl = weblogin.setServiceAppLoginUrl(
  'https://example.com/callback',
  '1000002',
  'my_state',
  'zh'
);
```

#### 参数详情

| 参数名  | 类型   | 必填 | 描述                                     |
| ------- | ------ | ---- | ---------------------------------------- |
| url     | string | 是   | 登录成功后重定向的回调链接地址           |
| agentId | string | 是   | 企业自建应用或服务商应用的AgentID         |
| state   | string | 否   | 用于保持请求和回调的状态，默认为'STATE'   |
| lang    | string | 否   | 语言类型。zh：中文；en：英文              |

#### 返回结果

```
https://login.work.weixin.qq.com/wwlogin/sso/login?login_type=ServiceApp&appid=ww123456789&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&state=my_state&agentid=1000002&lang=zh
```

### 获取访问用户身份

扫码登录成功后，根据回调中的code获取成员信息，适用于自建应用与代开发应用。

```javascript
/**
 * @param {string} code - 通过成员授权获取到的code
 * @returns {Promise<Object>} 包含用户身份信息的对象
 */
const userInfo = await weblogin.getUserInfo('CODE_FROM_CALLBACK');
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
  "userid": "zhangsan"
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

## 完整使用示例

```javascript
const { Authorize } = require('@neuit/wecom');
const express = require('express');

// Web应用处理企业微信扫码登录
async function setupQrLogin() {
  const app = express();
  const weblogin = new Authorize.Weblogin();
  
  // 1. 生成登录页面
  app.get('/login', (req, res) => {
    // 构造扫码登录链接
    const redirectUri = 'https://example.com/callback';
    const agentId = '1000002';
    const loginUrl = weblogin.setCorpAppLoginUrl(redirectUri, agentId, 'login_state', 'zh');
    
    // 返回包含二维码的HTML页面
    res.send(`
      <html>
        <head><title>企业微信扫码登录</title></head>
        <body>
          <h1>请使用企业微信扫描以下二维码登录</h1>
          <img src="https://open.work.weixin.qq.com/wwopen/sso/qrImg?key=${encodeURIComponent(loginUrl)}" />
        </body>
      </html>
    `);
  });
  
  // 2. 处理回调
  app.get('/callback', async (req, res) => {
    try {
      const { code, state } = req.query;
      
      if (!code) {
        return res.status(400).send('Missing code parameter');
      }
      
      // 验证state参数，防止CSRF攻击
      if (state !== 'login_state') {
        return res.status(400).send('Invalid state parameter');
      }
      
      // 通过code获取用户身份信息
      const userInfo = await weblogin.getUserInfo(code);
      
      if (userInfo.errcode !== 0) {
        return res.status(500).send(`Login failed: ${userInfo.errmsg}`);
      }
      
      // 根据userid或openid创建会话
      if (userInfo.userid) {
        // 处理企业成员登录
        req.session.userId = userInfo.userid;
        req.session.isCorpUser = true;
      } else if (userInfo.openid) {
        // 处理非企业成员登录
        req.session.openId = userInfo.openid;
        req.session.isCorpUser = false;
        if (userInfo.external_userid) {
          req.session.externalUserId = userInfo.external_userid;
        }
      }
      
      // 登录成功，重定向到应用首页
      res.redirect('/');
    } catch (error) {
      console.error('处理登录回调失败:', error);
      res.status(500).send('Login callback processing failed');
    }
  });
  
  // 启动服务器
  app.listen(3000, () => {
    console.log('服务器已启动，请访问 http://localhost:3000/login 体验扫码登录');
  });
}

// 执行示例
setupQrLogin();
```

## 注意事项

1. redirect_uri的域名必须在企业微信管理后台配置为可信域名
2. 不同应用类型的配置方法不同：
   - 自建应用：需配置OAuth可信域名或Web网页授权回调域名
   - 代开发应用：需配置OAuth可信域名或Web网页授权回调域名
   - 第三方应用：需配置"登录授权"的可信域名
3. state参数建议使用随机值并保存在会话中，用于防止CSRF攻击
4. code只能使用一次，5分钟未被使用会自动过期
5. 登录授权页面适合集成到网站的登录入口，不建议作为强制登录入口
6. 登录成功后需根据userid或openid创建用户会话，实现持久登录状态 