# KEW.PA Asset Management System - Deployment Guide

## System Overview
This is a complete Malaysian Government KEW.PA-compliant asset management system that includes:

- **KEW.PA-1**: Asset Reception Forms
- **KEW.PA-2**: Asset Rejection Forms  
- **KEW.PA-3**: Asset Registration (Daftar Harta Modal)
- **KEW.PA-4**: Low-Value Asset Registration
- **KEW.PA-9**: Asset Movement/Loan Requests
- **KEW.PA-10**: Asset Damage Reports

## Quick Deployment (Windows)
1. Extract this folder to `C:\KEW-PA-Assets\`
2. Double-click `KEW.PA-Asset-Management.bat`
3. Follow the setup prompts
4. Access the system at `http://localhost:5000`

## Production Deployment
### Database Setup
```sql
CREATE DATABASE kewpa_assets;
CREATE USER kewpa_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE kewpa_assets TO kewpa_user;
```

### Environment Configuration
Update the DATABASE_URL in startup scripts:
```
postgresql://kewpa_user:secure_password@localhost:5432/kewpa_assets
```

### Network Access
For multi-user access, modify `server/index.ts`:
```javascript
app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:5000');
});
```

## Security Considerations
- Change default database credentials
- Enable SSL for production use
- Configure firewall rules
- Regular database backups
- User authentication (future enhancement)

## System Requirements
- Windows 10/11, macOS 10.15+, or Ubuntu 18.04+
- Node.js 18.0 or higher
- PostgreSQL 12.0 or higher
- 4GB RAM minimum
- 10GB free disk space

## Support
This system complies with Malaysian Government Circular AM 2.3 for asset management.