// Стрелка «на главную»: куда ведёт на сайте и в скачанном файле.
import test from 'node:test';
import assert from 'node:assert/strict';
import { HOME_URL, homeHref } from '../src/shared/home.js';

test('на сайте и локальном сервере — относительная ссылка на лендинг', () => {
  assert.equal(homeHref('https:'), './');
  assert.equal(homeHref('http:'), './');
});

test('файл, открытый с диска, — адрес сайта', () => {
  assert.equal(homeHref('file:'), HOME_URL);
  assert.match(HOME_URL, /^https:\/\/musalimov\.github\.io\/VAVT-Math\/$/);
});
