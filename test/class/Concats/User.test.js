const User = require('../../../lib/class/Concats/User');
const { fakerZH_CN: faker } = require('@faker-js/faker');

describe('通讯录用户类测试', () => {
  const user = new User();

  describe('创建用户', () => {
    it('当用户ID缺失时应抛出错误', async () => {
      await expect(user.createUser({}))
        .rejects.toThrow('成员UserID不能为空');
    });

    it('当用户ID格式无效时应抛出错误', async () => {
      await expect(user.createUser({
        userid: '#invalid-id',
        name: faker.person.fullName(),
        mobile: faker.phone.number('1##########')
      })).rejects.toThrow('UserID格式不正确');
    });

    it('当用户名称缺失时应抛出错误', async () => {
      await expect(user.createUser({
        userid: faker.string.alphanumeric(10),
        mobile: faker.phone.number('1##########')
      })).rejects.toThrow('成员名称不能为空');
    });

    it('当用户名称过长时应抛出错误', async () => {
      // 创建一个过长的名称（>64个utf8字符）
      const longName = '测'.repeat(33); // 33个中文字符 > 64字节

      await expect(user.createUser({
        userid: faker.string.alphanumeric(10),
        name: longName,
        mobile: faker.phone.number('1##########')
      })).rejects.toThrow('成员名称长度不能超过64个utf8字符');
    });

    it('当手机号和邮箱同时缺失时应抛出错误', async () => {
      await expect(user.createUser({
        userid: faker.string.alphanumeric(10),
        name: faker.person.fullName()
      })).rejects.toThrow('手机号码和邮箱不能同时为空');
    });

    it('当部门数组过大时应抛出错误', async () => {
      // 创建一个超过100项的部门数组
      const largeDeptArray = Array.from({
        length: 101
      }, (_, i) => i + 1);

      await expect(user.createUser({
        userid: faker.string.alphanumeric(10),
        name: faker.person.fullName(),
        mobile: faker.phone.number('1##########'),
        department: largeDeptArray
      })).rejects.toThrow('部门ID列表不能超过100个');
    });

    it('当排序数组长度与部门数组长度不匹配时应抛出错误', async () => {
      await expect(user.createUser({
        userid: faker.string.alphanumeric(10),
        name: faker.person.fullName(),
        mobile: faker.phone.number('1##########'),
        department: [1, 2],
        order: [1]
      })).rejects.toThrow('部门排序值的个数必须和部门ID列表的个数一致');
    });

    it('当部门负责人标识数组长度与部门数组长度不匹配时应抛出错误', async () => {
      await expect(user.createUser({
        userid: faker.string.alphanumeric(10),
        name: faker.person.fullName(),
        mobile: faker.phone.number('1##########'),
        department: [1, 2],
        is_leader_in_dept: [1]
      })).rejects.toThrow('部门负责人标识的个数必须和部门ID列表的个数一致');
    });

    it('当职务信息过长时应抛出错误', async () => {
      const longPosition = faker.string.alpha(129);

      await expect(user.createUser({
        userid: faker.string.alphanumeric(10),
        name: faker.person.fullName(),
        mobile: faker.phone.number('1##########'),
        position: longPosition
      })).rejects.toThrow('职务信息长度不能超过128个字符');
    });

    it('当对外职务过长时应抛出错误', async () => {
      const longExternalPosition = '职务'.repeat(13); // 13*2 = 26 > 12 汉字

      await expect(user.createUser({
        userid: faker.string.alphanumeric(10),
        name: faker.person.fullName(),
        mobile: faker.phone.number('1##########'),
        external_position: longExternalPosition
      })).rejects.toThrow('对外职务长度不能超过12个汉字');
    });

    it('当地址过长时应抛出错误', async () => {
      const longAddress = faker.string.alpha(129);

      await expect(user.createUser({
        userid: faker.string.alphanumeric(10),
        name: faker.person.fullName(),
        mobile: faker.phone.number('1##########'),
        address: longAddress
      })).rejects.toThrow('地址长度不能超过128个字符');
    });

    it('当所有参数有效时应成功创建用户', async () => {
      const userData = {
        userid: `test_${faker.string.alphanumeric(8)}`,
        name: faker.person.fullName(),
        mobile: '138'+faker.phone.number('########'),
        department: [faker.number.int({ min: 1, max: 100 })],
        order: [faker.number.int({ min: 1, max: 100 })],
        position: faker.person.jobTitle(),
        gender: faker.number.int({ min: 0, max: 2 }),
        email: faker.internet.email(),
        enable: 1,
        address: faker.location.streetAddress(),
      };

      const result = await user.createUser(userData);

      expect(result.errcode).toEqual(0);
    });
  });
});