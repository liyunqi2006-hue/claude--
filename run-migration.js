const { execSync } = require('child_process');

console.log('开始执行数据库迁移...\n');

try {
  // 尝试执行迁移
  const output = execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    cwd: __dirname
  });

  console.log('\n✅ 数据库迁移成功！');
  console.log('\n正在重新生成 Prisma Client...');

  execSync('npx prisma generate', {
    stdio: 'inherit',
    cwd: __dirname
  });

  console.log('\n✅ Prisma Client 生成成功！');
  console.log('\n迁移完成，可以重启服务器了。');

} catch (error) {
  console.error('\n❌ 迁移失败:', error.message);
  console.log('\n请尝试以下步骤：');
  console.log('1. 停止所有运行中的 npm run dev');
  console.log('2. 手动运行: npx prisma migrate deploy');
  console.log('3. 手动运行: npx prisma generate');
  process.exit(1);
}
