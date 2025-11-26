"""
Rate Limiting using Cloudflare KV
100 requests per hour per client ID
"""
import time
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class RateLimiter:
    """
    Rate limiter using Cloudflare Workers KV
    
    Configuration:
    - max_requests: 100 requests per window (default)
    - window_seconds: 3600 seconds (1 hour)
    
    Client identification:
    - Header "X-User-ID" (authenticated users)
    - Fallback to IP address (anonymous users)
    """
    
    def __init__(
        self,
        max_requests: int = 100,
        window_seconds: int = 3600
    ):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        
        # Cloudflare KV binding injected by runtime
        # Configured in wrangler.toml
        self.kv = None  # Will be set by Cloudflare runtime
        
        logger.info(
            f"Rate limiter initialized: "
            f"{max_requests} requests per {window_seconds}s window"
        )
    
    async def check_limit(self, client_id: str) -> bool:
        """
        Check if client is within rate limit
        
        Args:
            client_id: Unique client identifier (user ID or IP)
            
        Returns:
            True if request allowed, False if rate limited
        """
        # Fallback: Allow all requests if KV not available
        if not self.kv:
            logger.warning("KV store not available, rate limiting disabled")
            return True
        
        try:
            key = f"rate_limit:{client_id}"
            current_time = int(time.time())
            
            # Get current rate limit data
            data = await self.kv.get(key, type="json")
            
            if not data:
                # First request in window
                await self.kv.put(
                    key,
                    {
                        "count": 1,
                        "window_start": current_time
                    },
                    expiration_ttl=self.window_seconds
                )
                logger.debug(f"New rate limit window for client {client_id}")
                return True
            
            # Check if window expired
            if current_time - data["window_start"] > self.window_seconds:
                # Reset window
                await self.kv.put(
                    key,
                    {
                        "count": 1,
                        "window_start": current_time
                    },
                    expiration_ttl=self.window_seconds
                )
                logger.debug(f"Rate limit window reset for client {client_id}")
                return True
            
            # Check if limit exceeded
            if data["count"] >= self.max_requests:
                logger.warning(
                    f"Rate limit exceeded for client {client_id}: "
                    f"{data['count']}/{self.max_requests} requests"
                )
                return False
            
            # Increment request count
            data["count"] += 1
            await self.kv.put(
                key,
                data,
                expiration_ttl=self.window_seconds
            )
            
            logger.debug(
                f"Rate limit check passed for client {client_id}: "
                f"{data['count']}/{self.max_requests} requests"
            )
            return True
            
        except Exception as e:
            logger.error(f"Rate limit check error: {str(e)}")
            # Fail open: allow request if rate limiting fails
            return True
    
    async def get_remaining(self, client_id: str) -> Optional[int]:
        """
        Get remaining requests in current window
        
        Args:
            client_id: Client identifier
            
        Returns:
            Remaining requests, or None if not tracked
        """
        if not self.kv:
            return None
        
        try:
            key = f"rate_limit:{client_id}"
            data = await self.kv.get(key, type="json")
            
            if not data:
                return self.max_requests
            
            current_time = int(time.time())
            if current_time - data["window_start"] > self.window_seconds:
                return self.max_requests
            
            return max(0, self.max_requests - data["count"])
            
        except Exception as e:
            logger.error(f"Get remaining error: {str(e)}")
            return None
    
    async def reset(self, client_id: str):
        """
        Manually reset rate limit for a client
        
        Useful for: Admin overrides, testing
        """
        if not self.kv:
            return
        
        try:
            key = f"rate_limit:{client_id}"
            await self.kv.delete(key)
            logger.info(f"Rate limit reset for client {client_id}")
        except Exception as e:
            logger.error(f"Rate limit reset error: {str(e)}")
