const { execSync } = require('child_process');

console.log('🔄 重置失败的迁移...\n');

try {
  // 标记迁移为已回滚
  console.log('步骤 1: 标记迁移为已回滚');
  execSync('npx prisma migrate resolve --rolled-back 20260811184005_add_usdt_payment', {
    stdio: 'inherit',
    cwd: __dirname
  });

  console.log('\n步骤 2: 重新应用迁移');
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    cwd: __dirname
  });

  console.log('\n步骤 3: 生成 Prisma Client');
  execSync('npx prisma generate', {
    stdio: 'inherit',
    cwd: __dirname
  });

  console.log('\n✅ 数据库迁移完成！');

} catch (error) {
  console.error('\n❌ 错误:', error.message);
  console.log('\n请按以下步骤手动操作：');
  console.log('1. npx prisma migrate resolve --rolled-back 20260811184005_add_usdt_payment');
  console.log('2. npx prisma migrate deploy');
  console.log('3. npx prisma generate');
  process.exit(1);
}
