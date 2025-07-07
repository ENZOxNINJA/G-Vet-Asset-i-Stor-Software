import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Target,
  Database,
  MapPin,
  QrCode,
  Users,
  FileText,
  BarChart3
} from "lucide-react";

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'not-started';
  priority: 'high' | 'medium' | 'low';
  phase: 1 | 2 | 3 | 4 | 5;
  progress: number;
}

const roadmapItems: ComplianceItem[] = [
  // Phase 1: Planning & Requirements Gathering
  {
    id: 'data-model',
    title: 'Core Data Model Definition',
    description: 'Items, Assets, Locations, Transactions, Units with KEW.PA/KEW.PS compliance',
    status: 'completed',
    priority: 'high',
    phase: 1,
    progress: 100
  },
  {
    id: 'tech-stack',
    title: 'Technology Stack Selection',
    description: 'React, Node.js, PostgreSQL, TypeScript implementation',
    status: 'completed',
    priority: 'high',
    phase: 1,
    progress: 100
  },
  {
    id: 'wireframes',
    title: 'UI/UX Design & Wireframing',
    description: 'Modern gradient themes with glass morphism effects',
    status: 'completed',
    priority: 'medium',
    phase: 1,
    progress: 100
  },

  // Phase 2: Core System Development
  {
    id: 'database-api',
    title: 'Database Setup & API Development',
    description: 'RESTful APIs with Drizzle ORM and PostgreSQL',
    status: 'completed',
    priority: 'high',
    phase: 2,
    progress: 100
  },
  {
    id: 'authentication',
    title: 'User Authentication & Authorization',
    description: 'Role-based access control (Admin, Manager, Staff, Visitor)',
    status: 'completed',
    priority: 'high',
    phase: 2,
    progress: 100
  },
  {
    id: 'inventory-mgmt',
    title: 'Basic Inventory Management',
    description: 'KEW.PS store items with CRUD operations',
    status: 'completed',
    priority: 'high',
    phase: 2,
    progress: 100
  },
  {
    id: 'asset-mgmt',
    title: 'Basic Asset Management',
    description: 'KEW.PA asset registration and tracking',
    status: 'completed',
    priority: 'high',
    phase: 2,
    progress: 100
  },
  {
    id: 'multi-unit-basic',
    title: 'Multi-Unit Support (Initial)',
    description: 'Unit entity with basic filtering capabilities',
    status: 'completed',
    priority: 'high',
    phase: 2,
    progress: 100
  },
  {
    id: 'kew-forms-basic',
    title: 'KEW.PS & KEW.PA Core Flows',
    description: 'Basic form generation and workflow implementation',
    status: 'in-progress',
    priority: 'high',
    phase: 2,
    progress: 60
  },

  // Phase 3: Advanced Features & Multi-Unit Enhancement
  {
    id: 'map-tracking',
    title: 'Map-Based Asset Location Tracking',
    description: 'Geocoding integration with interactive map views',
    status: 'not-started',
    priority: 'medium',
    phase: 3,
    progress: 0
  },
  {
    id: 'qr-barcode',
    title: 'QR Code & Barcode Integration',
    description: 'Asset and inventory tracking with printable QR codes',
    status: 'completed',
    priority: 'high',
    phase: 3,
    progress: 100
  },
  {
    id: 'inter-unit-transfer',
    title: 'Enhanced Multi-Unit Transfers',
    description: 'Inter-unit inventory and asset transfer workflows',
    status: 'in-progress',
    priority: 'medium',
    phase: 3,
    progress: 60
  },
  {
    id: 'dynamic-forms',
    title: 'Dynamic Form Generation',
    description: 'Customizable fields and printable form templates',
    status: 'pending',
    priority: 'medium',
    phase: 3,
    progress: 10
  },
  {
    id: 'audit-trails',
    title: 'Transaction History & Audit Trails',
    description: 'Comprehensive logging of all inventory and asset movements',
    status: 'in-progress',
    priority: 'high',
    phase: 3,
    progress: 70
  },
  {
    id: 'alerts-notifications',
    title: 'Alerts & Notifications',
    description: 'Low stock alerts, maintenance reminders, overdue returns',
    status: 'pending',
    priority: 'medium',
    phase: 3,
    progress: 0
  },
  {
    id: 'advanced-reporting',
    title: 'Advanced Reporting & Dashboards',
    description: 'Visual dashboards and customizable reports',
    status: 'completed',
    priority: 'medium',
    phase: 3,
    progress: 100
  },
  {
    id: 'complete-kew-ps',
    title: 'Complete KEW.PS Flows',
    description: 'All KEW.PS forms (1-36) with verification and disposal workflows',
    status: 'pending',
    priority: 'high',
    phase: 3,
    progress: 25
  },
  {
    id: 'complete-kew-pa',
    title: 'Complete KEW.PA Flows',
    description: 'All KEW.PA forms with inspection, maintenance, and disposal',
    status: 'pending',
    priority: 'high',
    phase: 3,
    progress: 25
  },

  // Phase 4: Testing, Deployment & Optimization
  {
    id: 'user-testing',
    title: 'User Acceptance Testing',
    description: 'End-user testing and feedback collection',
    status: 'not-started',
    priority: 'high',
    phase: 4,
    progress: 0
  },
  {
    id: 'performance-testing',
    title: 'Performance Testing',
    description: 'Load testing and optimization',
    status: 'not-started',
    priority: 'medium',
    phase: 4,
    progress: 0
  },
  {
    id: 'security-audit',
    title: 'Security Audits',
    description: 'Vulnerability assessment and data privacy compliance',
    status: 'not-started',
    priority: 'high',
    phase: 4,
    progress: 0
  },
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'User manuals, admin guides, and API documentation',
    status: 'completed',
    priority: 'medium',
    phase: 4,
    progress: 100
  }
];

const getStatusIcon = (status: ComplianceItem['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'in-progress':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'pending':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'not-started':
      return <Target className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusColor = (status: ComplianceItem['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'not-started':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

const getPriorityColor = (priority: ComplianceItem['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'medium':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
  }
};

export default function RoadmapComplianceAnalysis() {
  const phaseStats = [1, 2, 3, 4, 5].map(phase => {
    const phaseItems = roadmapItems.filter(item => item.phase === phase);
    const totalProgress = phaseItems.reduce((sum, item) => sum + item.progress, 0);
    const averageProgress = phaseItems.length > 0 ? totalProgress / phaseItems.length : 0;
    
    return {
      phase,
      items: phaseItems.length,
      progress: averageProgress,
      completed: phaseItems.filter(item => item.status === 'completed').length
    };
  });

  const overallProgress = roadmapItems.reduce((sum, item) => sum + item.progress, 0) / roadmapItems.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Roadmap Compliance Analysis</h2>
        <p className="text-muted-foreground mt-1">
          Current system progress against the comprehensive inventory management roadmap
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="glass card-hover border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Overall Project Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Total Completion</span>
                <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {roadmapItems.filter(item => item.status === 'completed').length}
                </div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">
                  {roadmapItems.filter(item => item.status === 'in-progress').length}
                </div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">
                  {roadmapItems.filter(item => item.status === 'pending').length}
                </div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-400">
                  {roadmapItems.filter(item => item.status === 'not-started').length}
                </div>
                <div className="text-xs text-muted-foreground">Not Started</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Progress */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {phaseStats.map(({ phase, items, progress, completed }) => (
          <Card key={phase} className="glass card-hover border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Phase {phase}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {Math.round(progress)}%
                </div>
                <Progress value={progress} className="h-1" />
                <div className="text-xs text-muted-foreground">
                  {completed}/{items} items completed
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Items by Phase */}
      {[1, 2, 3, 4].map(phase => {
        const phaseItems = roadmapItems.filter(item => item.phase === phase);
        const phaseNames = {
          1: 'Planning & Requirements',
          2: 'Core System Development',
          3: 'Advanced Features',
          4: 'Testing & Deployment'
        };
        
        return (
          <Card key={phase} className="glass card-hover border-border/50">
            <CardHeader>
              <CardTitle>Phase {phase}: {phaseNames[phase as keyof typeof phaseNames]}</CardTitle>
              <CardDescription>
                {phaseItems.filter(item => item.status === 'completed').length} of {phaseItems.length} items completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {phaseItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="mt-0.5">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground truncate">{item.title}</h4>
                        <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                          {item.status.replace('-', ' ')}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={item.progress} className="h-1 flex-1" />
                        <span className="text-xs text-muted-foreground w-10">{item.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}