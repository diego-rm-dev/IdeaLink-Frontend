
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Idea } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

interface IdeaCardProps {
  idea: Idea;
  showMetrics?: boolean;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, showMetrics = false }) => {
  // Format price with commas
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(idea.price);
  
  // Format date
  const formattedDate = new Date(idea.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  // Get badge color based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'sold': return 'secondary';
      case 'funded': return 'success';
      default: return 'outline';
    }
  };
  
  // Get badge text with first letter capitalized
  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md border border-border hover:border-idea-primary/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant={getBadgeVariant(idea.status) as any} className="mb-2">
            {getStatusText(idea.status)}
          </Badge>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Eye size={14} />
            <span>{idea.views}</span>
          </div>
        </div>
        <CardTitle className="text-xl font-bold hover:text-idea-primary transition-colors">
          <Link to={`/idea/${idea.id}`}>
            {idea.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center gap-2 mt-1">
          <span className="text-idea-accent font-medium">{idea.category}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{formattedDate}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-muted-foreground text-sm">
          {idea.description}
        </p>
        
        {showMetrics && idea.metrics && (
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-muted/40 rounded p-2">
              <p className="text-xs text-muted-foreground">Success Prob.</p>
              <p className="font-semibold">{(idea.metrics.successProbability * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-muted/40 rounded p-2">
              <p className="text-xs text-muted-foreground">Risk Level</p>
              <p className="font-semibold">{idea.metrics.riskLevel}</p>
            </div>
            <div className="bg-muted/40 rounded p-2">
              <p className="text-xs text-muted-foreground">Exp. ROI</p>
              <p className="font-semibold">{idea.metrics.expectedROI}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={idea.seller.avatar} alt={idea.seller.name} />
            <AvatarFallback>{idea.seller.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{idea.seller.name}</span>
        </div>
        <div className="text-lg font-bold text-idea-primary">{formattedPrice}</div>
      </CardFooter>
    </Card>
  );
};

export default IdeaCard;
