# 企业微信通讯录 - 标签管理 (Tag)

`Tag` 类是企业微信通讯录标签管理模块，提供了完整的企业微信标签管理相关接口，包括创建、更新、删除标签，以及标签成员管理功能。

## 目录

- [初始化](#初始化)
- [标签管理](#标签管理)
  - [创建标签](#创建标签)
  - [更新标签名字](#更新标签名字)
  - [删除标签](#删除标签)
  - [获取标签列表](#获取标签列表)
- [标签成员管理](#标签成员管理)
  - [获取标签成员](#获取标签成员)
  - [增加标签成员](#增加标签成员)
  - [删除标签成员](#删除标签成员)

## 初始化

```javascript
const { Tag } = require('@neuit/wecom');
const tag = new Tag();
```

## 标签管理

### 创建标签

创建企业微信标签，标签名不可与其他标签重名。

```javascript
/**
 * @param {Object} tag - 标签信息
 * @returns {Promise<Object>} 创建结果，包含标签ID
 */
await tag.createTag({
  tagname: '研发标签',      // 必填，标签名称，32个字以内
  tagid: 1                  // 可选，标签ID，不填会自动生成
});
```

#### 参数详情

| 参数名  | 类型   | 必填 | 描述                                               |
| ------- | ------ | ---- | -------------------------------------------------- |
| tagname | string | 是   | 标签名称，32个字以内（汉字或英文字母），不可重名   |
| tagid   | number | 否   | 标签ID，非负整型，不指定时以目前最大的ID自增       |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'created',
  tagid: 1  // 创建的标签ID
}
```

### 更新标签名字

更新企业微信标签名称。

```javascript
/**
 * @param {Object} tag - 标签信息
 * @returns {Promise<Object>} 更新结果
 */
await tag.updateTag({
  tagid: 1,                // 必填，标签ID
  tagname: '研发核心标签'  // 必填，新的标签名称
});
```

#### 参数详情

| 参数名  | 类型   | 必填 | 描述                                             |
| ------- | ------ | ---- | ------------------------------------------------ |
| tagid   | number | 是   | 标签ID，整数                                     |
| tagname | string | 是   | 标签名称，长度限制为32个字，不能与其他标签重名   |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'updated'
}
```

### 删除标签

删除企业微信标签。

```javascript
/**
 * @param {number} tagid - 标签ID
 * @returns {Promise<Object>} 删除结果
 */
await tag.deleteTag(1);
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述               |
| ------ | ------ | ---- | ------------------ |
| tagid  | number | 是   | 标签ID，非负整数   |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'deleted'
}
```

### 获取标签列表

获取企业标签库中的所有标签。

```javascript
/**
 * @returns {Promise<Object>} 包含标签列表的结果
 */
await tag.getTagList();
```

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  taglist: [
    {
      tagid: 1,
      tagname: '研发标签'
    },
    {
      tagid: 2,
      tagname: '销售标签'
    }
    // ... 更多标签
  ]
}
```

## 标签成员管理

### 获取标签成员

获取标签下的成员列表。

```javascript
/**
 * @param {number} tagid - 标签ID
 * @returns {Promise<Object>} 包含标签成员信息的结果
 */
await tag.getTagUsers(1);
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述               |
| ------ | ------ | ---- | ------------------ |
| tagid  | number | 是   | 标签ID，非负整数   |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  tagname: '研发标签',
  userlist: [
    {
      userid: 'zhangsan',
      name: '张三'
    },
    {
      userid: 'lisi',
      name: '李四'
    }
    // ... 更多成员
  ],
  partylist: [1, 2]  // 包含的部门ID列表
}
```

### 增加标签成员

向企业标签中添加成员或部门。

```javascript
/**
 * @param {Object} options - 添加选项
 * @returns {Promise<Object>} 添加结果
 */
await tag.addTagUsers({
  tagid: 1,                    // 必填，标签ID
  userlist: ['zhangsan', 'lisi'], // 可选，成员ID列表
  partylist: [1, 2]            // 可选，部门ID列表
});
```

#### 参数详情

| 参数名    | 类型     | 必填 | 描述                                   |
| --------- | -------- | ---- | -------------------------------------- |
| tagid     | number   | 是   | 标签ID，整数                           |
| userlist  | string[] | 否*  | 企业成员ID列表，单次不超过1000个       |
| partylist | number[] | 否*  | 企业部门ID列表，单次不超过100个        |

*注：userlist和partylist不能同时为空

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  invalidlist: ['wangwu'],     // 非法的成员列表
  invalidparty: []             // 非法的部门列表
}
```

### 删除标签成员

从企业标签中删除成员或部门。

```javascript
/**
 * @param {Object} options - 删除选项
 * @returns {Promise<Object>} 删除结果
 */
await tag.deleteTagUsers({
  tagid: 1,                    // 必填，标签ID
  userlist: ['zhangsan'],      // 可选，成员ID列表
  partylist: [1]               // 可选，部门ID列表
});
```

#### 参数详情

| 参数名    | 类型     | 必填 | 描述                                   |
| --------- | -------- | ---- | -------------------------------------- |
| tagid     | number   | 是   | 标签ID，整数                           |
| userlist  | string[] | 否*  | 企业成员ID列表，单次不超过1000个       |
| partylist | number[] | 否*  | 企业部门ID列表，单次不超过100个        |

*注：userlist和partylist不能同时为空

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  invalidlist: [],             // 非法的成员列表
  invalidparty: []             // 非法的部门列表
}
```

## 完整使用示例

```javascript
const { Tag } = require('@neuit/wecom');

// 标签管理示例
async function tagManagement() {
  try {
    const tag = new Tag();
    
    // 1. 创建标签
    const createResult = await tag.createTag({
      tagname: '测试标签'
    });
    console.log('创建标签结果:', createResult);
    const tagId = createResult.tagid;
    
    // 2. 更新标签名称
    const updateResult = await tag.updateTag({
      tagid: tagId,
      tagname: '测试标签已更新'
    });
    console.log('更新标签结果:', updateResult);
    
    // 3. 添加标签成员
    const addUsersResult = await tag.addTagUsers({
      tagid: tagId,
      userlist: ['zhangsan', 'lisi'],
      partylist: [1]
    });
    console.log('添加标签成员结果:', addUsersResult);
    
    // 4. 获取标签成员
    const tagUsers = await tag.getTagUsers(tagId);
    console.log('标签成员:', tagUsers);
    
    // 5. 获取标签列表
    const tagList = await tag.getTagList();
    console.log('标签列表:', tagList);
    
    // 6. 删除标签成员
    const deleteUsersResult = await tag.deleteTagUsers({
      tagid: tagId,
      userlist: ['zhangsan']
    });
    console.log('删除标签成员结果:', deleteUsersResult);
    
    // 7. 删除标签
    const deleteResult = await tag.deleteTag(tagId);
    console.log('删除标签结果:', deleteResult);
    
  } catch (error) {
    console.error('标签管理操作失败:', error);
  }
}

// 执行示例
tagManagement();
```

## 注意事项

1. 标签名称限制为32个字以内（汉字或英文字母）
2. 标签名不可与其他标签重名
3. 创建标签时如不指定标签ID，系统会自动生成，建议由系统自动生成标签ID
4. 增加或删除标签成员时，userlist和partylist不能同时为空
5. 增加标签成员时，单次请求的成员列表不能超过1000个，部门列表不能超过100个
6. 删除标签成员时，若部分成员或部门不存在，会在返回结果中列出 