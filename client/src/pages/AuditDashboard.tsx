import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function AuditDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Get audit subscription
  const { data: subscription, isLoading: subLoading } = trpc.audit.getAuditSubscription.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Get all audits
  const { data: auditList = [], refetch: refetchAudits } = trpc.audit.getAudits.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Create audit mutation
  const createAuditMutation = trpc.audit.createAudit.useMutation({
    onSuccess: () => {
      toast.success("Audit created successfully!");
      setBusinessName("");
      setBusinessAddress("");
      setGoogleMapsUrl("");
      refetchAudits();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create audit");
    },
  });

  const handleCreateAudit = async () => {
    if (!businessName.trim()) {
      toast.error("Please enter a business name");
      return;
    }

    setIsCreating(true);
    try {
      await createAuditMutation.mutateAsync({
        businessName,
        businessAddress,
        googleMapsUrl,
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center radiant-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h1>
          <p className="text-slate-600 mb-6">Only admins can access the audit dashboard</p>
          <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen radiant-background">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Google Maps Audit Dashboard</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            Back
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Subscription Status */}
        {subLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          </div>
        ) : (
          <Card className="mb-8 border-2 border-blue-600">
            <CardHeader>
              <CardTitle>Your Audit Service</CardTitle>
              <CardDescription>
                {subscription?.status === "no_subscription"
                  ? "No active subscription"
                  : `Tier: ${subscription?.tier || "Unknown"}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Max Audits/Month</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {subscription?.maxAuditsPerMonth || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Used This Month</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {subscription?.auditsUsedThisMonth || 0}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-600 mb-2">Status</p>
                  <Badge className={subscription?.status === "active" ? "bg-green-600" : "bg-red-600"}>
                    {subscription?.status || "Unknown"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create New Audit */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Audit
            </CardTitle>
            <CardDescription>Add a business to audit for Google Maps accuracy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Business Name *
                </label>
                <Input
                  placeholder="e.g., Serenity Yoga Studio"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Business Address
                </label>
                <Input
                  placeholder="e.g., 123 Main St, City, State"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Google Maps URL
                </label>
                <Input
                  placeholder="https://maps.google.com/..."
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  disabled={isCreating}
                  type="url"
                />
              </div>

              <Button
                onClick={handleCreateAudit}
                disabled={isCreating || !businessName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Audit
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Audits List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Audits</CardTitle>
            <CardDescription>{auditList.length} total audits</CardDescription>
          </CardHeader>
          <CardContent>
            {auditList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600">No audits yet. Create your first audit above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {auditList.map((audit) => (
                  <div
                    key={audit.id}
                    className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{audit.businessName}</h3>
                        {audit.businessAddress && (
                          <p className="text-sm text-slate-600">{audit.businessAddress}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {audit.status === "completed" && (
                            <Badge className="bg-green-600 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Completed
                            </Badge>
                          )}
                          {audit.status === "flagged" && (
                            <Badge className="bg-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Flagged
                            </Badge>
                          )}
                          {audit.status === "pending" && (
                            <Badge className="bg-yellow-600">Pending</Badge>
                          )}
                          {audit.groundingScore !== null && (
                            <span className="text-sm font-semibold text-slate-900">
                              Score: {audit.groundingScore}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          {new Date(audit.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
