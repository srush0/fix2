'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, Camera, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import ChatWidget from '@/components/ChatWidget';
import AudioAssistant from '@/components/AudioAssistant';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile, useUserStats } from '@/hooks/useUser';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useUserProfile(authUser?.uid);
  const { stats } = useUserStats(authUser?.uid, authUser?.role);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    photoURL: ''
  });
  const [saving, setSaving] = useState(false);

  // Protect route
  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/login-selector');
    }
  }, [authUser, authLoading, router]);

  // Load profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || authUser?.displayName || '',
        phone: profile.phone || '',
        photoURL: profile.photoURL || authUser?.photoURL || ''
      });
    } else if (authUser) {
      setFormData({
        name: authUser.displayName || '',
        phone: '',
        photoURL: authUser.photoURL || ''
      });
    }
  }, [profile, authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        photoURL: formData.photoURL
      });
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', {
        description: error.message
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

  const getRoleBadgeColor = (role) => {
    const colors = {
      customer: 'bg-blue-500',
      provider: 'bg-green-500',
      admin: 'bg-purple-500',
      staff: 'bg-orange-500'
    };
    return colors[role] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#111827] mb-2">My Profile</h1>
          <p className="text-xl text-gray-600">Manage your account information</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="p-6 md:col-span-1">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={formData.photoURL} alt={formData.name} />
                  <AvatarFallback className="text-3xl">
                    {formData.name?.charAt(0) || authUser.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-[#111827] mb-1">
                {formData.name || 'User'}
              </h2>
              <p className="text-sm text-gray-600 mb-3">{authUser.email}</p>
              
              <Badge className={`${getRoleBadgeColor(authUser.role)} text-white capitalize`}>
                {authUser.role}
              </Badge>
            </div>

            {stats && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Bookings</span>
                    <span className="font-semibold">{stats.total || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">{stats.completed || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pending</span>
                    <span className="font-semibold text-yellow-600">{stats.pending || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cancelled</span>
                    <span className="font-semibold text-red-600">{stats.cancelled || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Edit Form */}
          <Card className="p-6 md:col-span-2">
            <h3 className="text-xl font-bold text-[#111827] mb-6">Edit Profile</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    value={authUser.email}
                    className="pl-10 bg-gray-50"
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="photoURL">Profile Picture URL</Label>
                <div className="relative mt-2">
                  <Camera className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="photoURL"
                    type="url"
                    value={formData.photoURL}
                    onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
                    className="pl-10"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter a URL to your profile picture</p>
              </div>

              <div>
                <Label>Role</Label>
                <div className="mt-2">
                  <Badge className={`${getRoleBadgeColor(authUser.role)} text-white capitalize`}>
                    {authUser.role}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-[#2D4FE0] hover:bg-[#1e3bc4]"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <ChatWidget />
      <AudioAssistant />
    </div>
  );
}