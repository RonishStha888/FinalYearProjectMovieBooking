import {
  hashPassword,
  verifyPassword,
  generateToken,
  decodeToken,
  validateEmail,
  validatePassword
} from '../utils/authHelpers.js';

describe('Authentication Module - Unit Tests', () => {
  
  describe('Password Hashing', () => {
    test('should hash password correctly', async () => {
      const password = 'Test@123';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBe(60); // bcrypt hash length
    });

    test('should verify correct password', async () => {
      const password = 'Test@123';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);
      
      expect(isValid).toBe(true);
    });

    test('should reject wrong password', async () => {
      const password = 'Test@123';
      const wrongPassword = 'Wrong@123';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(wrongPassword, hash);
      
      expect(isValid).toBe(false);
    });
  });

  describe('JWT Token Generation', () => {
    test('should generate valid JWT token', () => {
      const userId = 'user123';
      const token = generateToken(userId);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    test('should decode token with correct payload', () => {
      const userId = 'user123';
      const token = generateToken(userId);
      const decoded = decodeToken(token);
      
      expect(decoded.id).toBe(userId);
      expect(decoded.exp).toBeDefined();
    });

    test('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => decodeToken(invalidToken)).toThrow('Invalid token');
    });
  });

  describe('Email Validation', () => {
    test('should accept valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    test('should reject invalid email', () => {
      expect(validateEmail('test@invalid')).toBe(false);
      expect(validateEmail('notanemail')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });

    test('should reject empty email', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });
  });

  describe('Password Validation', () => {
    test('should accept strong password', () => {
      expect(validatePassword('Test@123')).toBe(true);
      expect(validatePassword('Strong!Pass1')).toBe(true);
    });

    test('should reject weak password', () => {
      expect(validatePassword('123')).toBe(false);
      expect(validatePassword('weak')).toBe(false);
      expect(validatePassword('NoSpecial1')).toBe(false);
    });

    test('should reject empty password', () => {
      expect(validatePassword('')).toBe(false);
      expect(validatePassword(null)).toBe(false);
      expect(validatePassword(undefined)).toBe(false);
    });
  });
});
