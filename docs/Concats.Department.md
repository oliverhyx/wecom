# 企业微信通讯录 - 部门管理 (Department)

`Department` 类是企业微信通讯录部门管理模块，提供了完整的企业微信部门管理相关接口，包括创建、读取、更新、删除部门，以及部门列表查询功能。

## 目录

- [初始化](#初始化)
- [基本方法](#基本方法)
  - [创建部门](#创建部门)
  - [更新部门](#更新部门)
  - [删除部门](#删除部门)
- [部门列表管理](#部门列表管理)
  - [获取部门列表](#获取部门列表)
  - [获取子部门ID列表](#获取子部门id列表)
  - [获取单个部门详情](#获取单个部门详情)

## 初始化

```javascript
const { Department } = require('@neuit/wecom');
const department = new Department();
```

## 基本方法

### 创建部门

创建企业微信部门，若部门名称已存在于同一层级，将返回错误码。

```javascript
/**
 * @param {Object} department - 部门信息
 * @returns {Promise<Object>} 创建结果，包含部门ID
 */
await department.createDepartment({
  name: '研发部',              // 必填，部门名称，1~64个字符
  parentid: 1,                // 必填，父部门ID
  name_en: 'R&D Department',  // 可选，英文名称
  order: 100,                 // 可选，排序值
  id: 2                       // 可选，部门ID，不填会自动生成
});
```

#### 参数详情

| 参数名   | 类型   | 必填 | 描述                                           |
| -------- | ------ | ---- | ---------------------------------------------- |
| name     | string | 是   | 部门名称，同一层级部门名称不能重复，1~64个字符 |
| parentid | number | 是   | 父部门id，32位整型                             |
| name_en  | string | 否   | 英文名称，同一层级部门名称不能重复，1~64个字符 |
| order    | number | 否   | 在父部门中的排序值，order值大的排序靠前        |
| id       | number | 否   | 部门id，指定时必须大于1，不填自动生成          |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'created',
  id: 2  // 创建的部门ID
}
```

### 更新部门

更新企业微信部门信息。

```javascript
/**
 * @param {Object} department - 部门信息
 * @returns {Promise<Object>} 更新结果
 */
await department.updateDepartment({
  id: 2,                     // 必填，部门ID
  name: '技术研发部',        // 可选，更新的部门名称
  name_en: 'Tech R&D',       // 可选，更新的英文名称
  parentid: 1,               // 可选，更新的父部门ID
  order: 120                 // 可选，更新的排序值
});
```

#### 参数详情

| 参数名   | 类型   | 必填 | 描述                                           |
| -------- | ------ | ---- | ---------------------------------------------- |
| id       | number | 是   | 部门id，必须大于1                              |
| name     | string | 否   | 部门名称，1~64个字符，不能包含特殊字符         |
| name_en  | string | 否   | 英文名称，1~64个字符，不能包含特殊字符         |
| parentid | number | 否   | 父部门id                                       |
| order    | number | 否   | 在父部门中的排序值，order值大的排序靠前        |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'updated'
}
```

### 删除部门

删除企业微信部门，无法删除根部门以及包含子部门、成员的部门。

```javascript
/**
 * @param {number} id - 部门ID
 * @returns {Promise<Object>} 删除结果
 */
await department.deleteDepartment(2);
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述         |
| ------ | ------ | ---- | ------------ |
| id     | number | 是   | 部门ID，必须是正整数 |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'deleted'
}
```

## 部门列表管理

### 获取部门列表

获取企业通讯录中部门列表，可获取全量组织架构或指定部门及其子部门。

```javascript
/**
 * @param {number} [id] - 部门ID，可选
 * @returns {Promise<Object>} 包含部门列表的结果
 */
// 获取全量组织架构
const allDepartments = await department.listDepartment();

// 获取指定部门及其子部门
const subDepartments = await department.listDepartment(1);
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述                                 |
| ------ | ------ | ---- | ------------------------------------ |
| id     | number | 否   | 部门ID，获取指定部门及其下子部门     |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  department: [
    {
      id: 1,
      name: '公司',
      name_en: 'Company',
      parentid: 0,
      order: 100
    },
    {
      id: 2,
      name: '研发部',
      name_en: 'R&D',
      parentid: 1,
      order: 100
    }
    // ... 更多部门
  ]
}
```

> **注意**: 该接口性能较低，官方建议使用 [获取子部门ID列表](#获取子部门id列表) 和 [获取单个部门详情](#获取单个部门详情) 组合使用。

### 获取子部门ID列表

获取企业通讯录中指定部门及其下的子部门ID列表，比获取完整部门列表更高效。

```javascript
/**
 * @param {number} [id] - 部门ID，可选
 * @returns {Promise<Object>} 包含部门ID列表的结果
 */
// 获取全量组织架构部门ID
const allDepartmentIds = await department.listSimpleDepartment();

// 获取指定部门及其子部门ID
const subDepartmentIds = await department.listSimpleDepartment(1);
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述                             |
| ------ | ------ | ---- | -------------------------------- |
| id     | number | 否   | 部门ID，获取指定部门及其下子部门 |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  department_id: [
    {
      id: 1,
      parentid: 0
    },
    {
      id: 2,
      parentid: 1
    }
    // ... 更多部门ID
  ]
}
```

### 获取单个部门详情

获取企业通讯录中单个部门的详细信息。

```javascript
/**
 * @param {number} id - 部门ID
 * @returns {Promise<Object>} 包含部门详情的结果
 */
await department.getDepartment(2);
```

#### 参数详情

| 参数名 | 类型   | 必填 | 描述     |
| ------ | ------ | ---- | -------- |
| id     | number | 是   | 部门ID   |

#### 返回结果

```javascript
{
  errcode: 0,
  errmsg: 'ok',
  department: {
    id: 2,
    name: '研发部',
    name_en: 'R&D',
    parentid: 1,
    order: 100
  }
}
```

## 完整使用示例

```javascript
const { Department } = require('@neuit/wecom');

// 部门管理示例
async function departmentManagement() {
  try {
    const department = new Department();
    
    // 1. 创建部门
    const createResult = await department.createDepartment({
      name: '测试部门',
      parentid: 1,
      order: 100
    });
    console.log('创建部门结果:', createResult);
    const newDeptId = createResult.id;
    
    // 2. 更新部门
    const updateResult = await department.updateDepartment({
      id: newDeptId,
      name: '测试部门已更新',
      order: 120
    });
    console.log('更新部门结果:', updateResult);
    
    // 3. 获取部门详情
    const deptInfo = await department.getDepartment(newDeptId);
    console.log('部门详情:', deptInfo);
    
    // 4. 获取子部门ID列表
    const deptIds = await department.listSimpleDepartment(1);
    console.log('子部门ID列表:', deptIds);
    
    // 5. 获取部门完整信息列表
    const deptList = await department.listDepartment(1);
    console.log('部门列表:', deptList);
    
    // 6. 删除部门
    const deleteResult = await department.deleteDepartment(newDeptId);
    console.log('删除部门结果:', deleteResult);
    
  } catch (error) {
    console.error('部门管理操作失败:', error);
  }
}

// 执行示例
departmentManagement();
```

## 注意事项

1. 创建和更新部门时，部门名称和英文名称不能包含特殊字符：`\:*?"<>|`
2. 同一层级下的部门不能重名
3. 不能删除根部门（ID为1的部门）
4. 不能删除含有子部门或成员的部门
5. 获取完整部门列表的接口性能较低，建议使用"获取子部门ID列表"和"获取单个部门详情"接口组合使用
6. 新建部门时如不指定部门ID，系统会自动生成，建议由系统自动生成部门ID 