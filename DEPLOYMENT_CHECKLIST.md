# 🚀 Firestore Security Rules - Deployment Checklist

Use this checklist to ensure proper deployment of Firestore security rules to production.

---

## 📋 Pre-Deployment Checklist

### 1. Review Security Rules
- [ ] Read `firestore.rules` file completely
- [ ] Understand each collection's access rules
- [ ] Review helper functions
- [ ] Verify admin override logic
- [ ] Check for any custom modifications needed

### 2. Documentation Review
- [ ] Read `FIRESTORE_SECURITY_RULES.md` (comprehensive guide)
- [ ] Review `SECURITY_RULES_QUICK_REFERENCE.md` (quick reference)
- [ ] Understand role-based access control
- [ ] Review common security scenarios

### 3. Local Testing
- [ ] Install Firebase CLI: `npm install -g firebase-tools`
- [ ] Install test dependencies: `npm install --save-dev @firebase/testing jest`
- [ ] Start Firebase emulators: `npm run emulators`
- [ ] Run test suite: `npm test`
- [ ] Verify all tests pass (20+ tests)
- [ ] Test manually with your application

### 4. Environment Setup
- [ ] Verify Firebase project is configured
- [ ] Check `firebase.json` exists
- [ ] Confirm correct project selected: `firebase use --add`
- [ ] Verify authentication is working
- [ ] Confirm Firestore database is initialized

---

## 🧪 Testing Phase

### Development Environment
- [ ] Deploy rules to development: `firebase use dev && firebase deploy --only firestore:rules`
- [ ] Test customer login and booking creation
- [ ] Test provider login and booking updates
- [ ] Test admin access to all collections
- [ ] Verify public access to services and providers
- [ ] Test unauthorized access scenarios
- [ ] Check Firebase Console for security violations
- [ ] Monitor for 24 hours

### Staging Environment (if available)
- [ ] Deploy rules to staging: `firebase use staging && firebase deploy --only firestore:rules`
- [ ] Run full regression test suite
- [ ] Test all user roles (customer, provider, admin, staff)
- [ ] Verify booking lifecycle (create → accept → complete)
- [ ] Test edge cases and error scenarios
- [ ] Load test with multiple concurrent users
- [ ] Monitor for 48 hours
- [ ] Review Firebase Console logs

---

## 🔍 Pre-Production Verification

### Security Audit
- [ ] Review all collection access rules
- [ ] Verify no sensitive data is publicly accessible
- [ ] Check that users can only access their own data
- [ ] Confirm admin override works correctly
- [ ] Verify role assignment logic
- [ ] Test with different user roles

### Performance Check
- [ ] Monitor Firestore read/write operations
- [ ] Check if `hasRole()` function causes too many reads
- [ ] Consider implementing Custom Claims if needed
- [ ] Review Firebase usage and billing
- [ ] Set up usage alerts

### Application Testing
- [ ] Test customer booking flow end-to-end
- [ ] Test provider dashboard functionality
- [ ] Test admin panel (if exists)
- [ ] Verify real-time updates work correctly
- [ ] Test cancel booking functionality
- [ ] Test profile updates
- [ ] Verify all error messages are user-friendly

---

## 🚀 Production Deployment

### Backup Current Rules
```bash
# Download current production rules
firebase use production
firebase firestore:rules:get > firestore.rules.backup
```

### Deploy to Production
```bash
# Switch to production project
firebase use production

# Dry run to check for errors
firebase deploy --only firestore:rules --dry-run

# Deploy rules
firebase deploy --only firestore:rules
```

### Post-Deployment Verification
- [ ] Verify rules are published in Firebase Console
- [ ] Test customer login immediately
- [ ] Test provider login immediately
- [ ] Create a test booking
- [ ] Update booking status
- [ ] Cancel a booking
- [ ] Verify no errors in Firebase Console
- [ ] Check application logs for errors

---

## 📊 Monitoring (First 24 Hours)

### Firebase Console Monitoring
- [ ] Monitor Firestore usage dashboard
- [ ] Check for security rule violations
- [ ] Review error logs
- [ ] Monitor read/write operations
- [ ] Check authentication logs
- [ ] Verify no unusual patterns

### Application Monitoring
- [ ] Monitor application error logs
- [ ] Check user reports/feedback
- [ ] Verify all features working
- [ ] Monitor API response times
- [ ] Check for any permission errors

### User Testing
- [ ] Test with real customer accounts
- [ ] Test with real provider accounts
- [ ] Verify admin functionality
- [ ] Check mobile app (if exists)
- [ ] Test on different browsers

---

## 🐛 Rollback Plan

### If Issues Occur
```bash
# Rollback to previous rules
firebase use production
firebase deploy --only firestore:rules < firestore.rules.backup
```

### Rollback Checklist
- [ ] Identify the issue
- [ ] Document the problem
- [ ] Execute rollback command
- [ ] Verify rollback successful
- [ ] Test application functionality
- [ ] Notify team of rollback
- [ ] Fix issues in development
- [ ] Re-test before next deployment

---

## ⚙️ Optional: Custom Claims Setup

For better performance in production, consider using Custom Claims instead of Firestore role lookup.

### Set Custom Claims (Admin SDK)
```javascript
// In your backend/cloud function
const admin = require('firebase-admin');

// Set custom claim for user
await admin.auth().setCustomUserClaims(uid, { 
  role: 'admin',
  provider: true 
});
```

### Update Security Rules
```javascript
// Replace hasRole() function with:
function hasRole(role) {
  return request.auth.token.role == role;
}
```

### Custom Claims Checklist
- [ ] Implement Custom Claims in backend
- [ ] Update security rules to use token claims
- [ ] Test thoroughly in development
- [ ] Deploy to staging
- [ ] Migrate existing users
- [ ] Deploy to production
- [ ] Monitor performance improvement

---

## 📈 Post-Deployment Tasks

### Week 1
- [ ] Daily monitoring of Firebase Console
- [ ] Review security rule violations
- [ ] Check for performance issues
- [ ] Gather user feedback
- [ ] Document any issues

### Week 2-4
- [ ] Weekly security audits
- [ ] Review Firebase usage and costs
- [ ] Optimize rules if needed
- [ ] Update documentation if needed
- [ ] Plan for Custom Claims if needed

### Ongoing
- [ ] Monthly security reviews
- [ ] Quarterly security audits
- [ ] Update rules as features are added
- [ ] Monitor Firebase announcements
- [ ] Keep documentation updated

---

## 📞 Emergency Contacts

### Firebase Support
- Firebase Console: https://console.firebase.google.com/
- Firebase Support: https://firebase.google.com/support
- Status Page: https://status.firebase.google.com/

### Internal Team
- Development Team Lead: [Contact Info]
- DevOps Engineer: [Contact Info]
- Security Team: [Contact Info]
- On-Call Engineer: [Contact Info]

---

## 📚 Quick Reference Commands

### Deploy Rules
```bash
firebase deploy --only firestore:rules
```

### Test Rules Locally
```bash
firebase emulators:start
npm test
```

### View Current Rules
```bash
firebase firestore:rules:get
```

### Backup Rules
```bash
firebase firestore:rules:get > firestore.rules.backup
```

### Switch Projects
```bash
firebase use dev
firebase use staging
firebase use production
```

---

## ✅ Final Verification

Before marking deployment as complete:

- [ ] All tests passing
- [ ] Rules deployed to production
- [ ] No errors in Firebase Console
- [ ] Application working correctly
- [ ] All user roles tested
- [ ] Monitoring in place
- [ ] Team notified of deployment
- [ ] Documentation updated
- [ ] Rollback plan ready
- [ ] Emergency contacts available

---

## 🎉 Deployment Complete!

Once all items are checked:

1. Mark deployment as successful
2. Document deployment date and time
3. Archive this checklist for reference
4. Continue monitoring for 24-48 hours
5. Schedule follow-up review in 1 week

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Environment**: _______________  
**Status**: _______________

---

**Good luck with your deployment! 🚀**
