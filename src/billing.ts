import { S } from './state';
import { Storage } from './storage';
import { t } from './i18n';

// Mock implementation of Google Play Billing
export const Billing = {
  async init() {
    // Check local storage for unlocked status
    if (Storage.get('unlocked') === 'true') {
      S.unlocked = true;
    }
  },
  
  async purchase() {
    // Simulate purchase flow
    return new Promise((resolve) => {
      setTimeout(() => {
        S.unlocked = true;
        Storage.set('unlocked', 'true');
        alert(t('s_unlocked') || 'Pembelian berhasil! Semua fitur terbuka.');
        resolve(true);
      }, 1000);
    });
  },
  
  async restore() {
    // Simulate restore flow
    return new Promise((resolve) => {
      setTimeout(() => {
        if (Storage.get('unlocked') === 'true') {
          S.unlocked = true;
          alert('Pembelian berhasil dipulihkan.');
          resolve(true);
        } else {
          alert('Tidak ada pembelian yang ditemukan.');
          resolve(false);
        }
      }, 800);
    });
  }
};

