import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Bot, 
  Users, 
  ArrowLeftRight,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const messageData = [
  { name: 'Mon', messages: 120 },
  { name: 'Tue', messages: 180 },
  { name: 'Wed', messages: 150 },
  { name: 'Thu', messages: 220 },
  { name: 'Fri', messages: 280 },
  { name: 'Sat', messages: 160 },
  { name: 'Sun', messages: 90 },
];

const botVsAdminData = [
  { name: 'Bot Replies', value: 68, color: 'hsl(168, 84%, 32%)' },
  { name: 'Admin Replies', value: 32, color: 'hsl(220, 25%, 25%)' },
];

const productClicksData = [
  { name: 'Headphones', clicks: 45 },
  { name: 'Smart Watch', clicks: 38 },
  { name: 'Backpack', clicks: 28 },
  { name: 'Shoes', clicks: 22 },
  { name: 'Wallet', clicks: 18 },
];

const stats = [
  { 
    title: 'Total Messages', 
    value: '1,248', 
    change: '+12.5%',
    icon: MessageSquare,
    color: 'text-primary'
  },
  { 
    title: 'Bot Replies', 
    value: '847', 
    change: '+8.2%',
    icon: Bot,
    color: 'text-success'
  },
  { 
    title: 'Admin Replies', 
    value: '401', 
    change: '-3.1%',
    icon: Users,
    color: 'text-accent'
  },
  { 
    title: 'Bot → Human Switches', 
    value: '56', 
    change: '+2.8%',
    icon: ArrowLeftRight,
    color: 'text-destructive'
  },
];

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="flex-1">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor your business performance and customer engagement
          </p>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-96px)] scrollbar-thin">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className={`w-4 h-4 ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`} />
                          <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                            {stat.change}
                          </span>
                          <span className="text-xs text-muted-foreground">vs last week</span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Messages Over Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Messages Per Day
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={messageData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="name" className="text-muted-foreground" fontSize={12} />
                        <YAxis className="text-muted-foreground" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="messages" 
                          stroke="hsl(168, 84%, 32%)" 
                          strokeWidth={3}
                          dot={{ fill: 'hsl(168, 84%, 32%)', strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bot vs Admin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    Bot vs Admin Responses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={botVsAdminData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {botVsAdminData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    {botVsAdminData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-muted-foreground">
                          {item.name} ({item.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Product Clicks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Most Requested Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productClicksData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" className="text-muted-foreground" fontSize={12} />
                      <YAxis dataKey="name" type="category" width={100} className="text-muted-foreground" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="clicks" fill="hsl(168, 84%, 32%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Flow Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Conversation Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-4 py-8 overflow-x-auto">
                  {[
                    { label: 'Customer', icon: Users, color: 'bg-muted' },
                    { label: 'Bot', icon: Bot, color: 'bg-primary' },
                    { label: 'Toggle', icon: ArrowLeftRight, color: 'bg-accent' },
                    { label: 'Admin', icon: Users, color: 'bg-chat-admin' },
                    { label: 'Customer', icon: Users, color: 'bg-muted' },
                  ].map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-14 h-14 rounded-full ${step.color} flex items-center justify-center`}>
                          <step.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="text-xs text-muted-foreground mt-2">{step.label}</span>
                      </div>
                      {index < 4 && (
                        <div className="w-12 h-0.5 bg-border mx-2" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
