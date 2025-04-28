
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IdeaCard from '@/components/IdeaCard';
import { mockIdeas } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const IdeasPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Extract unique categories
  const categories = ['all', ...new Set(mockIdeas.map(idea => idea.category))];
  
  // Filter and sort ideas
  const filteredIdeas = mockIdeas.filter(idea => {
    // Apply search filter
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply category filter
    const matchesCategory = categoryFilter === 'all' || idea.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'success-prob':
        return (b.metrics?.successProbability || 0) - (a.metrics?.successProbability || 0);
      default:
        return 0;
    }
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Browse Ideas</h1>
            <p className="text-muted-foreground mb-8">
              Explore innovative ideas validated by our AI technology
            </p>
            
            {/* Filters and search */}
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <div>
                <Input
                  placeholder="Search ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="success-prob">Success Probability</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Tabs for idea status */}
            <Tabs defaultValue="all" className="mb-8">
              <TabsList>
                <TabsTrigger value="all">All Ideas</TabsTrigger>
                <TabsTrigger value="published">Available</TabsTrigger>
                <TabsTrigger value="sold">Sold</TabsTrigger>
                <TabsTrigger value="funded">Funded</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredIdeas.length > 0 ? (
                    filteredIdeas.map(idea => (
                      <IdeaCard key={idea.id} idea={idea} />
                    ))
                  ) : (
                    <div className="col-span-3 py-12 text-center">
                      <p className="text-muted-foreground">No ideas found matching your filters.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="published">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredIdeas.filter(idea => idea.status === 'published').length > 0 ? (
                    filteredIdeas.filter(idea => idea.status === 'published').map(idea => (
                      <IdeaCard key={idea.id} idea={idea} />
                    ))
                  ) : (
                    <div className="col-span-3 py-12 text-center">
                      <p className="text-muted-foreground">No available ideas found matching your filters.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="sold">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredIdeas.filter(idea => idea.status === 'sold').length > 0 ? (
                    filteredIdeas.filter(idea => idea.status === 'sold').map(idea => (
                      <IdeaCard key={idea.id} idea={idea} />
                    ))
                  ) : (
                    <div className="col-span-3 py-12 text-center">
                      <p className="text-muted-foreground">No sold ideas found matching your filters.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="funded">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredIdeas.filter(idea => idea.status === 'funded').length > 0 ? (
                    filteredIdeas.filter(idea => idea.status === 'funded').map(idea => (
                      <IdeaCard key={idea.id} idea={idea} />
                    ))
                  ) : (
                    <div className="col-span-3 py-12 text-center">
                      <p className="text-muted-foreground">No funded ideas found matching your filters.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default IdeasPage;
