import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  Bot, 
  Palette, 
  Bell,
  Save,
  Upload
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from "@/components/ThemeToggle";

const Settings = () => {
  const { settings, updateSettings } = useThemeStore();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    businessName: settings.businessName,
    botName: settings.botName,
    primaryColor: settings.primaryColor,
    accentColor: settings.accentColor,
  });

  const [notifications, setNotifications] = useState({
    newMessage: true,
    botSwitch: true,
    dailyReport: false,
  });

  const handleSave = () => {
    updateSettings(formData);
    toast({
      title: 'Settings saved',
      description: 'Your changes have been applied successfully.',
    });
  };

  const sections = [
    {
      id: 'profile',
      title: 'Profile',
      description: 'Manage your account information',
      icon: User,
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Password and authentication settings',
      icon: Lock,
    },
    {
      id: 'bot',
      title: 'Bot Configuration',
      description: 'Customize your AI assistant',
      icon: Bot,
    },
    {
      id: 'theme',
      title: 'Theme & Branding',
      description: 'Personalize your dashboard appearance',
      icon: Palette,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Control how you receive alerts',
      icon: Bell,
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-card flex items-center gap-4 sm:gap-1 flex-col sm:flex-row justify-between border-b border-border px-6 py-4">
          <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your preferences and configurations
          </p>
          </div>
           <ThemeToggle />
               {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end"
          >
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </motion.div>
        </div>

        <div className="p-6 max-w-4xl space-y-6  overflow-y-auto h-[calc(100vh-96px)] scrollbar-thin">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profile
                </CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-2xl font-bold text-muted-foreground">
                      {currentUser?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input defaultValue={currentUser?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input defaultValue={currentUser?.username} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Security
                </CardTitle>
                <CardDescription>Password and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>
                <Button variant="outline">Change Password</Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bot Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  Bot Configuration
                </CardTitle>
                <CardDescription>Customize your AI assistant</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Bot Name</Label>
                  <Input
                    value={formData.botName}
                    onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
                    placeholder="e.g., Aria, Assistant"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Auto-response</p>
                    <p className="text-sm text-muted-foreground">Enable automatic bot responses</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Learning Mode</p>
                    <p className="text-sm text-muted-foreground">Allow bot to learn from admin responses</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Theme & Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Theme & Branding
                </CardTitle>
                <CardDescription>Personalize your dashboard appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-14 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-14 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-border">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <Button variant="outline">Upload Logo</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>Control how you receive alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'newMessage', label: 'New Message', desc: 'Get notified when a customer sends a message' },
                  { key: 'botSwitch', label: 'Bot Switch', desc: 'Alert when bot hands off to human' },
                  { key: 'dailyReport', label: 'Daily Report', desc: 'Receive daily analytics summary' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, [item.key]: checked })
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

      
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
