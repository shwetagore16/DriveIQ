# 🤝 Contributing to DriveIQ

Thank you for your interest in contributing to DriveIQ! This document provides guidelines for contributing to the project.

---

## 🌟 Ways to Contribute

- 🐛 **Report Bugs** - Found a bug? Open an issue
- 💡 **Suggest Features** - Have an idea? We'd love to hear it
- 📝 **Improve Documentation** - Help make our docs better
- 🔧 **Submit Code** - Fix bugs or add features
- 🧪 **Testing** - Test on different hardware and report results
- 🎨 **UI/UX Improvements** - Enhance the dashboard design

---

## 🚀 Getting Started

### 1. Fork the Repository
```bash
# Click "Fork" button on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/driveiq.git
cd driveiq
```

### 2. Create a Branch
```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bugfix branch
git checkout -b bugfix/issue-description
```

### 3. Make Your Changes
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

### 4. Commit Your Changes
```bash
# Add your changes
git add .

# Commit with a descriptive message
git commit -m "Add: Feature description"
```

### 5. Push and Create Pull Request
```bash
# Push to your fork
git push origin feature/your-feature-name

# Go to GitHub and create a Pull Request
```

---

## 📋 Commit Message Guidelines

Use clear and descriptive commit messages:

```
Add: New feature or functionality
Fix: Bug fix
Update: Changes to existing features
Refactor: Code restructuring
Docs: Documentation changes
Style: Formatting, no code change
Test: Adding or updating tests
Chore: Maintenance tasks
```

**Examples:**
```
Add: GPS module integration with NEO-6M
Fix: MPU6050 connection timeout issue
Update: Risk score calculation algorithm
Docs: Add hardware troubleshooting guide
```

---

## 🎨 Code Style Guidelines

### Python (Backend)
```python
# Use PEP 8 style guide
# Use meaningful variable names
# Add docstrings for functions

def calculate_risk_score(data):
    """
    Calculate driver risk score based on driving events.
    
    Args:
        data (dict): Vehicle data with event flags
        
    Returns:
        dict: Risk score and breakdown
    """
    # Implementation
    pass
```

### JavaScript/React (Frontend)
```javascript
// Use camelCase for variables and functions
// Use PascalCase for components
// Add JSDoc comments for complex functions

/**
 * Calculate average risk score from history data
 * @param {Array} history - Array of risk score objects
 * @returns {number} Average risk score
 */
const calculateAverage = (history) => {
  // Implementation
};
```

### Arduino/C++ (Firmware)
```cpp
// Use descriptive variable names
// Add comments for hardware-specific code
// Follow Arduino style conventions

// Initialize MPU6050 sensor
void initializeMPU6050() {
  Wire.begin(D2, D1);  // SDA, SCL pins
  mpu.initialize();
  // Additional setup
}
```

---

## 🧪 Testing Guidelines

### Before Submitting
- [ ] Code compiles without errors
- [ ] Tested on target hardware (if applicable)
- [ ] All existing functionality still works
- [ ] No console errors in browser (frontend)
- [ ] Backend API responds correctly
- [ ] Documentation updated if needed

### Hardware Testing
If your changes affect hardware:
1. Test with ESP8266 + MPU6050
2. Verify WiFi connectivity
3. Check data transmission
4. Test for at least 10 minutes continuous operation

### Frontend Testing
```bash
cd frontend
npm test
npm run build  # Ensure no build errors
```

### Backend Testing
```bash
cd backend
python -m pytest  # If tests exist
python app.py     # Manual testing
```

---

## 📝 Pull Request Guidelines

### PR Title Format
```
[Category] Brief description

Examples:
[Feature] Add SMS alert functionality
[Fix] Resolve MPU6050 calibration issue
[Docs] Update installation guide
[UI] Improve dashboard responsiveness
```

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on hardware
- [ ] Tested in browser
- [ ] Backend tests pass
- [ ] No console errors

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

---

## 🐛 Bug Reports

### Before Reporting
1. Check if issue already exists
2. Try the latest version
3. Test with minimal configuration

### Bug Report Template
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Hardware: ESP8266 NodeMCU v3
- OS: Windows 10
- Browser: Chrome 120
- Backend: Python 3.10

## Screenshots/Logs
Add any relevant screenshots or error logs

## Additional Context
Any other information
```

---

## 💡 Feature Requests

### Feature Request Template
```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Any mockups, examples, or references
```

---

## 🔒 Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead:
1. Email security concerns privately
2. Provide detailed description
3. Allow time for fix before public disclosure

---

## 📚 Documentation Contributions

### Documentation Needs
- Installation guides for different OS
- Hardware compatibility testing
- Troubleshooting common issues
- Video tutorials
- Translation to other languages

### Style Guide
- Use clear, simple language
- Include code examples
- Add screenshots where helpful
- Test all instructions
- Keep formatting consistent

---

## 🎯 Priority Areas

We especially welcome contributions in:

1. **Hardware Compatibility**
   - Testing on different ESP8266 variants
   - Support for ESP32
   - Alternative sensor support

2. **Features**
   - Real GPS integration
   - SMS/Email alerts
   - Mobile app
   - Multi-driver support

3. **UI/UX**
   - Dashboard improvements
   - Accessibility features
   - Mobile responsiveness
   - Dark mode enhancements

4. **Backend**
   - Database optimization
   - API improvements
   - ML/AI integration
   - Real-time notifications

---

## 📞 Communication

- **GitHub Issues** - Bug reports and feature requests
- **Pull Requests** - Code contributions
- **Discussions** - General questions and ideas

---

## ⚖️ Code of Conduct

### Our Standards
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Unprofessional conduct

---

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Credited in release notes
- Mentioned in project documentation

---

## ❓ Questions?

Feel free to:
- Open a GitHub Discussion
- Comment on relevant issues
- Reach out to maintainers

---

<div align="center">

**Thank you for contributing to DriveIQ! 🚗💨**

Every contribution, no matter how small, makes a difference!

</div>
