import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import { z } from 'zod';
import { Check, X } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signupSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[@#$%&_+=\-:"<>?,./\s~]/, 'Password must contain at least one special character'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(100, 'Display name must be less than 100 characters'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  
  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      number: /[0-9]/.test(password),
      special: /[@#$%&_+=\-:"<>?,./\s~]/.test(password),
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
    };
    
    Object.values(checks).forEach(check => check && score++);
    
    let label = '';
    let color = '';
    
    if (score <= 2) {
      label = 'Weak';
      color = 'hsl(var(--destructive))';
    } else if (score === 3 || score === 4) {
      label = 'Medium';
      color = 'hsl(45 93% 47%)'; // yellow/orange
    } else {
      label = 'Strong';
      color = 'hsl(142 76% 36%)'; // green
    }
    
    return { score: (score / 5) * 100, label, color, checks };
  };
  
  // Update password strength on password change
  useEffect(() => {
    if (signupPassword) {
      const strength = calculatePasswordStrength(signupPassword);
      setPasswordStrength({ score: strength.score, label: strength.label, color: strength.color });
    } else {
      setPasswordStrength({ score: 0, label: '', color: '' });
    }
  }, [signupPassword]);
  
  // Check if passwords match
  const passwordsMatch = signupPassword === confirmPassword && confirmPassword !== '';
  
  // Check if password meets all requirements
  const getPasswordValidation = () => {
    return calculatePasswordStrength(signupPassword).checks;
  };
  
  const isPasswordValid = () => {
    const checks = getPasswordValidation();
    return Object.values(checks).every(check => check) && passwordsMatch;
  };

  // Check if user is already logged in or if this is a password reset
  useEffect(() => {
    const checkSession = async () => {
      // Check for password reset token in URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      
      if (type === 'recovery') {
        setIsResettingPassword(true);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session && !isResettingPassword) {
        navigate('/');
      }
    };
    checkSession();
  }, [navigate, isResettingPassword]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      const validatedData = loginSchema.parse({ email: loginEmail, password: loginPassword });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (error) {
        toast({
          title: 'Login failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      if (data.session) {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        navigate('/');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupClick = (e: React.FormEvent) => {
    e.preventDefault();
    // Show validation dialog
    setShowValidationDialog(true);
  };

  const handleSignup = async () => {
    setIsLoading(true);

    try {
      // Validate input
      const validatedData = signupSchema.parse({
        email: signupEmail,
        password: signupPassword,
        username,
        displayName,
      });

      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: validatedData.username,
            display_name: validatedData.displayName,
          },
        },
      });

      if (error) {
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'destructive',
        });
        setShowValidationDialog(false);
        return;
      }

      if (data.user) {
        toast({
          title: 'Account created!',
          description: 'Please check your email to confirm your account.',
        });
        // Clear form
        setSignupEmail('');
        setSignupPassword('');
        setConfirmPassword('');
        setUsername('');
        setDisplayName('');
        setShowValidationDialog(false);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
      setShowValidationDialog(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = resetPasswordSchema.parse({ email: resetEmail });

      const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Password reset email sent',
        description: 'Please check your email for the password reset link.',
      });
      setShowResetDialog(false);
      setResetEmail('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = signupSchema.shape.password.parse(newPassword);

      const { error } = await supabase.auth.updateUser({
        password: validatedData,
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Password updated',
        description: 'Your password has been successfully updated. You can now log in with your new password.',
      });
      
      setIsResettingPassword(false);
      setNewPassword('');
      navigate('/');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sbtp-cream to-white">
      <meta name="robots" content="noindex, nofollow" />
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          {isResettingPassword ? (
            <Card>
              <CardHeader>
                <CardTitle>Set New Password</CardTitle>
                <CardDescription>
                  Enter your new password below
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdatePassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters and contain at least one lowercase letter (a-z), uppercase letter (A-Z), number (0-9), and special character (@#$%&_+=-:"&lt;&gt;?,./ ~)
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          ) : (
            <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-primary/10 p-1">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                    <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="link" className="text-sm text-primary">
                          Forgot password?
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md bg-white">
                        <DialogHeader>
                          <DialogTitle className="text-primary">Reset Password</DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            Enter your email address and we'll send you a link to reset your password.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleResetPassword} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="reset-email">Email</Label>
                            <Input
                              id="reset-email"
                              type="email"
                              placeholder="your@email.com"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              required
                              disabled={isLoading}
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Join our community and start your food access journey
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignupClick}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="display-name">Display Name</Label>
                      <Input
                        id="display-name"
                        type="text"
                        placeholder="John Doe"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Must be at least 2 characters
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      
                      {/* Password Strength Indicator */}
                      {signupPassword && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">Password Strength:</span>
                            <span 
                              className="text-xs font-semibold"
                              style={{ color: passwordStrength.color }}
                            >
                              {passwordStrength.label}
                            </span>
                          </div>
                          <Progress 
                            value={passwordStrength.score} 
                            className="h-2"
                            style={{
                              ['--progress-background' as any]: passwordStrength.color,
                            }}
                          />
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        Must contain uppercase, lowercase, number, and special character
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      {confirmPassword && (
                        <div className="flex items-center gap-2">
                          {passwordsMatch ? (
                            <>
                              <Check className="h-4 w-4 text-green-600" />
                              <span className="text-xs text-green-600">Passwords match</span>
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 text-destructive" />
                              <span className="text-xs text-destructive">Passwords do not match</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading || !isPasswordValid()}
                    >
                      {isLoading ? 'Creating account...' : 'Sign Up'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
          )}
          
          {/* Password Validation Dialog */}
          <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
            <DialogContent className="sm:max-w-md bg-card">
              <DialogHeader>
                <DialogTitle className="text-foreground">Password Requirements</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Please ensure your password meets all requirements below
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-3 py-4">
                {(() => {
                  const validation = getPasswordValidation();
                  const requirements = [
                    { label: 'At least 8 characters', met: validation.length },
                    { label: 'Contains a number (0-9)', met: validation.number },
                    { label: 'Contains a special character', met: validation.special },
                    { label: 'Contains uppercase letter (A-Z)', met: validation.uppercase },
                    { label: 'Contains lowercase letter (a-z)', met: validation.lowercase },
                    { label: 'Passwords match', met: passwordsMatch },
                  ];
                  
                  return requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {req.met ? (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                          <X className="h-3 w-3 text-destructive" />
                        </div>
                      )}
                      <span className={`text-sm ${req.met ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {req.label}
                      </span>
                    </div>
                  ));
                })()}
              </div>
              
              <DialogFooter className="flex gap-2 sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowValidationDialog(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSignup}
                  disabled={!isPasswordValid() || isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Auth;
