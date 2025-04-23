//#region 导入依赖
const request = require("request"); // HTTP请求库
const crypto = require("crypto"); // 加密库，用于生成签名
const config = require('../config'); // 配置文件
const path = require('path') // 路径处理
const fs = require('fs') // 文件系统操作
const xml2js = require('xml2js') // 将XML转换为JSON
//#endregion

/**
 * 企业微信API基础类
 * 处理access_token的获取和缓存等基础功能
 * @public {function} getJssdkConfig - 获取应用级JSSDK配置
 * @public {function} getCropJssdkConfig - 获取企业级级JSSDK配置
 * @public {function} getJsApiTicket - 获取jsapi_ticket
 * @public {function} getCorpJsApiTicket - 获取企业jsapi_ticket
 * @public {function} getAccessToken - 获取access_token
 * @public {function} curl - 发送HTTP请求
 * @public {function} extractXmlValue - 从XML字符串中提取指定标签的值
 * 
 */
class Base {

	constructor() {
		this.corpid = config.getConfig('corpid'); // 企业ID
		this.corpsecret = config.getConfig('agent_secret'); // 应用密钥
		this.cache_mode = config.getConfig('cache_mode') || 'file'; // 缓存模式，默认为文件缓存
		if (this.cache_mode === 'file') {
			const path = require('path');
			// 设置token存储路径
			this.tokenDir = path.resolve(process.cwd(), '.neuit');
			this.tokenFile = path.join(this.tokenDir, `${this.corpsecret}_access_token.json`);
		}
	}



	//#region 公开方法

	/**
	 * 接收并处理企业微信回调消息
	 * @description 用于接收企业微信POST请求回调的消息，验证签名并解密消息内容
	 * @param {Object} params - 请求参数
	 * @param {string} params.msg_signature - 企业微信加密签名
	 * @param {string} params.timestamp - 时间戳
	 * @param {string} params.nonce - 随机数
	 * @param {string} postData - POST请求的XML数据
	 * @param {string} token - 企业微信后台配置的Token
	 * @param {string} encodingAESKey - 企业微信后台配置的EncodingAESKey
	 * @returns {Object} 解密后的消息内容对象
	 * @example
	 * // 接收回调消息示例
	 * const result = await base.receiveMessage({
	 *   msg_signature: 'ASDFQWEXZCVAQFASDFASDFSS',
	 *   timestamp: '13500001234',
	 *   nonce: '123412323'
	 * }, postData, 'your_token', 'your_encoding_aes_key');
	 */
	async receiveMessage(params, postData, token, encodingAESKey) {
		const _token = token || config.getConfig('token');
		const _encodingAESKey = encodingAESKey || config.getConfig('encodingAESKey');
		// 提取请求参数
		const {
			msg_signature,
			timestamp,
			nonce
		} = params;

		// 从XML中提取加密消息
		const encrypt = this.extractXmlValue(postData, 'Encrypt');
		console.log('encrypt=>', encrypt)
		if (!encrypt) {
			throw new Error('无法从请求中提取加密消息');
		}

		// getSignature(token, timestamp, nonce, echostr) {
		// 验证签名
		const signature = this.getSignature(_token, timestamp, nonce, encrypt);
		console.log('signature=>', signature, msg_signature)
		if (signature !== msg_signature) {
			throw new Error('消息签名验证失败');
		}

		// 解密消息
		const decryptedMsg = this.decryptEchoStr(encrypt, _encodingAESKey);

		console.log('decryptedMsg=>', decryptedMsg)

		// 将XML转换为JSON
		const json = await xml2js.parseStringPromise(decryptedMsg);

		return json;
	}

	/**
	 * 构造回复企业微信的加密消息
	 * @description 用于构造回复企业微信回调的加密消息
	 * @param {string} replyMsg - 要回复的消息内容，可以是XML格式的字符串
	 * @param {string} timestamp - 时间戳，可选，默认为当前时间戳
	 * @param {string} nonce - 随机数，可选，默认自动生成
	 * @param {string} token - 企业微信后台配置的Token
	 * @param {string} encodingAESKey - 企业微信后台配置的EncodingAESKey
	 * @param {string} corpid - 企业微信的CorpID
	 * @returns {string} 构造好的XML格式回复消息
	 * @example
	 * // 构造回复消息示例
	 * const replyXml = base.encryptReplyMessage(
	 *   '<xml><Content><![CDATA[你好]]></Content></xml>',
	 *   '12345678',
	 *   'nonce12345',
	 *   'your_token',
	 *   'your_encoding_aes_key',
	 *   'your_corpid'
	 * );
	 */
	encryptReplyMessage(replyMsg, timestamp, nonce, token, encodingAESKey, corpid) {
		const _token = token || config.getConfig('token');
		const _encodingAESKey = encodingAESKey || config.getConfig('encodingAESKey');
		const _corpid = corpid || config.getConfig('corpid');
		// 如果未提供时间戳，使用当前时间
		timestamp = timestamp || Math.floor(Date.now() / 1000).toString();
		// 如果未提供随机数，生成一个
		nonce = nonce || Math.random().toString(36).substring(2, 15);

		// 对消息进行加密
		const encrypt = this.encryptMessage(replyMsg, _encodingAESKey, _corpid);

		// 生成签名
		const signature = this.getSignature(_token, timestamp, nonce, encrypt);

		// 构造回复的XML
		const result = `<xml>
   <Encrypt><![CDATA[${encrypt}]]></Encrypt>
   <MsgSignature><![CDATA[${signature}]]></MsgSignature>
   <TimeStamp>${timestamp}</TimeStamp>
   <Nonce><![CDATA[${nonce}]]></Nonce>
</xml>`;

		return result;
	}

	/**
	 * 加密消息内容
	 * @private
	 * @param {string} message - 要加密的消息内容
	 * @param {string} encodingAESKey - 企业微信后台配置的EncodingAESKey
	 * @param {string} corpid - 企业微信的CorpID
	 * @returns {string} Base64编码的加密消息
	 */
	encryptMessage(message, encodingAESKey, corpid) {
		const _corpid = corpid || config.getConfig('corpid');
		const _encodingAESKey = encodingAESKey || config.getConfig('encodingAESKey');
		// 对EncodingAESKey做Base64解码
		const aesKey = Buffer.from(_encodingAESKey + '=', 'base64');
		const iv = aesKey.slice(0, 16);

		// 生成16字节的随机字符串
		const randomString = crypto.randomBytes(16);

		// 构造明文: 16字节随机字符串 + 4字节消息长度(网络字节序) + 消息内容 + _corpid
		const msgLenBuffer = Buffer.alloc(4);
		msgLenBuffer.writeUInt32BE(Buffer.byteLength(message), 0);

		const bufMsg = Buffer.from(message);
		const bufCorpid = Buffer.from(_corpid);

		const bufMsgLen = Buffer.concat([randomString, msgLenBuffer, bufMsg, bufCorpid]);

		// 使用PKCS#7填充
		const padLength = 32 - (bufMsgLen.length % 32);
		const padBuffer = Buffer.alloc(padLength, padLength);
		const bufPadMsg = Buffer.concat([bufMsgLen, padBuffer]);

		// 使用AES-256-CBC模式加密
		const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
		cipher.setAutoPadding(false); // 已经自己做了填充
		const encrypted = Buffer.concat([cipher.update(bufPadMsg), cipher.final()]);

		// 返回Base64编码的密文
		return encrypted.toString('base64');
	}

	/**
	 * 验证URL有效性
	 * @description 用于企业微信回调模式验证URL有效性
	 * @param {string} token - 企业微信后台配置的Token
	 * @param {string} timestamp - 请求中的时间戳参数
	 * @param {string} nonce - 请求中的随机数参数
	 * @param {string} msg_signature - 企业微信加密签名
	 * @param {string} echostr - 加密的字符串
	 * @returns {boolean} 签名是否匹配
	 */
	checkSignature(timestamp, nonce, echostr, msg_signature, token) {
		const _token = token || config.getConfig('token');
		const signature = this.getSignature(_token, timestamp, nonce, echostr);
		console.log('signature=>', signature)
		console.log('msg_signature=>', msg_signature, _token, timestamp, nonce, echostr)
		return signature === msg_signature;
	}

	/**
	 * 解密企业微信回调消息
	 * @description 用于解密企业微信回调模式中的加密字符串
	 * @param {string} echostr - 加密的字符串
	 * @param {string} encodingAESKey - 企业微信后台配置的EncodingAESKey
	 * @returns {string} 解密后的消息内容
	 * @example
	 * // 在URL验证时，返回解密后的明文消息内容
	 * // 在接收消息时，返回解密后的XML消息
	 */
	decryptEchoStr(echostr, encodingAESKey) {
		const _encodingAESKey = encodingAESKey || config.getConfig('encodingAESKey');
		// 对EncodingAESKey做Base64解码
		const aesKey = Buffer.from(_encodingAESKey + '=', 'base64');
		const iv = aesKey.slice(0, 16);
		// 对echostr做Base64解码
		const encrypted = Buffer.from(echostr, 'base64');
		// 使用AES-256-CBC模式解密
		const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
		decipher.setAutoPadding(false);
		let decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

		// 去除PKCS#7填充
		const pad = decrypted[decrypted.length - 1];
		decrypted = decrypted.slice(0, decrypted.length - pad);

		// 解析消息内容：
		// - 前16字节为随机字符串(random)
		// - 接下来4字节为消息长度(msg_len)
		// - 然后是消息内容明文(msg)
		// - 最后是企业微信的receiveid
		const content = decrypted.slice(16);
		const length = content.slice(0, 4).readUInt32BE(0);
		const message = content.slice(4, 4 + length).toString('utf-8');
		return message;
	}
	/**
	 * 获取企业微信回调IP段
	 * @description 获取企业微信回调企业指定URL时使用的IP段列表，用于企业防火墙配置
	 * @returns {Promise<Object>} 包含IP段列表的对象
	 * @example
	 * // 返回结果示例:
	 * // {
	 * //   "ip_list": [
	 * //     "1.2.3.4",
	 * //     "2.3.3.3"
	 * //   ],
	 * //   "errcode": 0,
	 * //   "errmsg": "ok"
	 * // }
	 * 
	 * @throws {Error} 当API调用失败时抛出错误
	 */
	async getCallbackIp() {
		const url = 'https://qyapi.weixin.qq.com/cgi-bin/getcallbackip';
		const res = await this.curl(url, 'GET', null, 'crop');

		if (res.errcode !== 0) {
			throw new Error(`获取企业微信回调IP段失败: ${res.errmsg}`);
		}

		return res;
	}

	/**
	 * 获取企业微信API域名IP段
	 * @description 获取企业微信服务器的IP段列表，用于企业防火墙配置
	 * @returns {Promise<Object>} 包含IP段列表的对象
	 * @example
	 * // 返回结果示例:
	 * // {
	 * //   "ip_list": [
	 * //     "182.254.11.176",
	 * //     "182.254.78.66"
	 * //   ],
	 * //   "errcode": 0,
	 * //   "errmsg": "ok"
	 * // }
	 * 
	 * @throws {Error} 当API调用失败时抛出错误
	 */
	async getApiDomainIp() {
		const url = 'https://qyapi.weixin.qq.com/cgi-bin/get_api_domain_ip';
		const res = await this.curl(url, 'GET', null, 'crop');

		if (res.errcode !== 0) {
			throw new Error(`获取企业微信API域名IP段失败: ${res.errmsg}`);
		}

		return res;
	}

	/**
	 * 获取应用级JSSDK配置
	 * @description 获取JSSDK配置，用于前端调用企业微信JS接口
	 * @param {string} url - 当前页面URL
	 * @returns {Promise<Object>} 包含appId、timestamp、nonceStr和signature的配置对象
	 * @example
	 * // 返回结果示例:
	 * // {
	 * //   "appId": "wx1234567890",
	 * //   "timestamp": 1598086400,
	 * //   "nonceStr": "1234567890",
	 * //   "signature": "1234567890"
	 * // }
	 */
	async getJssdkConfig(url) {
		const jsapiTicket = await this.getJsApiTicket(); // 获取jsapi_ticket
		console.log('jsapiTicket=>', jsapiTicket)
		const timestamp = Date.now(); // 当前时间戳
		const nonceStr = Math.random().toString(36).substring(2, 15); // 随机字符串

		// 按照字段名的ASCII码从小到大排序（字典序）
		// jsapi_ticket, noncestr, timestamp, url 的字典序
		const string1 = `jsapi_ticket=${jsapiTicket.ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;


		const signature = crypto.createHash('sha1').update(string1).digest('hex'); // 生成SHA1签名

		return {
			appId: this.corpid,
			timestamp,
			nonceStr,
			signature
		}
	}

	/**
	 * 获取企业级JSSDK配置
	 * @param {string} url - 当前页面URL
	 * @returns {Promise<Object>} 包含appId、timestamp、nonceStr和signature的配置对象
	 */
	async getCropJssdkConfig(url) {
		const jsapiTicket = await this.getCorpJsApiTicket(); // 获取企业jsapi_ticket
		console.log('jsapiTicket=>', jsapiTicket)
		const timestamp = Date.now(); // 当前时间戳
		const nonceStr = Math.random().toString(36).substring(2, 15); // 随机字符串
		const string1 = `jsapi_ticket=${jsapiTicket.ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;

		const signature = crypto.createHash('sha1').update(string1).digest('hex'); // 生成SHA1签名

		return {
			appId: this.corpid,
			timestamp,
			nonceStr,
			signature
		}
	}

	/**
	 * 获取应用 jsapi_ticket
	 * @description 获取企业微信JS接口的临时票据，用于第三方应用鉴权
	 * @param {string} [type='agent_config'] - ticket类型，默认为agent_config
	 * @returns {Promise<Object>} 包含ticket和有效期的响应对象
	 * @example
	 * // 返回结果示例:
	 * // {
	 * //   "errcode": 0,
	 * //   "errmsg": "ok",
	 * //   "ticket": "bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",
	 * //   "expires_in": 7200
	 * // }
	 */
	async getJsApiTicket() {
		// 尝试从缓存获取ticket
		if (this.cache_mode === 'file') {
			try {
				const cachedTicket = await this.getTicketFromFile('jsapi_ticket');
				if (cachedTicket && cachedTicket.expires_time > Date.now()) {
					return cachedTicket;
				}
			} catch (error) {
				console.error('读取jsapi_ticket缓存出错:', error);
			}
		}

		// 缓存不存在或已过期，重新获取
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/ticket/get', 'GET', {
			type: 'agent_config'
		}, 'agent');

		// 保存到缓存
		if (this.cache_mode === 'file' && res.ticket) {
			try {
				const ticketData = {
					...res,
					expires_time: Date.now() + (res.expires_in * 1000)
				};
				await this.saveTicketToFile('jsapi_ticket', ticketData);
			} catch (error) {
				console.error('保存jsapi_ticket缓存出错:', error);
			}
		}

		return res;
	}

	/**
	 * 获取企业 jsapi_ticket
	 * @description 获取企业微信JS接口的临时票据，用于计算wx.config接口签名
	 * @returns {Promise<Object>} 包含ticket和有效期的响应对象
	 * @example
	 * // 返回结果示例:
	 * // {
	 * //   "errcode": 0,
	 * //   "errmsg": "ok",
	 * //   "ticket": "bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA",
	 * //   "expires_in": 7200
	 * // }
	 */
	async getCorpJsApiTicket() {
		// 尝试从缓存获取ticket
		if (this.cache_mode === 'file') {
			try {
				const cachedTicket = await this.getTicketFromFile('corp_jsapi_ticket');
				if (cachedTicket && cachedTicket.expires_time > Date.now()) {
					return cachedTicket;
				}
			} catch (error) {
				console.error('读取corp_jsapi_ticket缓存出错:', error);
			}
		}

		// 缓存不存在或已过期，重新获取
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket', 'GET', {}, 'crop');

		// 保存到缓存
		if (this.cache_mode === 'file' && res.ticket) {
			try {
				const ticketData = {
					...res,
					expires_time: Date.now() + (res.expires_in * 1000)
				};
				await this.saveTicketToFile('corp_jsapi_ticket', ticketData);
			} catch (error) {
				console.error('保存corp_jsapi_ticket缓存出错:', error);
			}
		}

		return res;
	}
	/**
	 * 获取access_token
	 * @param {string} _url - 请求的URL
	 * @returns {Promise<string>} access_token
	 */
	async getAccessToken(_url) {
		// 如果是获取token的接口，直接返回空字符串，避免循环调用
		if (_url === 'https://qyapi.weixin.qq.com/cgi-bin/gettoken') {
			return '';
		}

		if (this.cache_mode === 'file') {
			try {
				const token = await this.getTokenFromFile();
				if (token) {
					return token;
				}
			} catch (error) {
				console.error('读取access_token出错:', error);
			}
			// 如果到这里，说明文件不存在、token已过期或发生错误，需要重新获取
			const newToken = await this.fetchAccessToken();
			return newToken.access_token;
		}
		return '';
	}

	/**
	 * 发送HTTP请求
	 * @param {string} _url - 请求地址
	 * @param {string} _method - 请求方法
	 * @param {Object} _params - 请求参数
	 * @param {string} _token_type - 请求类型 agent: 应用级, concat: 通讯录级 crop: 企业级
	 * @returns {Promise<Object>} 响应结果
	 */
	async curl(_url, _method, _params, _token_type = 'agent') {

		console.log(`请求类型：${_token_type}`);

		if (_url !== 'https://qyapi.weixin.qq.com/cgi-bin/gettoken') {
			// 设置请求类型
			this.setSecret(_token_type);
		}

		const data = {
			..._params
		};
		const access_token = await this.getAccessToken(_url); // 获取访问令牌
		const params = this.removeControlProperties(data); // 清理请求参数
		return new Promise((resolve, reject) => {
			const options = {
				url: _url,
				method: _method,
				json: true,
				headers: {
					'Content-Type': 'application/json',
					'Accept': '*/*' // 接受所有类型的响应
				}
			};

			const url = _url + '?access_token=' + access_token + '&debug=1';

			if (_method.toUpperCase() === 'GET') {
				// GET请求将参数添加到URL查询字符串
				const queryString = new URLSearchParams(params).toString();
				options.url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
			} else {
				// POST等其他方法将数据放在body中
				options.url = url;
				options.body = params;
			}

			console.log(`请求：${options.url}`)
			request(options, (error, response, body) => {
				if (error) {
					reject(error);
				} else {
					resolve(body);
				}
			});
		});
	}



	/**
	 * 从XML中提取指定标签的整个内容块
	 * @private
	 * @param {string} xmlString - XML字符串
	 * @param {string} tagName - 标签名
	 * @returns {string|null} 标签内容块，如果不存在则返回null
	 */
	extractXmlBlock(xmlString, tagName) {
		const startTag = `<${tagName}>`;
		const endTag = `</${tagName}>`;
		const startIndex = xmlString.indexOf(startTag);
		const endIndex = xmlString.indexOf(endTag);

		if (startIndex !== -1 && endIndex !== -1) {
			return xmlString.substring(startIndex, endIndex + endTag.length);
		}

		return null;
	}

	/**
	 * 解析扩展属性
	 * @private
	 * @param {string} extAttrXml - 扩展属性的XML字符串
	 * @returns {Array} 扩展属性数组
	 */
	parseExtAttr(extAttrXml) {
		const items = [];
		let itemMatch;
		const itemRegex = /<Item>([\s\S]*?)<\/Item>/g;

		while ((itemMatch = itemRegex.exec(extAttrXml)) !== null) {
			const itemContent = itemMatch[1];
			const item = {};

			item.name = this.extractXmlValue(itemContent, 'Name');
			const typeStr = this.extractXmlValue(itemContent, 'Type');
			item.type = typeStr ? parseInt(typeStr, 10) : null;

			// 根据类型解析不同的内容
			if (item.type === 0) { // 文本类型
				item.value = this.extractXmlValue(itemContent, 'Value');
			} else if (item.type === 1) { // 网页类型
				item.web = {
					title: this.extractXmlValue(itemContent, 'Title'),
					url: this.extractXmlValue(itemContent, 'Url')
				};
			}

			items.push(item);
		}

		return items;
	}

	/**
	 * 从XML字符串中提取指定标签的值
	 * @private
	 * @param {string} xmlString - XML字符串
	 * @param {string} tagName - 要提取的标签名
	 * @returns {string} 提取的标签值
	 */
	extractXmlValue(xmlString, tagName) {
		// 匹配普通标签内容或CDATA内容
		const regex = new RegExp(`<${tagName}>(.*?)</${tagName}>|<${tagName}><!\\[CDATA\\[(.*?)\\]\\]></${tagName}>`, 's');
		const match = xmlString.match(regex);

		if (!match) {
			return '';
		}

		// 优先返回CDATA中的内容，如果没有CDATA则返回普通标签内容
		const xml = match[2] !== undefined ? match[2] : match[1];
		const math2 = xml.match(/<!\[CDATA\[(.*?)\]\]>/s)
		return math2 ? math2[1] : '';
	}
	//#endregion

	//#region 内部方法

	getSignature(token, timestamp, nonce, echostr) {
		const arr = [token, timestamp, nonce, echostr].sort();
		const str = arr.join('');
		const res = crypto.createHash('sha1').update(str).digest('hex')
		console.log('res=>', res)
		return res;
	}


	/**
	 * 保存ticket到文件
	 * @param {string} ticketType - ticket类型，如'jsapi_ticket'或'corp_jsapi_ticket'
	 * @param {Object} ticketData - 要保存的ticket数据
	 * @returns {Promise<void>}
	 * @private
	 */
	async saveTicketToFile(ticketType, ticketData) {
		try {
			const filePath = path.join(this.tokenDir, `${ticketType}.json`);
			await fs.promises.writeFile(filePath, JSON.stringify(ticketData), 'utf8');
		} catch (error) {
			console.error(`保存${ticketType}到文件失败:`, error);
			throw error;
		}
	}

	/**
	 * 从文件获取ticket
	 * @param {string} ticketType - ticket类型，如'jsapi_ticket'或'corp_jsapi_ticket'
	 * @returns {Promise<Object|null>} ticket数据或null
	 * @private
	 */
	async getTicketFromFile(ticketType) {
		try {
			const filePath = path.join(this.tokenDir, `${ticketType}.json`);
			const data = await fs.promises.readFile(filePath, 'utf8');
			return JSON.parse(data);
		} catch (error) {
			if (error.code === 'ENOENT') {
				// 文件不存在，返回null
				return null;
			}
			console.error(`从文件读取${ticketType}失败:`, error);
			throw error;
		}
	}

	/**
	 * 根据请求类型设置对应的密钥
	 * @param {string} _token_type - 请求类型
	 */
	setSecret(_token_type) {
		if (_token_type === 'agent') {
			this.corpsecret = config.getConfig('agent_secret'); // 应用密钥
		} else if (_token_type === 'concat') {
			this.corpsecret = config.getConfig('concat_secret'); // 通讯录密钥
		}
		console.log(`corpsecret：${this.corpsecret}`);
		if (this.cache_mode === 'file') {
			const path = require('path');
			// 设置token存储路径
			this.tokenDir = path.resolve(process.cwd(), '.neuit');
			this.tokenFile = path.join(this.tokenDir, `${this.corpsecret}_access_token.json`);
		}
	}
	/**
	 * 从企业微信服务器获取新的access_token
	 * @returns {Promise<Object>} 包含access_token的响应对象
	 * @private
	 */
	async fetchAccessToken() {
		const res = await this.curl('https://qyapi.weixin.qq.com/cgi-bin/gettoken', 'GET', {
			corpid: this.corpid,
			corpsecret: this.corpsecret
		});

		if (this.cache_mode === 'file' && res.errcode == 0) {
			await this.saveTokenToFile(res);
		}

		return res;
	}

	/**
	 * 将token信息保存到文件中
	 * @param {Object} tokenData - 包含access_token的数据对象
	 * @private
	 */
	async saveTokenToFile(tokenData) {
		const fs = require('fs');
		const data = {
			...tokenData,
			expires_at: Date.now() + 7200 * 1000 // 设置过期时间为当前时间后2小时
		};

		// 确保存储目录存在
		if (!fs.existsSync(this.tokenDir)) {
			fs.mkdirSync(this.tokenDir, {
				recursive: true
			});
		}

		// 写入token文件
		fs.writeFileSync(this.tokenFile, JSON.stringify(data, null, 2), 'utf8');
	}

	/**
	 * 从文件中读取token信息
	 * @returns {Promise<string|null>} 有效的access_token或null
	 * @private
	 */
	async getTokenFromFile() {
		const fs = require('fs');
		if (fs.existsSync(this.tokenFile)) {
			const tokenData = JSON.parse(fs.readFileSync(this.tokenFile, 'utf8'));
			console.log(`缓存参数：${JSON.stringify(tokenData)}`);
			if (Date.now() < tokenData.expires_at) {
				return tokenData.access_token;
			}
		}
		return null;
	}

	/**
	 * 处理请求参数，移除空值属性
	 * @param {Object} obj - 原始参数对象
	 * @returns {Object} 处理后的参数对象
	 * @private
	 */
	removeControlProperties(obj) {
		const result = {};
		for (const key in obj) {
			// 过滤掉值为空字符串、null或undefined的属性
			if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
				result[key] = obj[key];
			}
		}
		return result;
	}
	//#endregion
}

module.exports = Base;