import Link from 'next/link';
import { GitPullRequest, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Badge } from '@/components/Badge';

const mockRepos = [
  { id: 1, name: 'frontend-app', provider: 'github', openPRs: 3, lastActivity: '2 hours ago' },
  { id: 2, name: 'api-service', provider: 'gitlab', openPRs: 1, lastActivity: '1 day ago' },
  { id: 3, name: 'mobile-app', provider: 'github', openPRs: 5, lastActivity: '3 hours ago' },
];

const recentPRs = [
  { id: 1, title: 'Add user authentication', repo: 'frontend-app', status: 'sent', time: '2 hours ago' },
  { id: 2, title: 'Fix API endpoint bug', repo: 'api-service', status: 'draft', time: '5 hours ago' },
  { id: 3, title: 'Update dependencies', repo: 'mobile-app', status: 'sent', time: '1 day ago' },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2 text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Overview of your repositories and recent activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Repositories</CardTitle>
            <GitPullRequest className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">12</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Connected to your accounts</p>
          </CardContent>
        </Card>
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Open PRs</CardTitle>
            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">9</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Across all repos</p>
          </CardContent>
        </Card>
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Drafts</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">3</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pending review</p>
          </CardContent>
        </Card>
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Sent This Week</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">15</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+20% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent PRs */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Pull Requests</CardTitle>
            <CardDescription>Your latest PR activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPRs.map((pr) => (
              <div key={pr.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900/90">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">{pr.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{pr.repo} • {pr.time}</p>
                </div>
                <Badge>
                  {pr.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Repositories */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle>Your Repositories</CardTitle>
            <CardDescription>Quick access to your most active repos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRepos.map((repo) => (
              <Link
                key={repo.id}
                href={`/repo/${repo.id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-900 dark:text-white">{repo.name}</p>
                    <Badge className="text-xs">
                      {repo.provider}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {repo.openPRs} open PRs • {repo.lastActivity}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
