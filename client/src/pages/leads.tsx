import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap, Mail, Phone, Users } from "lucide-react";

export default function LeadsPage() {
  const [selectedNiche, setSelectedNiche] = useState<string>("Holistic Wellness");
  const [isGenerating, setIsGenerating] = useState(false);

  // Get available niches
  const { data: niches = [] } = trpc.leads.getAvailableNiches.useQuery();

  // Get today's hot leads
  const { data: hotLeads = [], refetch: refetchLeads } = trpc.leads.getTodaysHotLeads.useQuery();

  // Get niche source mapping
  const { data: nicheMapping } = trpc.leads.getNicheSourceMapping.useQuery(
    { niche: selectedNiche },
    { enabled: !!selectedNiche }
  );

  // Generate leads mutation
  const generateLeadsMutation = trpc.leads.generateLeadsForNiche.useMutation({
    onSuccess: () => {
      setIsGenerating(false);
      refetchLeads();
    },
    onError: (error) => {
      setIsGenerating(false);
      console.error("Failed to generate leads:", error);
    },
  });

  const handleGenerateLeads = async () => {
    setIsGenerating(true);
    await generateLeadsMutation.mutateAsync({ niche: selectedNiche });
  };

  const getQualificationColor = (score: number | null | undefined) => {
    if (!score) return "bg-gray-100";
    if (score >= 90) return "bg-green-100";
    if (score >= 80) return "bg-blue-100";
    if (score >= 70) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getQualificationBadge = (score: number | null | undefined) => {
    if (!score) return "Unrated";
    if (score >= 90) return "🔥 Hot Lead";
    if (score >= 80) return "⭐ Strong";
    if (score >= 70) return "👍 Good";
    return "📋 Review";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Lead Generation Engine</h1>
          <p className="text-lg text-slate-600">AI-powered leads tailored to your niche</p>
        </div>

        {/* Niche Selection & Generation */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle>Select Your Niche</CardTitle>
            <CardDescription className="text-blue-100">
              Choose your industry and we'll generate qualified leads for you
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {niches.map((niche) => (
                  <Button
                    key={niche}
                    onClick={() => setSelectedNiche(niche)}
                    variant={selectedNiche === niche ? "default" : "outline"}
                    className={`justify-start ${
                      selectedNiche === niche
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    {niche}
                  </Button>
                ))}
              </div>

              {/* Lead Sources */}
              {nicheMapping && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-slate-700 mb-2">
                    📍 Lead Sources for {selectedNiche}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {nicheMapping.sources.map((source) => (
                      <Badge key={source} variant="secondary">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerateLeads}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-6 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Leads...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Generate Today's Hot Leads
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Leads Display */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            🔥 Today's Hot Leads ({hotLeads.length})
          </h2>

          {hotLeads.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-slate-500 text-lg mb-4">No leads generated yet</p>
                <p className="text-slate-400 mb-6">
                  Click "Generate Today's Hot Leads" to start sourcing qualified prospects
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotLeads.map((lead) => (
                <Card
                  key={lead.id}
                  className={`border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow ${getQualificationColor(
                    lead.qualificationScore
                  )}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{lead.businessName}</CardTitle>
                        <CardDescription className="text-sm">
                          {lead.contactPerson}
                        </CardDescription>
                      </div>
                      <Badge className="bg-blue-600 hover:bg-blue-700">
                        {getQualificationBadge(lead.qualificationScore)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      {lead.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-blue-600 hover:underline break-all"
                          >
                            {lead.email}
                          </a>
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-green-600" />
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-green-600 hover:underline"
                          >
                            {lead.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Business Details */}
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      {lead.employees && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users className="h-4 w-4" />
                          <span>{lead.employees} employees</span>
                        </div>
                      )}
                      {lead.niche && (
                        <div className="text-xs">
                          <Badge variant="outline">{lead.niche}</Badge>
                        </div>
                      )}
                    </div>

                    {/* Online Presence */}
                    {lead.onlinePresence && (
                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-xs font-semibold text-slate-700 mb-1">
                          Online Presence:
                        </p>
                        <p className="text-xs text-slate-600 italic">
                          {lead.onlinePresence}
                        </p>
                      </div>
                    )}

                    {/* Notes */}
                    {lead.notes && (
                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-xs font-semibold text-slate-700 mb-1">Notes:</p>
                        <p className="text-xs text-slate-600">{lead.notes}</p>
                      </div>
                    )}

                    {/* Lead Source */}
                    {lead.leadSource && (
                      <div className="pt-2 border-t border-slate-200">
                        <Badge variant="secondary" className="text-xs">
                          Source: {lead.leadSource}
                        </Badge>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-3 flex gap-2">
                      {lead.email && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() => window.open(`mailto:${lead.email}`)}
                        >
                          Email
                        </Button>
                      )}
                      {lead.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() => window.open(`tel:${lead.phone}`)}
                        >
                          Call
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {hotLeads.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-blue-600">{hotLeads.length}</p>
                <p className="text-sm text-slate-600">Total Leads</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-green-600">
                  {hotLeads.filter((l) => (l.qualificationScore || 0) >= 90).length}
                </p>
                <p className="text-sm text-slate-600">Hot Leads (90+)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {(
                    hotLeads.reduce((sum, l) => sum + (l.qualificationScore || 0), 0) /
                    hotLeads.length
                  ).toFixed(0)}
                </p>
                <p className="text-sm text-slate-600">Avg. Score</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
