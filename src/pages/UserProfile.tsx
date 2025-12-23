import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Camera,
  Save,
  ArrowLeft
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function UserProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@company.com',
    phone: '+91 9876543210',
    role: 'Administrator',
    avatar: '',
  });

  const handleSave = () => {
    toast({ title: 'Profile Updated', description: 'Your profile has been saved successfully' });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold">User Profile</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="animate-fade-in">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border-4 border-primary/20">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-primary" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div>
                <CardTitle className="font-display text-xl">{profile.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  {profile.role}
                </CardDescription>
              </div>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Full Name
            </Label>
            {isEditing ? (
              <Input
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
              />
            ) : (
              <p className="text-lg font-medium py-2">{profile.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email Address
            </Label>
            {isEditing ? (
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
              />
            ) : (
              <p className="text-lg font-medium py-2">{profile.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone Number
            </Label>
            {isEditing ? (
              <Input
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 9876543210"
              />
            ) : (
              <p className="text-lg font-medium py-2">{profile.phone}</p>
            )}
          </div>

          {/* Role (read-only) */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Role
            </Label>
            <div className="flex items-center gap-2 py-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Shield className="h-3.5 w-3.5" />
                {profile.role}
              </span>
            </div>
          </div>

          {/* Actions */}
          {isEditing && (
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1 gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Security</CardTitle>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Two-Factor Authentication
          </Button>
          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
