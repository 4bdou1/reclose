import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowRight, Check, Send } from 'lucide-react';
import { toast } from 'sonner';
import Reveal from '../Reveal';

const LeadCaptureForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    business_name: '',
    business_type: '',
    needs: [] as string[],
    message: ''
  });

  const serviceOptions = ['Business Automation', 'Website Creation'];

  const handleCheckboxChange = (need: string) => {
    setFormData(prev => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter(n => n !== need)
        : [...prev.needs, need]
    }));
  };

  const validate = () => {
    if (!formData.full_name.trim()) return 'Full name is required';
    if (!formData.business_name.trim()) return 'Business name is required';
    if (!formData.business_type.trim()) return 'Business type is required';
    if (formData.needs.length === 0) return 'Please select at least one service';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);

    try {
      const { error: dbError } = await supabase
        .from('leads')
        .insert([{
          full_name: formData.full_name,
          business_name: formData.business_name,
          business_type: formData.business_type,
          needs: formData.needs,
          message: formData.message,
          status: 'New'
        }]);

      if (dbError) throw dbError;

      const whatsappNumber = '1234567890';
      const text = `Hi, I'm interested in working with REclose.\n\nName: ${formData.full_name}\nBusiness: ${formData.business_name}\nType: ${formData.business_type}\nNeeds: ${formData.needs.join(', ')}\n\nMore Info: ${formData.message}`;
      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

      window.open(whatsappUrl, '_blank');

      setFormData({
        full_name: '',
        business_name: '',
        business_type: '',
        needs: [],
        message: ''
      });
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="get-started" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <Reveal width="100%">
            <div className="lux-panel rounded-[2.2rem] p-6 md:p-8">
              <p className="text-[11px] uppercase tracking-[0.35em] text-[#f0d39a]">Start a Project</p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                Give us the signal and we will take it from there.
              </h2>
              <p className="mt-5 text-base leading-7 text-white/66">
                Share the business, the service mix, and where you want the site or systems to improve. After submission, the flow hands off to WhatsApp so the conversation can move quickly.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Premium website direction and build planning',
                  'Automation opportunities around intake, follow-up, and booking',
                  'A cleaner first conversation with less back-and-forth',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
                    <div className="mt-0.5 rounded-full bg-[#D6B36B]/12 p-1.5 text-[#f0d39a]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-sm leading-6 text-white/74">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.8rem] border border-white/8 bg-[#0d0f13] p-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/38">What Happens Next</p>
                <div className="mt-4 space-y-3">
                  {[
                    'You submit the brief',
                    'Your details are stored in the lead system',
                    'WhatsApp opens with the context prefilled',
                  ].map((item, index) => (
                    <div key={item} className="flex items-center justify-between rounded-[1.2rem] border border-white/8 bg-black/25 px-4 py-3">
                      <span className="text-sm text-white/74">{item}</span>
                      <span className="text-xs uppercase tracking-[0.28em] text-white/32">0{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal width="100%" delay={140}>
            <div className="lux-panel rounded-[2.2rem] p-6 md:p-8">
              <div className="flex flex-col gap-2">
                <p className="text-[11px] uppercase tracking-[0.35em] text-white/42">Project Intake</p>
                <h3 className="text-3xl font-semibold tracking-[-0.04em] text-white">Tell us what you want built.</h3>
                <p className="text-sm leading-6 text-white/60">The more context you give us, the better we can shape the website and automation path.</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/74">Full Name *</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full rounded-[1.2rem] border border-white/10 bg-black/35 px-4 py-3.5 text-white placeholder:text-white/28 focus:border-[#D6B36B] focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/74">Business Name *</label>
                    <input
                      type="text"
                      value={formData.business_name}
                      onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                      className="w-full rounded-[1.2rem] border border-white/10 bg-black/35 px-4 py-3.5 text-white placeholder:text-white/28 focus:border-[#D6B36B] focus:outline-none"
                      placeholder="Your company"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/74">Business Type *</label>
                  <select
                    value={formData.business_type}
                    onChange={e => setFormData({ ...formData, business_type: e.target.value })}
                    className="w-full appearance-none rounded-[1.2rem] border border-white/10 bg-black/35 px-4 py-3.5 text-white focus:border-[#D6B36B] focus:outline-none"
                  >
                    <option value="" disabled>Select your industry</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Home Services">Home Services</option>
                    <option value="Health & Wellness">Health & Wellness</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Agency">Agency</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-white/74">What do you need? *</label>
                  <div className="grid gap-3 md:grid-cols-2">
                    {serviceOptions.map((need) => {
                      const selected = formData.needs.includes(need);

                      return (
                        <label
                          key={need}
                          className={`lux-button flex cursor-pointer items-center gap-3 rounded-[1.3rem] border px-4 py-4 ${selected ? 'border-[#D6B36B]/35 bg-[#D6B36B]/10 text-white' : 'border-white/10 bg-black/25 text-white/74 hover:border-white/20 hover:bg-white/[0.03]'}`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => handleCheckboxChange(need)}
                            className="h-4 w-4 rounded border-white/30 bg-transparent text-[#D6B36B] focus:ring-[#D6B36B]"
                          />
                          <span className="text-sm">{need}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/74">Tell us more</label>
                  <textarea
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full resize-none rounded-[1.2rem] border border-white/10 bg-black/35 px-4 py-3.5 text-white placeholder:text-white/28 focus:border-[#D6B36B] focus:outline-none"
                    placeholder="What should the new website feel like? Where is the current lead flow breaking?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="lux-button inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-semibold text-black hover:bg-[#f4f1ea] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {loading ? 'Submitting...' : (
                    <>
                      Continue to WhatsApp
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/34">
                  Submission stores the lead, then opens WhatsApp
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default LeadCaptureForm;
