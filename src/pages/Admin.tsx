import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { adminAPI, Model } from '@/api/api-methods';
import { Loader2, Eye, Calendar, User, Tag, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Admin = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingModel, setUpdatingModel] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [rejectionReasons, setRejectionReasons] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const fetchModels = async () => {
    setIsLoading(true);
    try {
      let response;
      if (statusFilter === 'pending') {
        response = await adminAPI.getPendingModels();
      } else {
        response = await adminAPI.getAllModelsAdmin({ status: statusFilter });
      }
      setModels(response.data.models);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [statusFilter]);

  const handleStatusUpdate = async (modelId: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    setUpdatingModel(modelId);
    try {
      const rejectionReason = newStatus === 'rejected' ? rejectionReasons[modelId] : undefined;
      
      if (newStatus === 'rejected' && !rejectionReason) {
        toast({
          title: 'Error',
          description: 'Please provide a rejection reason.',
          variant: 'destructive',
        });
        setUpdatingModel(null);
        return;
      }

      await adminAPI.updateModelStatus(modelId, newStatus, rejectionReason);
      
      toast({
        title: 'Success',
        description: `Model ${newStatus} successfully!`,
      });

      // Refresh the models list
      fetchModels();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUpdatingModel(null);
    }
  };

  const handleRejectionReasonChange = (modelId: string, reason: string) => {
    setRejectionReasons(prev => ({
      ...prev,
      [modelId]: reason
    }));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar searchQuery="" onSearchChange={() => {}} />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">Manage submitted AI models</p>
          </div>
          
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery="" onSearchChange={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">Manage submitted AI models</p>
        </div>

        <div className="mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending Models</SelectItem>
              <SelectItem value="approved">Approved Models</SelectItem>
              <SelectItem value="rejected">Rejected Models</SelectItem>
              <SelectItem value="all">All Models</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {models.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground text-lg">No models found for the selected filter.</p>
              </CardContent>
            </Card>
          ) : (
            models.map((model) => (
              <Card key={model._id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{model.name}</CardTitle>
                        <Badge variant={getStatusBadgeVariant(model.status)}>
                          {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription className="text-base">
                        {model.shortDescription}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {model.uploadedBy?.firstName} {model.uploadedBy?.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span>{model.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(model.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Provider:</span>
                      <span>{model.provider}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Pricing:</span>
                      <Badge variant="outline">{model.pricing}</Badge>
                    </div>
                    {model.externalUrl && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        <a 
                          href={model.externalUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {model.externalUrl}
                        </a>
                      </div>
                    )}
                  </div>

                  {model.longDescription && (
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {model.longDescription}
                      </p>
                    </div>
                  )}

                  {model.tags && model.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {model.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {model.status === 'rejected' && model.rejectionReason && (
                    <div>
                      <h4 className="font-semibold mb-2 text-destructive">Rejection Reason</h4>
                      <p className="text-sm text-muted-foreground bg-destructive/10 p-3 rounded-md">
                        {model.rejectionReason}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-4 border-t">
                    <Select
                      value={model.status}
                      onValueChange={(value) => handleStatusUpdate(model._id, value as 'approved' | 'rejected' | 'pending')}
                      disabled={updatingModel === model._id}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    {updatingModel === model._id && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </div>
                    )}
                  </div>

                  {/* Rejection reason input for new rejections */}
                  <div className="space-y-2">
                    <label htmlFor={`rejection-${model._id}`} className="text-sm font-medium">
                      Rejection Reason (required for rejection)
                    </label>
                    <Textarea
                      id={`rejection-${model._id}`}
                      placeholder="Provide a reason for rejecting this model..."
                      value={rejectionReasons[model._id] || ''}
                      onChange={(e) => handleRejectionReasonChange(model._id, e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;