import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Calendar, Mail, Phone, Upload, Eye, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { modelsAPI, Model } from "@/api/api-methods";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [userModels, setUserModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchUserModels();
  }, [isAuthenticated, navigate]);

  const fetchUserModels = async () => {
    try {
      setIsLoading(true);
      const response = await modelsAPI.getUserModels();
      setUserModels(response.data.models);
    } catch (error: any) {
      console.error('Failed to fetch user models:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch your models. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-blue-500 text-white font-bold text-2xl">
                    {getInitials(currentUser.firstName, currentUser.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">
                        {currentUser.firstName} {currentUser.lastName}
                      </h1>
                      <p className="text-muted-foreground mt-1">AI Model Developer</p>
                    </div>
                    <Button 
                      onClick={() => navigate('/upload-model')} 
                      className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Model
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{currentUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile</p>
                    <p className="font-medium">{currentUser.mobileNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">{formatDate(currentUser.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{userModels.length}</p>
                    <p className="text-sm text-muted-foreground">Total Models</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {userModels.filter(m => m.status === 'approved').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {userModels.filter(m => m.status === 'pending').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {userModels.reduce((total, model) => total + (model.installsCount || 0), 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Models Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                My AI Models
              </CardTitle>
              <CardDescription>
                Manage and track the performance of your uploaded AI models
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span className="text-muted-foreground">Loading your models...</span>
                </div>
              ) : userModels.length === 0 ? (
                <div className="text-center py-8">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No models uploaded yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by uploading your first AI model to share with the community.
                  </p>
                  <Button 
                    onClick={() => navigate('/upload-model')}
                    className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Your First Model
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userModels.map((model) => (
                    <div key={model.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                              <span className="text-xl font-bold text-primary">
                                {model.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{model.name}</h3>
                              <p className="text-sm text-muted-foreground">by {model.provider}</p>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {model.shortDescription}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="secondary">{model.category}</Badge>
                            <Badge variant="outline" className="capitalize">
                              {model.pricing}
                            </Badge>
                            {model.isApiAvailable && (
                              <Badge variant="outline" className="border-primary/50 text-primary">
                                API Available
                              </Badge>
                            )}
                            {model.isOpenSource && (
                              <Badge variant="outline" className="border-green-500/50 text-green-600">
                                Open Source
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Created: {formatDate(model.createdAt)}</span>
                            {model.installsCount && (
                              <span>{model.installsCount} views</span>
                            )}
                            <div className="flex items-center gap-1">
                              <span>Rating:</span> 
                              <span className="font-medium">{model.rating}/5</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(model.status)} flex items-center gap-1`}
                          >
                            {getStatusIcon(model.status)}
                            <span className="capitalize">{model.status}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;