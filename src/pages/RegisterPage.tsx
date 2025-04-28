
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PrimaryButton from '@/components/PrimaryButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const userRoles = [
  { id: 'seller', name: 'Seller', description: 'I want to post and sell my ideas' },
  { id: 'buyer', name: 'Buyer', description: 'I want to browse and purchase ideas' },
  { id: 'investor', name: 'Investor', description: 'I want to find ideas to invest in' },
];

const RegisterPage = () => {
  const [step, setStep] = useState<'account' | 'profile' | 'verification'>('account');
  const [accountData, setAccountData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [profileData, setProfileData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    role: '',
  });
  const [governmentId, setGovernmentId] = useState<File | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAccountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: string) => {
    setProfileData(prev => ({ ...prev, role }));
  };

  const handleGovernmentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setGovernmentId(e.target.files[0]);
    }
  };

  const handleSelfiePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelfiePhoto(e.target.files[0]);
    }
  };

  const validateAccountData = () => {
    if (!accountData.email || !accountData.password || !accountData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    
    if (!accountData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (accountData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (accountData.password !== accountData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const validateProfileData = () => {
    if (!profileData.username || !profileData.firstName || !profileData.lastName || !profileData.role) {
      setError('Please fill in all fields and select a role');
      return false;
    }

    return true;
  };

  const validateVerificationData = () => {
    if (!governmentId) {
      setError('Please upload a government-issued ID');
      return false;
    }

    if (!selfiePhoto) {
      setError('Please upload a selfie photo');
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    setError(null);

    if (step === 'account') {
      if (validateAccountData()) {
        setStep('profile');
      }
    } else if (step === 'profile') {
      if (validateProfileData()) {
        setStep('verification');
      }
    }
  };

  const handlePrevStep = () => {
    setError(null);
    if (step === 'profile') {
      setStep('account');
    } else if (step === 'verification') {
      setStep('profile');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateVerificationData()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Placeholder for actual registration API call
      // Commented out for now, will be connected to backend later
      /*
      const formData = new FormData();
      
      // Add account data
      Object.entries(accountData).forEach(([key, value]) => {
        if (key !== 'confirmPassword') { // Don't send confirmPassword to server
          formData.append(key, value);
        }
      });
      
      // Add profile data
      Object.entries(profileData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Add verification files
      if (governmentId) {
        formData.append('governmentId', governmentId);
      }
      
      if (selfiePhoto) {
        formData.append('selfiePhoto', selfiePhoto);
      }
      
      const response = await fetch('/api/register', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      const data = await response.json();
      */
      
      // For now, just show a success message
      alert('Registration successful');
      
      // Redirect to login after successful registration
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
              <CardDescription className="text-center">
                Join IdeaLink to buy, sell, or invest in innovative ideas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Step indicator */}
              <div className="mb-6">
                <Tabs value={step} className="w-full">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger 
                      value="account" 
                      className="cursor-default"
                      disabled
                    >
                      Account
                    </TabsTrigger>
                    <TabsTrigger 
                      value="profile" 
                      className="cursor-default"
                      disabled
                    >
                      Profile
                    </TabsTrigger>
                    <TabsTrigger 
                      value="verification" 
                      className="cursor-default"
                      disabled
                    >
                      Verify
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <form onSubmit={handleSubmit}>
                {/* Account Step */}
                {step === 'account' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email" 
                        placeholder="name@example.com"
                        value={accountData.email}
                        onChange={handleAccountInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password"
                        name="password"
                        type="password" 
                        placeholder="••••••••"
                        value={accountData.password}
                        onChange={handleAccountInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input 
                        id="confirm-password"
                        name="confirmPassword"
                        type="password" 
                        placeholder="••••••••"
                        value={accountData.confirmPassword}
                        onChange={handleAccountInputChange}
                        required
                      />
                    </div>
                    <PrimaryButton 
                      type="button" 
                      className="w-full" 
                      onClick={handleNextStep}
                    >
                      Continue
                    </PrimaryButton>
                  </div>
                )}
                
                {/* Profile Step */}
                {step === 'profile' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Public Username</Label>
                      <Input 
                        id="username"
                        name="username"
                        type="text" 
                        placeholder="johndoe123"
                        value={profileData.username}
                        onChange={handleProfileInputChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        This will be your public display name on the platform
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName"
                          name="firstName"
                          type="text" 
                          placeholder="John"
                          value={profileData.firstName}
                          onChange={handleProfileInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName"
                          name="lastName"
                          type="text" 
                          placeholder="Doe"
                          value={profileData.lastName}
                          onChange={handleProfileInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Select Your Role</Label>
                      <RadioGroup 
                        value={profileData.role} 
                        onValueChange={handleRoleChange}
                        className="flex flex-col space-y-2"
                      >
                        {userRoles.map((role) => (
                          <div key={role.id} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                            <RadioGroupItem value={role.id} id={role.id} />
                            <Label htmlFor={role.id} className="cursor-pointer flex-1">
                              <div className="font-medium">{role.name}</div>
                              <div className="text-xs text-muted-foreground">{role.description}</div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="flex justify-between">
                      <PrimaryButton 
                        type="button" 
                        onClick={handlePrevStep}
                        variant="outline"
                      >
                        Back
                      </PrimaryButton>
                      <PrimaryButton 
                        type="button" 
                        onClick={handleNextStep}
                      >
                        Continue
                      </PrimaryButton>
                    </div>
                  </div>
                )}
                
                {/* Verification Step */}
                {step === 'verification' && (
                  <div className="space-y-4">
                    <div className="pb-4">
                      <h3 className="font-medium mb-2">Identity Verification</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        For security and trust, we require identity verification. Your information will remain private and encrypted.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="governmentId">Upload Government-issued ID</Label>
                      <Input 
                        id="governmentId"
                        type="file" 
                        accept="image/*"
                        className="cursor-pointer"
                        onChange={handleGovernmentIdChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Accepted formats: JPG, PNG, PDF (max 5MB)
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="selfiePhoto">Upload Selfie Photo</Label>
                      <Input 
                        id="selfiePhoto"
                        type="file" 
                        accept="image/*"
                        className="cursor-pointer"
                        onChange={handleSelfiePhotoChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Please upload a clear photo of your face (max 5MB)
                      </p>
                    </div>
                    
                    <div className="flex justify-between">
                      <PrimaryButton 
                        type="button" 
                        onClick={handlePrevStep}
                        variant="outline"
                      >
                        Back
                      </PrimaryButton>
                      <PrimaryButton 
                        type="submit" 
                        className="" 
                        isLoading={isLoading}
                      >
                        Create Account
                      </PrimaryButton>
                    </div>
                  </div>
                )}
              </form>
              
              <div className="mt-6 text-center">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="text-idea-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;
