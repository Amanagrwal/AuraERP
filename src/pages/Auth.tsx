import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Mail, Lock, ArrowLeft, Loader2 , User} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

// const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

type AuthMode = 'login' | 'signup' | 'forgot';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get('mode') as AuthMode) || 'login';
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  
  const { signIn ,  auth } = useAuth();

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (auth) {
      navigate('/');
    }
  }, [auth, navigate]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    // const emailResult = emailSchema.safeParse(email);
    // if (!emailResult.success) {
    //   newErrors.email = emailResult.error.errors[0].message;
    // }

    if (mode !== 'forgot') {
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        newErrors.password = passwordResult.error.errors[0].message;
      }

      if (mode === 'signup' && password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!validateForm()) return;
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Login failed',
            description: error.message === 'Invalid login credentials' 
              ? 'Invalid email or password. Please try again.'
              : error.message,
            variant: 'destructive',
          });
        }
      }
      //  else if (mode === 'signup') {
      //   const { error } = await signUp(email, password);
      //   if (error) {
      //     toast({
      //       title: 'Sign up failed',
      //       description: error.message.includes('already registered')
      //         ? 'This email is already registered. Please login instead.'
      //         : error.message,
      //       variant: 'destructive',
      //     });
      //   } else {
      //     toast({
      //       title: 'Account created!',
      //       description: 'Please check your email to verify your account.',
      //     });
      //     setMode('login');
      //   }
      // } else if (mode === 'forgot') {
      //   const { error } = await resetPassword(email);
      //   if (error) {
      //     toast({
      //       title: 'Reset failed',
      //       description: error.message,
      //       variant: 'destructive',
      //     });
      //   } else {
      //     toast({
      //       title: 'Reset email sent',
      //       description: 'Please check your email for password reset instructions.',
      //     });
      //     setMode('login');
      //   }
      // }
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome back';
      case 'signup': return 'Create account';
      case 'forgot': return 'Reset password';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'login': return 'Enter your credentials to access your account';
      case 'signup': return 'Enter your details to create a new account';
      case 'forgot': return 'Enter your email to receive reset instructions';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        {/* <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-primary">
             <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold text-foreground">BillBook</span>
        </div> */}
    
        <Card className="shadow-xl border-border/50">

  <div className="flex h-22 items-center justify-center  border-sidebar-border p-2">
  <img
    src="/auartech_ERP_log.jpeg"
    alt="Auratech"
    className="h-16 w-22 sm:h-18 md:h-22"
  />
</div>
        
          <CardHeader className="space-y-1 text-center p-2">
            <CardTitle className="text-2xl font-display">{getTitle()}</CardTitle>
            <CardDescription>{getDescription()}</CardDescription>
          </CardHeader>

            
          <form onSubmit={handleSubmit} action="/login">
            <CardContent className="space-y-4">
              {mode === 'forgot' && (
                <Button
                  type="button"
                  variant="ghost"
                  className="gap-2 -ml-2 mb-2"
                  onClick={() => setMode('login')}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Button>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
              )}

              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>
              )}

              {/* {mode === 'login' && (
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setMode('forgot')}
                >
                  Forgot password?
                </Button>
              )} */}
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'login' && 'Sign in'}
                {mode === 'signup' && 'Create account'}
                {mode === 'forgot' && 'Send reset email'}
              </Button>

              {/* {mode !== 'forgot' && (
                <p className="text-sm text-center text-muted-foreground">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 text-primary"
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  >
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </Button>
                </p>
              )} */}
                <p className="text-center text-xs mt-3 text-dark">
              © {new Date().getFullYear()} AuraTech India Pvt. Ltd.
            </p>
            </CardFooter>

          </form>
        </Card>
      </div>
    </div>
  );
}
