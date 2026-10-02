const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../env');
const { generateOrderNumber } = require('../../helpers');
const { PERMISSIONS, ROLE_PERMISSIONS, ADMIN_ROLES } = require('../../constants');

describe('Auth & Permission Unit Tests', () => {
  describe('Password Hashing', () => {
    it('should correctly hash and verify passwords using bcrypt', async () => {
      const password = 'StrongPassword123!';
      const hash = await bcrypt.hash(password, 10);

      expect(hash).not.toBe(password);
      const isMatch = await bcrypt.compare(password, hash);
      expect(isMatch).toBe(true);

      const isWrongMatch = await bcrypt.compare('WrongPassword', hash);
      expect(isWrongMatch).toBe(false);
    });
  });

  describe('JWT Token Generation and Verification', () => {
    it('should generate a valid JWT token that can be decoded with secret', () => {
      const payload = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'user@example.com',
        name: 'Test User',
        isAdmin: false,
      };

      const token = jwt.sign(payload, config.jwt.accessSecret, { expiresIn: '15m' });
      expect(token).toBeDefined();

      const decoded = jwt.verify(token, config.jwt.accessSecret);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.isAdmin).toBe(false);
    });

    it('should fail verification if secret is invalid', () => {
      const payload = { id: '123' };
      const token = jwt.sign(payload, 'secret-one');

      expect(() => {
        jwt.verify(token, 'secret-two');
      }).toThrow();
    });
  });

  describe('Role-Based Access Control Matrix', () => {
    it('super_admin should have all defined permissions', () => {
      const superAdminPermissions = ROLE_PERMISSIONS[ADMIN_ROLES.SUPER_ADMIN];
      const allPermissions = Object.values(PERMISSIONS);

      for (const permission of allPermissions) {
        expect(superAdminPermissions).toContain(permission);
      }
    });

    it('order_manager should have order permissions but not admin user management', () => {
      const orderManagerPermissions = ROLE_PERMISSIONS[ADMIN_ROLES.ORDER_MANAGER];

      expect(orderManagerPermissions).toContain(PERMISSIONS.MANAGE_ORDERS);
      expect(orderManagerPermissions).not.toContain(PERMISSIONS.MANAGE_ADMIN_USERS);
      expect(orderManagerPermissions).not.toContain(PERMISSIONS.MANAGE_SETTINGS);
    });
  });

  describe('Helper Utilities', () => {
    it('generateOrderNumber should format correctly with prefix and padding', () => {
      const orderNumber = generateOrderNumber('TEST', 42);
      expect(orderNumber).toBe('TEST-000042');
    });
  });
});
