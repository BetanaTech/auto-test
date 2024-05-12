import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:53000/');
  await page.getByRole('link', { name: 'トップページへ' }).click();
});

const accounts = [
  {
    email: 'ichiro@example.com',
    password: 'password',
    rank: 'プレミアム会員',
  },
  {
    email: 'sakura@example.com',
    password: 'pass1234',
    rank: '一般会員',
  },
  {
    email: 'jun@example.com',
    password: 'pa55w0rd!',
    rank: 'プレミアム会員',
  },
  {
    email: 'yoshiki@example.com',
    password: 'pass-pass',
    rank: '一般会員',
  },
];

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    // await page.getByRole('link', { name: 'ログイン' }).click();
    await page.locator('#login-holder > a').click();
  });

  for (const account of accounts) {
    test(`Happy path (email: ${account.email})`, async ({ page }) => {
      await page.getByLabel('メールアドレス').fill(account.email);
      await page.getByLabel('パスワード').fill(account.password);
      await page.locator('#login-button').click();

      await expect(page).toHaveURL(/\/ja\/mypage/);
      await expect(page.locator('#rank')).toHaveText(account.rank);
    });
  }

  test(`Sad path 1`, async ({ page }) => {
    await expect(page.locator('#email-message')).toHaveText('');
    await expect(page.locator('#password-message')).toHaveText('');
    await page.locator('#login-button').click();
    await expect(page.locator('#email-message')).toHaveText('このフィールドを入力してください。');
    await expect(page.locator('#password-message')).toHaveText('このフィールドを入力してください。');
  });

  test(`Sad path 2`, async ({ page }) => {
    await expect(page.locator('#email-message')).toHaveText('');
    await expect(page.locator('#password-message')).toHaveText('');
    await page.getByLabel('メールアドレス').fill('test@mail.com');
    await page.getByLabel('パスワード').fill('password');
    await page.locator('#login-button').click();
    await expect(page.locator('#email-message')).toHaveText('メールアドレスまたはパスワードが違います。');
    await expect(page.locator('#password-message')).toHaveText('メールアドレスまたはパスワードが違います。');
  });
});
