
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockIdeas, currentUser } from '@/data/mockData';
import IdeaCard from '@/components/IdeaCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PrimaryButton from '@/components/PrimaryButton';
import { useValidateIdea } from '@/hooks/useValidateIdea';
import { AI_CONFIG, getApiStatus } from '@/services/aiConfig';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('my-ideas');
  const { validateIdea } = useValidateIdea();
  const apiStatus = getApiStatus();
  
  // Filter ideas based on current user
  const myIdeas = mockIdeas.filter(idea => idea.seller.id === currentUser.id);
  const opportunities = mockIdeas.filter(idea => 
    idea.status === 'published' && idea.seller.id !== currentUser.id
  );
  
  // Mock investments data
  const myInvestments = [
    {
      id: 'inv1',
      ideaId: mockIdeas[4].id, // Mental Health Check-in Chatbot
      idea: mockIdeas[4],
      amount: 15000,
      equityPercentage: 12,
      date: '2023-08-05',
      status: 'active'
    }
  ];
  
  // Handle new idea submission
  const handleNewIdea = () => {
    alert('This would open a form to submit a new idea');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">{currentUser.name}'s Dashboard</h1>
                    <p className="text-muted-foreground">
                      Role: {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                    </p>
                  </div>
                </div>
                <div>
                  <PrimaryButton onClick={handleNewIdea}>
                    Post New Idea
                  </PrimaryButton>
                </div>
              </div>
            </div>
            
            {/* AI Status Card */}
            <div className="mb-8">
              <Card className="border border-border">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>AI Validation System</CardTitle>
                      <CardDescription>Powered by {AI_CONFIG.provider} v{AI_CONFIG.version}</CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      apiStatus.status === 'configured' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {apiStatus.status === 'configured' ? 'Connected' : 'Configuration Needed'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-2 ${apiStatus.status === 'configured' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <p className="text-sm text-muted-foreground">{apiStatus.message}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Dashboard tabs */}
            <Tabs
              defaultValue="my-ideas" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <TabsList>
                <TabsTrigger value="my-ideas">My Ideas</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                <TabsTrigger value="investments">My Investments</TabsTrigger>
              </TabsList>
              
              {/* My Ideas Tab */}
              <TabsContent value="my-ideas" className="mt-6">
                <h2 className="text-xl font-semibold mb-4">My Ideas</h2>
                {myIdeas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myIdeas.map(idea => (
                      <IdeaCard key={idea.id} idea={idea} showMetrics />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <p className="text-muted-foreground mb-4">You haven't posted any ideas yet.</p>
                    <PrimaryButton onClick={handleNewIdea}>Post Your First Idea</PrimaryButton>
                  </div>
                )}
              </TabsContent>
              
              {/* Opportunities Tab */}
              <TabsContent value="opportunities" className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Available Opportunities</h2>
                {opportunities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {opportunities.map(idea => (
                      <IdeaCard key={idea.id} idea={idea} showMetrics />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <p className="text-muted-foreground">No opportunities available at the moment.</p>
                  </div>
                )}
              </TabsContent>
              
              {/* Investments Tab */}
              <TabsContent value="investments" className="mt-6">
                <h2 className="text-xl font-semibold mb-4">My Investments</h2>
                {myInvestments.length > 0 ? (
                  <div className="space-y-6">
                    {myInvestments.map(investment => (
                      <Card key={investment.id} className="border border-border">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                          <CardHeader className="md:col-span-2">
                            <CardTitle>{investment.idea.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {investment.idea.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6 md:pt-0 pb-6 md:pb-0 md:border-l border-border">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Investment:</span>
                                <span className="font-medium">${investment.amount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Equity:</span>
                                <span className="font-medium">{investment.equityPercentage}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Date:</span>
                                <span className="font-medium">
                                  {new Date(investment.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Status:</span>
                                <span className="font-medium capitalize">{investment.status}</span>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                    <p className="text-muted-foreground mb-4">You haven't made any investments yet.</p>
                    <PrimaryButton onClick={() => setActiveTab('opportunities')}>
                      Browse Opportunities
                    </PrimaryButton>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;
