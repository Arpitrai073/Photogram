import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';

const AnalyticsDashboard = ({ userStats, postStats }) => {
    const [timeRange, setTimeRange] = useState('7d');
    const [selectedMetric, setSelectedMetric] = useState('engagement');

    const metrics = [
        {
            title: 'Total Followers',
            value: userStats?.followers || 0,
            change: '+12%',
            icon: Users,
            color: 'text-blue-600'
        },
        {
            title: 'Total Posts',
            value: userStats?.posts || 0,
            change: '+5%',
            icon: BarChart3,
            color: 'text-green-600'
        },
        {
            title: 'Total Likes',
            value: userStats?.totalLikes || 0,
            change: '+18%',
            icon: Heart,
            color: 'text-red-600'
        },
        {
            title: 'Total Views',
            value: userStats?.totalViews || 0,
            change: '+25%',
            icon: Eye,
            color: 'text-purple-600'
        }
    ];

    const engagementData = [
        { day: 'Mon', engagement: 65 },
        { day: 'Tue', engagement: 78 },
        { day: 'Wed', engagement: 90 },
        { day: 'Thu', engagement: 81 },
        { day: 'Fri', engagement: 95 },
        { day: 'Sat', engagement: 88 },
        { day: 'Sun', engagement: 72 }
    ];

    const topPosts = postStats?.topPosts || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                <div className="flex space-x-2">
                    {['7d', '30d', '90d'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 rounded-md text-sm ${
                                timeRange === range
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric) => (
                    <Card key={metric.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {metric.title}
                            </CardTitle>
                            <metric.icon className={`h-4 w-4 ${metric.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
                            <p className="text-xs text-green-600 flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {metric.change} from last period
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Engagement Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Engagement Rate</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-end justify-between space-x-2">
                        {engagementData.map((data, index) => (
                            <div key={data.day} className="flex flex-col items-center">
                                <div className="text-xs text-gray-500 mb-2">{data.engagement}%</div>
                                <div
                                    className="bg-blue-600 rounded-t w-8 transition-all duration-300"
                                    style={{ height: `${(data.engagement / 100) * 200}px` }}
                                />
                                <div className="text-xs text-gray-500 mt-2">{data.day}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Top Performing Posts */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Performing Posts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {topPosts.map((post, index) => (
                            <div key={post._id} className="flex items-center space-x-4">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </div>
                                <img
                                    src={post.image}
                                    alt="Post"
                                    className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium truncate">{post.caption}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <Eye className="h-4 w-4 mr-1" />
                                        {post.views}
                                    </div>
                                    <div className="flex items-center">
                                        <Heart className="h-4 w-4 mr-1" />
                                        {post.likes.length}
                                    </div>
                                    <div className="flex items-center">
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        {post.comments.length}
                                    </div>
                                    <div className="flex items-center">
                                        <Share2 className="h-4 w-4 mr-1" />
                                        {post.shares || 0}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalyticsDashboard;
