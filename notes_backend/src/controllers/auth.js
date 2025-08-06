const authService = require('../services/auth');

// PUBLIC_INTERFACE
/**
 * Register user with email/password.
 */
async function signup(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await authService.signup(email, password);
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// PUBLIC_INTERFACE
/**
 * User login.
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const { user, token } = await authService.login(email, password);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

// PUBLIC_INTERFACE
/**
 * Whoami endpoint (get authorized user's profile).
 */
async function whoami(req, res) {
  try {
    const user = await authService.getCurrentUser(req);
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { signup, login, whoami };

