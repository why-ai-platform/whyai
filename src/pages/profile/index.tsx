import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar,
  Settings,
  Trophy,
  Target,
  TrendingUp,
  BookOpen,
  Code
} from 'lucide-react';
import { motion } from 'motion/react';
import { ROUTES } from '../../constants';

export function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Login Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please log in to access your profile
          </p>
          <Button 
            onClick={() => navigate(ROUTES.HOME)}
            className="bg-gradient-to-r from-blue-500 to-purple-600"
          >
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <Avatar className="w-32 h-32">
                <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {user?.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{user?.email}</p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    AI Enthusiast
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                    Level 5
                  </Badge>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    2,450 Points
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined October 2025</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4" />
                    <span>3 Achievements</span>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 text-center">
              <Code className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">127</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Problems</p>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">Top 5%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rank</p>
            </Card>
          </motion.div>
        </div>

        {/* Profile Content */}
        <Tabs defaultValue="settings" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Profile Settings
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Username</Label>
                  <Input id="github" placeholder="@username" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <Input id="linkedin" placeholder="linkedin.com/in/username" />
                </div>
                
                <Button className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600">
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Learning Preferences
              </h2>
              <div className="space-y-6">
                <div>
                  <Label className="mb-4 block">Preferred Learning Style</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="learning" value="visual" className="form-radio text-blue-600" />
                      <span className="text-gray-700 dark:text-gray-300">Visual (Videos & Diagrams)</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="learning" value="reading" className="form-radio text-blue-600" />
                      <span className="text-gray-700 dark:text-gray-300">Reading (Text & Articles)</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="learning" value="practice" className="form-radio text-blue-600" defaultChecked />
                      <span className="text-gray-700 dark:text-gray-300">Practice (Hands-on Coding)</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="learning" value="mixed" className="form-radio text-blue-600" />
                      <span className="text-gray-700 dark:text-gray-300">Mixed (All Types)</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-4 block">Email Notifications</Label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="form-checkbox text-blue-600" />
                      <span className="text-gray-700 dark:text-gray-300">Course Updates</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="form-checkbox text-blue-600" />
                      <span className="text-gray-700 dark:text-gray-300">New Problem Releases</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="form-checkbox text-blue-600" />
                      <span className="text-gray-700 dark:text-gray-300">Weekly Progress Report</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="form-checkbox text-blue-600" />
                      <span className="text-gray-700 dark:text-gray-300">Marketing Emails</span>
                    </label>
                  </div>
                </div>
                
                <Button className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600">
                  Save Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Security Settings
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <Button className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600">
                  Update Password
                </Button>
                
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">
                    Enable 2FA
                  </Button>
                </div>
                
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-red-600 dark:text-red-400 mb-4">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Once you delete your account, there is no going back
                  </p>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
