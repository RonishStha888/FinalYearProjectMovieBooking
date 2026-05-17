// Simple in-memory rate limiter
// For production, use Redis or a dedicated rate limiting service

const rateLimitStore = new Map();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.resetTime > 60000) { // 1 minute
      rateLimitStore.delete(key);
    }
  }
}, 300000); // 5 minutes

/**
 * Rate limiter middleware
 * Limits requests to 10 per minute per IP
 */
export const chatbotRateLimiter = (req, res, next) => {
  const identifier = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const limit = 10; // 10 messages per minute
  const windowMs = 60000; // 1 minute

  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return next();
  }

  const userData = rateLimitStore.get(identifier);

  // Reset if window has passed
  if (now > userData.resetTime) {
    userData.count = 1;
    userData.resetTime = now + windowMs;
    return next();
  }

  // Increment count
  userData.count++;

  // Check if limit exceeded
  if (userData.count > limit) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait a moment before sending more messages.',
      retryAfter: Math.ceil((userData.resetTime - now) / 1000) // seconds
    });
  }

  next();
};
