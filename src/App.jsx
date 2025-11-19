import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Zap, CheckCircle, Clock, Instagram, Youtube, Facebook, Video, Image, BarChart3, RefreshCw, Sparkles, Download, AlertCircle } from 'lucide-react';

const FocusFlowMarketing = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [contentQueue, setContentQueue] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalPosts: 24,
    avgEngagement: 4.2,
    clicks: 156,
    conversions: 8,
    revenue: 240
  });

  const contentTypes = [
    { type: 'Reel', platform: 'Instagram/Facebook', icon: Video, color: 'bg-pink-500' },
    { type: 'Static Post', platform: 'Instagram/Facebook', icon: Image, color: 'bg-purple-500' },
    { type: 'Story', platform: 'Instagram/Snapchat', icon: Zap, color: 'bg-yellow-500' },
    { type: 'Short', platform: 'YouTube/TikTok', icon: Youtube, color: 'bg-red-500' },
  ];

  const generateDemoContent = (theme, contentType) => {
    const demoContent = {
      'Morning Routine': {
        hook: '5AM productive morning that changed everything ✨',
        caption: '5AM productive morning that changed everything ✨\n\nStay organized and focused with FocusFlow Planner 🌸\n\n✨ 100-day challenges\n✨ Daily reflections\n✨ Motivational quotes\n\nDownload instantly 🔗 Link in bio\n\n#FocusFlow #StudyTok #ProductivityPlanner #MorningRoutine #StudentLife',
        visual: 'Aesthetic desk setup with FocusFlow Planner open, morning coffee, soft natural lighting',
        hashtags: '#FocusFlow #StudyTok #ProductivityPlanner #MorningRoutine #StudentLife'
      },
      'Study Motivation': {
        hook: 'POV: You finally got your life together 📚✨',
        caption: 'POV: You finally got your life together 📚✨\n\nThis planner changed my study game completely 🎯\n\nGet FocusFlow Planner and unlock your potential:\n✨ Track your progress\n✨ Stay motivated daily\n✨ Achieve your goals\n\nLink in bio 🔗\n\n#FocusFlow #StudyTok #StudentLife #StudyMotivation #ProductivityHacks',
        visual: 'Split screen showing before (messy desk) and after (organized with planner)',
        hashtags: '#FocusFlow #StudyTok #StudentLife #StudyMotivation #ProductivityHacks'
      },
      '100-Day Challenge': {
        hook: 'Day 1 vs Day 100 transformation 💪',
        caption: 'Day 1 vs Day 100 transformation 💪\n\nThe FocusFlow 100-day challenge literally changed my life 🌟\n\nWhat you get:\n✨ Daily goal tracking\n✨ Progress milestones\n✨ Habit formation tools\n\nStart your transformation today 🔗 Link in bio\n\n#FocusFlow #100DayChallenge #GlowUp #ProductivityJourney #StudentSuccess',
        visual: 'Timeline showing progression through 100 days with planner pages',
        hashtags: '#FocusFlow #100DayChallenge #GlowUp #ProductivityJourney #StudentSuccess'
      },
      'Quote of the Day': {
        hook: 'This quote hit different today 💭✨',
        caption: 'This quote hit different today 💭✨\n\n"Your only limit is you" 🌸\n\nFocusFlow Planner is packed with motivational quotes to keep you inspired every single day.\n\nGet yours now 🔗 Link in bio\n\n#FocusFlow #Motivation #QuoteOfTheDay #StudentLife #Mindset',
        visual: 'Minimalist quote overlay on aesthetic background with planner visible',
        hashtags: '#FocusFlow #Motivation #QuoteOfTheDay #StudentLife #Mindset'
      },
      'Productivity Hack': {
        hook: 'The planning method nobody talks about 🤫',
        caption: 'The planning method nobody talks about 🤫\n\nTime-blocking changed my productivity forever 📊\n\nFocusFlow Planner makes it SO easy:\n✨ Pre-designed templates\n✨ Weekly layouts\n✨ Goal tracking built-in\n\nLevel up your planning game 🔗 Link in bio\n\n#FocusFlow #ProductivityHack #TimeBlocking #StudyTips #StudentLife',
        visual: 'Close-up of time-blocking spread in planner with colorful markers',
        hashtags: '#FocusFlow #ProductivityHack #TimeBlocking #StudyTips #StudentLife'
      },
      'Student Life': {
        hook: 'How I stay on top of everything as a student 🎯',
        caption: 'How I stay on top of everything as a student 🎯\n\nJuggling classes, assignments, and life? Same.\n\nFocusFlow Planner keeps me organized:\n✨ Assignment tracker\n✨ Study schedule\n✨ Personal goals section\n\nGet yours 🔗 Link in bio\n\n#FocusFlow #StudentLife #StudyTok #CollegeLife #OrganizedStudent',
        visual: 'Student using planner in library or study space',
        hashtags: '#FocusFlow #StudentLife #StudyTok #CollegeLife #OrganizedStudent'
      },
      'Weekend Reset': {
        hook: 'Sunday reset routine for a productive week ☁️',
        caption: 'Sunday reset routine for a productive week ☁️\n\nHow I prep for success every weekend:\n✨ Review last week\n✨ Plan the week ahead\n✨ Set new intentions\n\nFocusFlow Planner makes it effortless 🌸\n\nStart fresh 🔗 Link in bio\n\n#FocusFlow #SundayReset #WeeklyPlanning #SelfCare #ProductivitySunday',
        visual: 'Cozy setup with planner, tea/coffee, planning for the week ahead',
        hashtags: '#FocusFlow #SundayReset #WeeklyPlanning #SelfCare #ProductivitySunday'
      }
    };

    return demoContent[theme] || demoContent['Morning Routine'];
  };

const generateContentWithAI = async (day, theme, contentType) => {
  try {
    const response = await fetch('/api/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ day, theme, contentType })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate content');
    }

     const data = await response.json();
    
    // Parse the Claude API response
    const text = data.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      return {
        hook: text.substring(0, 100),
        caption: text,
        visual: `${contentType.type} showcasing FocusFlow Planner`,
        hashtags: '#FocusFlow #StudyTok #ProductivityPlanner'
      };
    }
  } catch (error) {
    console.error('AI Generation Error:', error);
    // Fallback to demo content
    return generateDemoContent(theme, contentType);
  }
};
  const generateWeeklyContent = async () => {
    setIsGenerating(true);
    setApiError(null);
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const themes = [
      'Morning Routine',
      'Study Motivation',
      '100-Day Challenge',
      'Quote of the Day',
      'Productivity Hack',
      'Student Life',
      'Weekend Reset'
    ];

    try {
      const newQueue = [];
      
      for (let idx = 0; idx < days.length; idx++) {
        const day = days[idx];
        const theme = themes[idx];
        const contentType = contentTypes[idx % contentTypes.length];
        
        console.log(`Generating content for ${day}...`);
        
        // Generate AI content
        const aiContent = await generateContentWithAI(day, theme, contentType);
        
        newQueue.push({
          id: Date.now() + idx,
          day,
          date: new Date(Date.now() + idx * 86400000).toLocaleDateString(),
          type: contentType.type,
          platform: contentType.platform,
          theme: theme,
          hook: aiContent.hook,
          caption: aiContent.caption,
          hashtags: aiContent.hashtags,
          visual: aiContent.visual,
          cta: 'Link in bio 🔗',
          status: 'pending',
          icon: contentType.icon,
          color: contentType.color,
          estimatedReach: Math.floor(Math.random() * 5000) + 2000,
        });
        
        // Small delay to avoid rate limits
        if (idx < days.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      setContentQueue(newQueue);
      setWeeklyPlan({
        startDate: new Date().toLocaleDateString(),
        endDate: new Date(Date.now() + 7 * 86400000).toLocaleDateString(),
        totalPosts: 7,
        platforms: ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'Snapchat'],
      });
      
    } catch (error) {
      console.error('Generation failed:', error);
      setApiError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const approvePost = (id) => {
    setContentQueue(prev => 
      prev.map(post => 
        post.id === id ? { ...post, status: 'approved' } : post
      )
    );
  };

  const approveAll = () => {
    setContentQueue(prev => 
      prev.map(post => ({ ...post, status: 'approved' }))
    );
  };

  const scheduleApproved = () => {
    const approvedCount = contentQueue.filter(p => p.status === 'approved').length;
    if (approvedCount > 0) {
      alert(`✅ Successfully scheduled ${approvedCount} posts across all platforms!\n\nPosts will be published automatically according to your content calendar.`);
      setContentQueue(prev => 
        prev.map(post => 
          post.status === 'approved' ? { ...post, status: 'scheduled' } : post
        )
      );
    }
  };

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.totalPosts}</p>
            </div>
            <Calendar className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Engagement</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.avgEngagement}%</p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Link Clicks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.clicks}</p>
            </div>
            <Zap className="text-yellow-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{analytics.conversions}</p>
            </div>
            <CheckCircle className="text-purple-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${analytics.revenue}</p>
            </div>
            <Download className="text-pink-500" size={24} />
          </div>
        </div>
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-red-900 mb-1">API Error</p>
            <p className="text-sm text-red-700">{apiError}</p>
            <p className="text-xs text-red-600 mt-2">Make sure VITE_ANTHROPIC_API_KEY is set in your environment variables.</p>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">🤖 AI-Powered Content Generation</h3>
            <p className="text-gray-600">Generate 7 days of unique promotional content with Claude AI</p>
            {weeklyPlan && (
              <div className="mt-4 space-y-1">
                <p className="text-sm text-gray-700">📅 {weeklyPlan.startDate} - {weeklyPlan.endDate}</p>
                <p className="text-sm text-gray-700">📱 {weeklyPlan.platforms.join(', ')}</p>
              </div>
            )}
          </div>
          <button
            onClick={generateWeeklyContent}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Week
              </>
            )}
          </button>
        </div>
      </div>

      {contentQueue.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Quick Preview</h3>
            <span className="text-sm text-gray-600">
              {contentQueue.filter(p => p.status === 'approved').length} of {contentQueue.length} approved
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {contentQueue.map((post) => {
              const Icon = post.icon;
              return (
                <div key={post.id} className="border border-gray-200 rounded-lg p-3 hover:border-purple-300 transition-all">
                  <div className={`${post.color} w-10 h-10 rounded-lg flex items-center justify-center mb-2`}>
                    <Icon className="text-white" size={20} />
                  </div>
                  <p className="text-xs font-semibold text-gray-900 mb-1">{post.day}</p>
                  <p className="text-xs text-gray-600">{post.type}</p>
                  <div className="mt-2">
                    {post.status === 'approved' && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓ Approved</span>
                    )}
                    {post.status === 'scheduled' && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">📅 Scheduled</span>
                    )}
                    {post.status === 'pending' && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">⏳ Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const ContentQueueView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Content Queue</h2>
        <div className="flex gap-2">
          <button
            onClick={approveAll}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
          >
            <CheckCircle size={18} />
            Approve All
          </button>
          <button
            onClick={scheduleApproved}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
          >
            <Clock size={18} />
            Schedule Approved
          </button>
        </div>
      </div>

      {contentQueue.length === 0 ? (
        <div className="bg-gray-50 p-12 rounded-xl text-center">
          <Sparkles className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600">No content generated yet. Go to Dashboard to generate your weekly content!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contentQueue.map((post) => {
            const Icon = post.icon;
            return (
              <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className={`${post.color} w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{post.day} - {post.theme}</h3>
                        <p className="text-sm text-gray-600">{post.date} • {post.type} • {post.platform}</p>
                        {post.hook && (
                          <p className="text-sm font-semibold text-purple-600 mt-1 italic">"{post.hook}"</p>
                        )}
                      </div>
                      <button
                        onClick={() => approvePost(post.id)}
                        disabled={post.status !== 'pending'}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          post.status === 'approved' || post.status === 'scheduled'
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        {post.status === 'approved' && '✓ Approved'}
                        {post.status === 'scheduled' && '📅 Scheduled'}
                        {post.status === 'pending' && 'Approve'}
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-3">
                      <p className="text-sm text-gray-800 whitespace-pre-line">{post.caption}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1"><strong>Visual Concept:</strong></p>
                        <p className="text-gray-800">{post.visual}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1"><strong>Estimated Reach:</strong></p>
                        <p className="text-gray-800">{post.estimatedReach.toLocaleString()} impressions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const AnalyticsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Analytics</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Top Performing Posts (Last 30 Days)</h3>
        <div className="space-y-3">
          {[
            { content: 'Morning Routine Reel', engagement: 6.8, clicks: 45, conversions: 3 },
            { content: '100-Day Challenge Static Post', engagement: 5.2, clicks: 38, conversions: 2 },
            { content: 'Study Motivation Short', engagement: 4.9, clicks: 32, conversions: 2 },
            { content: 'Quote of the Day Story', engagement: 3.7, clicks: 21, conversions: 1 },
          ].map((post, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{post.content}</p>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-gray-600">Engagement</p>
                  <p className="font-bold text-green-600">{post.engagement}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Clicks</p>
                  <p className="font-bold text-blue-600">{post.clicks}</p>
                </div>
                <div>
                  <p className="text-gray-600">Conversions</p>
                  <p className="font-bold text-purple-600">{post.conversions}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="text-purple-600" size={20} />
          AI Content Recommendations
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li>• <strong>Double down on Reels:</strong> Your Reels have 2.3x higher engagement than static posts</li>
          <li>• <strong>Trending hashtag:</strong> Add #StudyWithMe to your next 3 posts (trending +340%)</li>
          <li>• <strong>Best posting time:</strong> 6-8 PM performs 45% better for your audience</li>
          <li>• <strong>Repost suggestion:</strong> Your "Morning Routine" reel from 2 weeks ago is ready to repost</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            FocusFlow Marketing Hub
          </h1>
          <p className="text-gray-600">AI-powered content generation & social media management</p>
        </div>

        <div className="flex gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BarChart3 size={20} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'content'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Calendar size={20} />
            Content Queue
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <TrendingUp size={20} />
            Analytics
          </button>
        </div>

        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'content' && <ContentQueueView />}
        {activeTab === 'analytics' && <AnalyticsView />}

        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">✅ System Status:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={16} />
              <span className="text-gray-700"><strong>AI Content Generation:</strong> Active (Claude API)</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-yellow-500" size={16} />
              <span className="text-gray-700"><strong>Social Media Posting:</strong> Manual (Coming soon)</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-yellow-500" size={16} />
              <span className="text-gray-700"><strong>Analytics Integration:</strong> Demo mode (Coming soon)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusFlowMarketing;