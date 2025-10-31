const {
    Base,
    Authorize,
    Callback,
    Concats,
    Externalcontact,
    Message
} = require('../lib/main');

/**
 * 解析命令行参数
 * @param {Array<string>} args - 命令行参数数组
 * @returns {Object} 解析后的参数对象
 */
function parseArgs(args) {
    if (args.length < 2) {
        return null;
    }

    const [moduleClass, method, ...params] = args;
    
    // 解析模块.类的格式
    const [moduleName, className] = moduleClass.split('.');
    
    if (!moduleName || !className) {
        throw new Error(`错误的模块类格式: ${moduleClass}，正确格式: <模块>.<类>，例如: Authorize.Webauth`);
    }

    return {
        moduleName,
        className,
        method,
        params: parseParams(params)
    };
}

/**
 * 解析参数，支持字符串、数字、JSON对象
 * @param {Array<string>} params - 原始参数数组
 * @returns {Array} 解析后的参数数组
 */
function parseParams(params) {
    return params.map(param => {
        // 尝试解析为JSON
        if (param.trim().startsWith('{') || param.trim().startsWith('[')) {
            try {
                return JSON.parse(param);
            } catch (e) {
                // 如果解析失败，返回原始字符串
            }
        }
        
        // 尝试解析为数字
        if (/^-?\d+$/.test(param)) {
            return parseInt(param, 10);
        }
        
        // 尝试解析为浮点数
        if (/^-?\d+\.\d+$/.test(param)) {
            return parseFloat(param);
        }
        
        // 布尔值
        if (param.toLowerCase() === 'true') {
            return true;
        }
        if (param.toLowerCase() === 'false') {
            return false;
        }
        
        // 默认返回字符串
        return param;
    });
}

/**
 * 获取类实例
 * @param {string} moduleName - 模块名
 * @param {string} className - 类名
 * @returns {Object} 类实例
 */
function getClassInstance(moduleName, className) {
    const modules = {
        Base,
        Authorize,
        Callback,
        Concats,
        Externalcontact,
        Message
    };

    const module = modules[moduleName];
    if (!module) {
        throw new Error(`未知的模块: ${moduleName}。可用模块: ${Object.keys(modules).join(', ')}`);
    }

    const Class = module[className];
    if (!Class) {
        throw new Error(`模块 ${moduleName} 中没有类 ${className}。可用类: ${Object.keys(module).join(', ')}`);
    }

    return new Class();
}

/**
 * 打印帮助信息
 */
function printHelp() {
    console.log(`
用法: node test/main.js <模块>.<类> <方法> [参数...]

示例:
  # 测试获取用户信息
  node test/main.js Authorize.Webauth getUserInfo code123

  # 测试获取部门用户
  node test/main.js Concats.User getDepartmentUsers 4

  # 测试发送消息（JSON参数）
  node test/main.js Message.Appmessage sendMessage '{"agentid":1000003,"touser":"oliverhuang","msgtype":"text"}'

  # 测试多个参数
  node test/main.js Concats.User createUser '{"userid":"test123","name":"测试用户","mobile":"13800000000","department":[1]}'

可用模块:
  - Base
  - Authorize (Webauth, Authsucc, Weblogin)
  - Callback (Concats)
  - Concats (User, Department, Tag, Asyncimport, Asyncoutport)
  - Externalcontact (Concatsetting, Groupsetting, Groupchat, Message)
  - Message (Appmessage, Appchat)

参数说明:
  - 字符串参数直接传入
  - 数字参数会自动解析
  - JSON对象需要用引号包裹，例如: '{"key":"value"}'
  - 布尔值使用 true/false

`);
}

/**
 * 主函数
 */
async function main() {
    const args = process.argv.slice(2);

    // 显示帮助信息
    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
        printHelp();
        process.exit(0);
    }

    try {
        // 解析参数
        const parsed = parseArgs(args);
        if (!parsed) {
            console.error('错误: 缺少必需的参数');
            printHelp();
            process.exit(1);
        }

        const { moduleName, className, method, params } = parsed;

        // 验证方法名
        if (!method) {
            console.error('错误: 缺少方法名');
            printHelp();
            process.exit(1);
        }

        // 获取类实例
        const instance = getClassInstance(moduleName, className);

        // 验证方法是否存在
        if (typeof instance[method] !== 'function') {
            const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
                .filter(name => name !== 'constructor' && typeof instance[name] === 'function');
            throw new Error(`类 ${moduleName}.${className} 没有方法 ${method}。可用方法: ${methods.join(', ')}`);
        }

        // 执行方法
        console.log(`\n执行: ${moduleName}.${className}.${method}`);
        console.log(`参数:`, params.length > 0 ? JSON.stringify(params, null, 2) : '无');
        console.log(`\n开始执行...\n`);

        const startTime = Date.now();
        const result = await instance[method](...params);
        const endTime = Date.now();

        // 输出结果
        console.log('\n执行成功！');
        console.log(`耗时: ${endTime - startTime}ms`);
        console.log('\n返回结果:');
        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('\n执行失败！');
        console.error(`错误: ${error.message}`);
        if (error.stack) {
            console.error('\n堆栈跟踪:');
            console.error(error.stack);
        }
        process.exit(1);
    }
}

main();