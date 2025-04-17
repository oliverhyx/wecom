# 企业微信二次验证 (Authorize.Authsucc)

`Authorize.Authsucc` 类提供了企业微信二次验证相关功能，用于实现企业成员首次登录时的验证机制，确保成员身份的可靠性和安全性。

## 目录

- [初始化](#初始化)
- [二次验证功能](#二次验证功能)
  - [获取用户二次验证信息](#获取用户二次验证信息)
  - [通过二次验证](#通过二次验证)
  - [使用二次验证](#使用二次验证)

## 初始化

```javascript
const { Authorize } = require('@neuit/wecom');
const authsucc = new Authorize.Authsucc();
```

## 二次验证功能

### 获取用户二次验证信息

根据二次验证页面的code获取成员的二次验证信息，适用于通讯录同步或自建应用。

```javascript
/**
 * @param {string} code - 用户进入二次验证页面时，企业微信颁发的code
 * @returns {Promise<Object>} 包含用户二次验证信息的对象
 */
const tfaInfo = await authsucc.getTfaInfo('CODE_FROM_VERIFICATION_PAGE');
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述                                 |
| ------ | ------ | ---- | ------------------------------------ |
| code   | string | 是   | 企业微信颁发的二次验证code，最大512字节 |

#### 返回结果

```javascript
{
  "errcode": 0,
  "errmsg": "ok",
  "userid": "zhangsan",
  "tfa_code": "TFA_CODE_123456" // 二次验证授权码，有效期五分钟，只能使用一次
}
```

### 通过二次验证

当企业开启二次验证时，对于首次加入企业的成员，企业可以通过调用此接口让成员通过验证并成功加入企业。

```javascript
/**
 * @param {string} userid - 成员UserID
 * @returns {Promise<Object>} 包含操作结果的对象
 */
const result = await authsucc.authSucc('zhangsan');
```

#### 参数详情

| 参数名  | 类型   | 必填 | 描述               |
| ------- | ------ | ---- | ------------------ |
| userid  | string | 是   | 成员UserID         |

#### 返回结果

```javascript
{
  "errcode": 0,
  "errmsg": "ok"
}
```

### 使用二次验证

使用获取到的二次验证授权码让成员通过二次验证，适用于通讯录同步或者自建应用场景。

```javascript
/**
 * @param {string} userid - 成员UserID
 * @param {string} tfa_code - 二次验证授权码
 * @returns {Promise<Object>} 包含操作结果的对象
 */
const result = await authsucc.tfaSucc('zhangsan', 'TFA_CODE_123456');
```

#### 参数详情

| 参数名   | 类型   | 必填 | 描述               |
| -------- | ------ | ---- | ------------------ |
| userid   | string | 是   | 成员UserID         |
| tfa_code | string | 是   | 二次验证授权码     |

#### 返回结果

```javascript
{
  "errcode": 0,
  "errmsg": "ok"
}
```

## 完整使用示例

```javascript
const { Authorize } = require('@neuit/wecom');
const express = require('express');

// Web应用处理企业微信二次验证
async function handleTwoFactorAuth() {
  const app = express();
  const authsucc = new Authorize.Authsucc();
  
  // 1. 配置企业微信二次验证页面的回调
  app.get('/tfa-verify', async (req, res) => {
    try {
      const { code } = req.query;
      
      if (!code) {
        return res.status(400).send('缺少验证码参数');
      }
      
      // 通过code获取用户的二次验证信息
      const tfaInfo = await authsucc.getTfaInfo(code);
      
      if (tfaInfo.errcode !== 0) {
        return res.status(500).send(`获取二次验证信息失败: ${tfaInfo.errmsg}`);
      }
      
      // 获取到用户ID和二次验证授权码
      const { userid, tfa_code } = tfaInfo;
      
      // 显示验证页面（可以根据业务需求自定义验证流程）
      res.send(`
        <html>
          <head><title>企业微信账号验证</title></head>
          <body>
            <h1>账号二次验证</h1>
            <p>用户ID: ${userid}</p>
            <form action="/confirm-tfa" method="post">
              <input type="hidden" name="userid" value="${userid}">
              <input type="hidden" name="tfa_code" value="${tfa_code}">
              <p>请确认您的身份信息并点击验证按钮</p>
              <button type="submit">确认身份并验证</button>
            </form>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('处理二次验证请求失败:', error);
      res.status(500).send('验证处理失败');
    }
  });
  
  // 2. 处理用户确认后的验证请求
  app.post('/confirm-tfa', async (req, res) => {
    try {
      const { userid, tfa_code } = req.body;
      
      if (!userid || !tfa_code) {
        return res.status(400).send('参数不完整');
      }
      
      // 方法一：使用 authSucc 方法（仅通讯录同步可调用）
      // const result = await authsucc.authSucc(userid);
      
      // 方法二：使用 tfaSucc 方法（通讯录同步或自建应用均可调用）
      const result = await authsucc.tfaSucc(userid, tfa_code);
      
      if (result.errcode !== 0) {
        return res.status(500).send(`二次验证失败: ${result.errmsg}`);
      }
      
      // 验证成功，重定向到成功页面
      res.send(`
        <html>
          <head><title>验证成功</title></head>
          <body>
            <h1>恭喜！验证成功</h1>
            <p>您已成功通过企业微信的二次验证</p>
            <p>现在您可以开始使用企业微信的相关功能了</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('二次验证提交失败:', error);
      res.status(500).send('验证失败');
    }
  });
  
  // 启动服务器
  app.listen(3000, () => {
    console.log('二次验证服务已启动，请在企业微信管理后台配置二次验证URL为: http://your-domain.com/tfa-verify');
  });
}

// 执行示例
handleTwoFactorAuth();
```

## 注意事项

1. 二次验证功能需要在企业微信管理后台配置并启用
2. 管理后台必须填写企业二次验证页面的URL，用户首次登录时会自动跳转到此URL
3. getTfaInfo 的接口并发限制为20
4. authSucc 仅『通讯录同步』可调用，调用频率限制为600次/分钟
5. tfaSucc 可由『通讯录同步』或者自建应用调用，并发限制为20次/分钟
6. tfa_code 五分钟内有效且只能使用一次
7. 自建应用使用 tfaSucc 时，用户需要在二次验证范围和应用可见范围内
8. 验证页面的链接必须填该自建应用的oauth2链接 