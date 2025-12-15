# Security Policy

## Overview

The CAC E-commerce PWA takes security seriously. This document outlines security best practices, known security measures, and how to report vulnerabilities.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Best Practices

### Environment Variables

**CRITICAL: Never commit `.env` files to version control!**

#### Generating Secure Secrets

Always generate strong random secrets for production:

```bash
# Generate JWT_SECRET (64 bytes)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use the provided script
node scripts/generate-secrets.js
```

#### Environment Variable Checklist

Before deploying to production, ensure:

- [ ] `JWT_SECRET` is a strong random value (minimum 64 bytes)
- [ ] `DATABASE_URL` uses a strong database password
- [ ] `NODE_ENV` is set to `production`
- [ ] `FRONTEND_URL` is set to your actual domain
- [ ] All `.env` files are listed in `.gitignore`
- [ ] No hardcoded secrets in source code

### Database Security

1. **Use Strong Passwords**
   - Database passwords should be at least 16 characters
   - Use a mix of uppercase, lowercase, numbers, and symbols
   - Never use default passwords in production

2. **Connection Security**
   - Use SSL/TLS for database connections in production
   - Restrict database access to specific IP addresses
   - Use separate database users for different environments

3. **Backup Strategy**
   - Implement automated daily backups
   - Store backups in a secure, encrypted location
   - Test restore procedures regularly

### Authentication & Authorization

1. **Password Security**
   - Passwords are hashed using bcrypt (10 rounds minimum)
   - Never store passwords in plain text
   - Enforce minimum password requirements

2. **JWT Tokens**
   - Tokens are stored in HttpOnly cookies to prevent XSS attacks
   - Token expiration is set to 7 days by default
   - Separate tokens for users and admins

3. **Session Management**
   - Implement logout functionality that clears tokens
   - Consider implementing token refresh mechanism
   - Monitor for suspicious authentication attempts

### File Upload Security

1. **File Type Validation**
   - Only PNG, JPG, and JPEG files are allowed
   - File types are validated by MIME type and extension
   - Maximum file size is 10MB

2. **File Storage**
   - Files are stored with UUID filenames to prevent conflicts
   - Consider migrating to cloud storage (AWS S3, Cloudinary) for production
   - Implement file scanning for malware in production

3. **Access Control**
   - Only authenticated admins can upload files
   - File uploads are protected by AdminJwtAuthGuard

### API Security

1. **CORS Configuration**
   - CORS is configured to allow only specific origins
   - Update `FRONTEND_URL` in production to your actual domain
   - Never use `*` for CORS origin in production

2. **Rate Limiting**
   - Throttler is configured to prevent brute force attacks
   - Consider implementing more granular rate limits per endpoint
   - Monitor for unusual traffic patterns

3. **Input Validation**
   - All inputs are validated using class-validator
   - DTOs define strict type checking
   - Sanitize user inputs to prevent injection attacks

### Production Environment

#### Before Deploying

- [ ] Update all environment variables
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure secure cookies (`secure: true` in production)
- [ ] Disable Swagger documentation in production
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure logging and monitoring
- [ ] Review and update CORS settings
- [ ] Implement rate limiting
- [ ] Set up automated backups
- [ ] Configure firewall rules

#### HTTPS Configuration

Always use HTTPS in production:

```typescript
// In production, update cookie settings
res.cookie('access_token', token, {
  httpOnly: true,
  secure: true,  // Set to true in production
  sameSite: 'strict',
  maxAge: 3600000,
})
```

### Code Security

1. **Dependency Management**
   ```bash
   # Regularly audit dependencies
   npm audit
   npm audit fix

   # Update dependencies
   npm update
   ```

2. **Security Headers**
   - Helmet middleware is configured for security headers
   - CSP, XSS protection, and other headers are enabled

3. **Sensitive Data**
   - Never log sensitive information (passwords, tokens, etc.)
   - Use environment variables for all secrets
   - Implement audit logging for admin actions

## Known Security Measures

### Implemented

- ✅ JWT authentication with HttpOnly cookies
- ✅ Bcrypt password hashing
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Input validation with class-validator
- ✅ File upload restrictions
- ✅ Admin authorization guards
- ✅ Rate limiting with Throttler
- ✅ SQL injection prevention (Prisma ORM)

### Recommended Additions

- 🔄 Two-factor authentication (2FA)
- 🔄 Email verification for user registration
- 🔄 Account lockout after failed login attempts
- 🔄 Password reset functionality
- 🔄 Audit logging for all admin actions
- 🔄 CAPTCHA for login/registration
- 🔄 Content Security Policy (CSP) headers
- 🔄 Automated security scanning in CI/CD

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **Do NOT** open a public issue
2. Email the security team at: `security@example.com` (replace with your actual email)
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: Within 24-48 hours
  - High: Within 7 days
  - Medium: Within 30 days
  - Low: Next release cycle

## Security Updates

Security updates will be released as soon as possible after a vulnerability is confirmed and fixed. Users will be notified through:

- GitHub Security Advisories
- Release notes
- Email notifications (if provided)

## Compliance

This project aims to follow security best practices from:

- OWASP Top 10
- CWE Top 25
- Node.js Security Best Practices

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)

## License

This security policy is part of the CAC project and is licensed under the MIT License.

---

**Last Updated**: 2025-01-15

For questions about this security policy, please contact the maintainers.
