import React, { useEffect, useState } from 'react';
import { Target, TrendingUp, Users, Clock, AlertCircle, PhoneCall, CheckCircle } from 'lucide-react';
import { googleSheetsAPI, AnalyticsData } from '../lib/googleSheets';
import { useGoogleAuth } from '../context/GoogleAuthContext';

const Analytics: React.FC = () => {
  const { spreadsheetId, accessToken, isReady } = useGoogleAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isReady || !spreadsheetId || !accessToken) return;
      setLoading(true);
      try {
        const result = await googleSheetsAPI.getAnalytics(spreadsheetId, accessToken);
        if (result) setData(result);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [spreadsheetId, accessToken, isReady]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Performance Dashboard</h1>
          <p className="text-sm text-gray-500">Live metrics from your Outreach Log</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="w-full h-32 bg-gray-200 rounded-3xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64 bg-gray-200 rounded-3xl animate-pulse" />
            <div className="h-64 bg-gray-200 rounded-3xl animate-pulse" />
          </div>
        </div>
      ) : !data ? (
        <div className="w-full py-20 text-center text-gray-500 bg-white border border-gray-100 rounded-3xl shadow-sm">
          Analytics tab not found or empty. Please ensure your spreadsheet has an "Analytics" tab.
        </div>
      ) : (
        <>
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="premium-card p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Total Outreaches</p>
              <p className="text-3xl font-semibold text-black">{data.overview.totalOutreaches}</p>
            </div>
            <div className="premium-card p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Responses (Yes)</p>
              <p className="text-3xl font-semibold text-green-600">{data.overview.totalResponses}</p>
            </div>
            <div className="premium-card p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">No Answer Rate</p>
              <p className="text-3xl font-semibold text-gray-700">{data.overview.noAnswerRate}</p>
            </div>
            <div className="premium-card p-5 bg-[#050505] text-white">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Response Rate</p>
              <p className="text-3xl font-semibold text-[#D6B36B]">{data.overview.responseRate}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* By Category */}
            <div className="premium-card p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-500">By Category</h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-3 font-semibold text-gray-500">Category</th>
                      <th className="pb-3 font-semibold text-gray-500 text-center">Total</th>
                      <th className="pb-3 font-semibold text-gray-500 text-center">Yes</th>
                      <th className="pb-3 font-semibold text-gray-500 text-center">No Answer</th>
                      <th className="pb-3 font-semibold text-gray-500 text-right">Response Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.byCategory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 font-medium text-gray-900">{item.category}</td>
                        <td className="py-3 text-center">{item.total}</td>
                        <td className="py-3 text-center text-green-600 font-medium">{item.yes}</td>
                        <td className="py-3 text-center text-gray-500">{item.noAnswer}</td>
                        <td className="py-3 text-right font-semibold">{item.responseRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending Follow-Ups & Time Slot */}
            <div className="space-y-6">
              <div className="premium-card p-6 border-red-100 bg-red-50/30">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wider uppercase text-red-800/70 mb-1">Follow-Ups Pending</p>
                    <p className="text-3xl font-bold text-red-600">{data.overview.followUpsPending}</p>
                  </div>
                </div>
              </div>

              <div className="premium-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-500">By Time Slot</h3>
                </div>
                <div className="space-y-4">
                  {data.byTimeSlot.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{item.timeSlot}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">{item.total} total</span>
                        <span className="font-semibold text-green-600 w-12 text-right">{item.responseRate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* By Contact Method */}
            <div className="premium-card p-6 lg:col-span-3">
              <div className="flex items-center gap-2 mb-6">
                <PhoneCall className="w-4 h-4 text-gray-400" />
                <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-gray-500">By Contact Method</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.byContactMethod.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col">
                    <p className="text-sm font-bold text-gray-900 mb-4">{item.method}</p>
                    <div className="grid grid-cols-2 gap-4 mt-auto">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Outreaches</p>
                        <p className="text-xl font-semibold">{item.total}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Response Rate</p>
                        <p className="text-xl font-semibold text-[#D6B36B]">{item.responseRate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
