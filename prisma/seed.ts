import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Created admin user:', admin.username);

  // Create default employee
  const employeePassword = await bcrypt.hash('user123', 10);
  const employee = await prisma.user.upsert({
    where: { username: 'employee' },
    update: {},
    create: {
      username: 'employee',
      email: 'employee@example.com',
      passwordHash: employeePassword,
      role: 'EMPLOYEE',
    },
  });
  console.log('Created employee user:', employee.username);

  // Create default categories
  const categories = [
    { name: '公司新闻', slug: 'company-news' },
    { name: '行业资讯', slug: 'industry-news' },
    { name: '产品更新', slug: 'product-updates' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('Created categories');

  // Create sample articles
  const category = await prisma.category.findUnique({ where: { slug: 'company-news' } });
  if (category) {
    const articles = [
      {
        title: 'WebsiteCMS 正式上线',
        slug: 'websitecms-launch',
        content: '我们很高兴宣布 WebsiteCMS 正式上线！这是一个全新的企业官网内容管理系统，旨在帮助企业快速搭建专业官网。',
        excerpt: '我们很高兴宣布 WebsiteCMS 正式上线！',
        status: 'PUBLISHED',
        categoryId: category.id,
        publishedAt: new Date(),
        createdById: admin.id,
      },
      {
        title: '可视化编辑器新功能发布',
        slug: 'visual-editor-update',
        content: 'WebsiteCMS 可视化编辑器新增多项功能，包括更多组件类型、更好的响应式支持等。',
        excerpt: '可视化编辑器新增多项功能',
        status: 'PUBLISHED',
        categoryId: category.id,
        publishedAt: new Date(),
        createdById: admin.id,
      },
    ];

    for (const article of articles) {
      await prisma.article.upsert({
        where: { slug: article.slug },
        update: {},
        create: article,
      });
    }
    console.log('Created sample articles');
  }

  // Create home page
  await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      title: '首页',
      slug: 'home',
      status: 'PUBLISHED',
      contentJson: {
        components: [
          { id: 'c1', type: 'heading', props: { level: 1, text: '欢迎使用 WebsiteCMS' } },
          { id: 'c2', type: 'text', props: { content: '专业的企业官网内容管理系统' } },
          { id: 'c3', type: 'button', props: { text: '了解更多', href: '/products' } },
        ],
      },
      createdById: admin.id,
      publishedAt: new Date(),
    },
  });
  console.log('Created home page');

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
