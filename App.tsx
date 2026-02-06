
import React, { useState } from 'react';
import { generateBlueprint, generateDesign, generateCopy } from './gemini';
import { Blueprint, StoreDesign, ProductCopy } from './types';
import SiteMapChart from './components/SiteMapChart';
import StorePreview from './components/StorePreview';
import { 
  ShoppingBag, 
  Map as MapIcon, 
  Layers, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ArrowRight,
  Sparkles,
  CreditCard,
  Truck,
  Palette,
  Layout,
  Globe,
  PenTool,
  Quote,
  Copy as CopyIcon,
  Check,
  Share2,
  Cpu
} from 'lucide-react';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'strategy' | 'design' | 'copy'>('strategy');
  
  // Strategy States
  const [product, setProduct] = useState('Sustainable dog toys');
  const [budget, setBudget] = useState<'small' | 'large'>('small');
  
  // Design States
  const [businessName, setBusinessName] = useState('TechPulse Accessories');
  const [style, setStyle] = useState('Industrial-minimalist, High-tech');
  const [palette, setPalette] = useState('Dark mode: #09090b, Accent: #ff5500');
  const [requirements, setRequirements] = useState('Include a Compatibility Checker (iPhone vs Android) and a Charging Speed Guide for GaN chargers.');

  // Copy States
  const [copyProduct, setCopyProduct] = useState('65W GaN Fast Charger');
  const [audience, setAudience] = useState('Tech enthusiasts and frequent travelers');
  const [features, setFeatures] = useState('65W, 3-ports, Foldable plug, PD 3.0, Overheat Protection, Smart Chip. Charging times: MacBook Pro (0-50% in 30m), iPhone 17 (0-50% in 25m).');
  const [tone, setTone] = useState('Efficient and reassuring');
  const [copyRequirements, setCopyRequirements] = useState('Focus on how it replaces three chargers and fits in a pocket.');

  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [storeDesign, setStoreDesign] = useState<StoreDesign | null>(null);
  const [productCopy, setProductCopy] = useState<ProductCopy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await generateBlueprint(product, budget);
      setBlueprint(data);
    } catch (err) {
      setError('Failed to generate blueprint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDesign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await generateDesign(businessName, style, palette, requirements);
      setStoreDesign(data);
    } catch (err) {
      setError('Failed to generate design mockup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copyProduct.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await generateCopy(copyProduct, audience, features, tone, copyRequirements);
      setProductCopy(data);
    } catch (err) {
      setError('Failed to generate product copy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (productCopy) {
      const specsText = productCopy.technicalSpecs?.map(s => `${s.label}: ${s.value}`).join('\n') || '';
      const fullText = `${productCopy.productName}\n\n${productCopy.hook}\n\nBenefits:\n${productCopy.benefits.map(b => `• ${b.title}: ${b.description}`).join('\n')}\n\nSpecs:\n${specsText}\n\n${productCopy.cta}`;
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!productCopy) return;
    
    const specsText = productCopy.technicalSpecs?.map(s => `• ${s.label}: ${s.value}`).join('\n') || '';
    const shareText = `${productCopy.productName}\n\n${productCopy.hook}\n\n${productCopy.benefits.map(b => `• ${b.title}: ${b.description}`).join('\n')}\n\nTechnical Specs:\n${specsText}\n\n${productCopy.cta}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Product Description: ${productCopy.productName}`,
          text: shareText,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      const subject = encodeURIComponent(`Product Description for ${productCopy.productName}`);
      const body = encodeURIComponent(shareText);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">E-Commerce Architect</h1>
          </div>
          
          <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
            {[
              { id: 'strategy', label: 'Strategy', icon: Layers },
              { id: 'design', label: 'Design', icon: Palette },
              { id: 'copy', label: 'Copy', icon: PenTool }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveMode(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeMode === tab.id ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Intro Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {activeMode === 'strategy' && 'Architect Your Strategy'}
            {activeMode === 'design' && 'Visualize Your Brand'}
            {activeMode === 'copy' && 'Perfect Your Pitch'}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {activeMode === 'strategy' && 'Get a tailored technical and logistical blueprint for your store operations.'}
            {activeMode === 'design' && 'Create a high-conversion visual design and interactive homepage mockup.'}
            {activeMode === 'copy' && 'Generate persuasive, high-conversion product copy optimized for sales.'}
          </p>
        </section>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 mb-12 border border-slate-100">
          {activeMode === 'strategy' && (
            <form onSubmit={handleGenerateStrategy} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Selling</label>
                <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Budget</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                  <button type="button" onClick={() => setBudget('small')} className={`py-2 px-4 text-sm font-medium rounded-lg transition-all ${budget === 'small' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Small</button>
                  <button type="button" onClick={() => setBudget('large')} className={`py-2 px-4 text-sm font-medium rounded-lg transition-all ${budget === 'large' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Large</button>
                </div>
              </div>
              <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <Layers size={20} />} Generate Strategy
              </button>
            </form>
          )}

          {activeMode === 'design' && (
            <form onSubmit={handleGenerateDesign} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Business Name</label>
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Style</label>
                  <input type="text" value={style} onChange={(e) => setStyle(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Palette</label>
                  <input type="text" value={palette} onChange={(e) => setPalette(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Additional Requirements (Sections, Guides, etc.)</label>
                  <input type="text" value={requirements} onChange={(e) => setRequirements(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Include a charging speed guide..." />
                </div>
                <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" /> : <Palette size={20} />} Render Design
                </button>
              </div>
            </form>
          )}

          {activeMode === 'copy' && (
            <form onSubmit={handleGenerateCopy} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Product Name</label>
                  <input type="text" value={copyProduct} onChange={(e) => setCopyProduct(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Audience</label>
                  <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Key Features & Technical Details</label>
                  <input type="text" value={features} onChange={(e) => setFeatures(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Include technical specs here..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tone</label>
                  <input type="text" value={tone} onChange={(e) => setTone(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hook Focus / Special Instructions</label>
                  <input type="text" value={copyRequirements} onChange={(e) => setCopyRequirements(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Focus on how it replaces three chargers..." />
                </div>
                <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" /> : <PenTool size={20} />} Generate Copy
                </button>
              </div>
            </form>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Content Display */}
        {activeMode === 'strategy' && blueprint && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="border-l-4 border-indigo-600 pl-6">
              <h3 className="text-2xl font-bold text-slate-800">Growth Blueprint: {blueprint.productName}</h3>
              <p className="text-slate-500">Operationally optimized for {blueprint.budget} budget.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6"><CheckCircle2 className="text-blue-600" size={24} /><h4 className="text-xl font-bold">Must-Have Pages</h4></div>
                <div className="space-y-6">
                  {blueprint.mustHavePages.map((page, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">{idx + 1}</div>
                      <div><h5 className="font-semibold">{page.title}</h5><p className="text-sm text-slate-600">{page.description}</p></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6"><ShoppingBag className="text-purple-600" size={24} /><h4 className="text-xl font-bold">Platform Choice</h4></div>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase mb-2">{blueprint.platformAnalysis.recommendation}</span>
                  <p className="text-slate-700 italic">"{blueprint.platformAnalysis.reasoning}"</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><h6 className="text-xs font-bold text-green-600 uppercase mb-2">Pros</h6><ul className="text-sm text-slate-600 space-y-1">{blueprint.platformAnalysis.pros.map((p, i) => <li key={i}>• {p}</li>)}</ul></div>
                  <div><h6 className="text-xs font-bold text-amber-600 uppercase mb-2">Cons</h6><ul className="text-sm text-slate-600 space-y-1">{blueprint.platformAnalysis.cons.map((c, i) => <li key={i}>• {c}</li>)}</ul></div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm"><SiteMapChart data={blueprint.siteMap} /></div>
          </div>
        )}

        {activeMode === 'design' && storeDesign && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="border-l-4 border-indigo-600 pl-6 flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Visual Mockup: {storeDesign.businessName}</h3>
                <p className="text-slate-500">High-conversion layout designed for "{storeDesign.style}" vibes.</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 border rounded-lg text-xs font-mono font-bold" style={{ borderColor: storeDesign.colors.accent, color: storeDesign.colors.accent }}>{storeDesign.colors.background}</span>
                <span className="px-3 py-1 bg-slate-100 border rounded-lg text-xs font-mono font-bold" style={{ borderColor: storeDesign.colors.primary, color: storeDesign.colors.primary }}>{storeDesign.colors.primary}</span>
              </div>
            </div>
            <StorePreview design={storeDesign} />
          </div>
        )}

        {activeMode === 'copy' && productCopy && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
              <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                  <Quote size={16} /> Product Draft: {productCopy.productName}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all"
                  >
                    <Share2 size={14} />
                    Share
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      copied ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {copied ? <Check size={14} /> : <CopyIcon size={14} />}
                    {copied ? 'Copied!' : 'Copy Draft'}
                  </button>
                </div>
              </div>
              <div className="p-8 md:p-12 space-y-12">
                {/* Hook */}
                <div className="border-l-4 border-indigo-500 pl-6 py-2">
                  <h4 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-2">Catchy Hook</h4>
                  <p className="text-2xl font-bold text-slate-800 leading-tight">
                    {productCopy.hook}
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Core Benefits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {productCopy.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors">
                        <div className="w-8 h-8 flex-shrink-0 bg-white rounded-lg flex items-center justify-center shadow-sm text-indigo-600">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-800">{benefit.title}</h5>
                          <p className="text-sm text-slate-500 mt-1">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Specs Table */}
                {productCopy.technicalSpecs && productCopy.technicalSpecs.length > 0 && (
                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Cpu size={16} /> Technical Specifications
                    </h4>
                    <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-slate-50/50">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100/50">
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 w-1/2">Attribute</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 w-1/2">Detail</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {productCopy.technicalSpecs.map((spec, idx) => (
                            <tr key={idx} className="hover:bg-white transition-colors">
                              <td className="px-6 py-4 text-sm font-bold text-slate-700">{spec.label}</td>
                              <td className="px-6 py-4 text-sm text-slate-600">{spec.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Call to Action */}
                <div className="pt-8 border-t border-slate-100">
                   <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4">Final Call to Action</h4>
                   <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-center">
                     <p className="text-xl font-bold text-amber-900 mb-2">{productCopy.cta}</p>
                     <p className="text-xs text-amber-600 font-medium">Place this near your checkout or cart buttons.</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Writing Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h5 className="font-bold text-sm mb-2 flex items-center gap-2"><Globe size={16} /> Targeted Strategy</h5>
                <p className="text-xs text-slate-500">This copy is framed for {audience}.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h5 className="font-bold text-sm mb-2 flex items-center gap-2"><Quote size={16} /> Brand Voice</h5>
                <p className="text-xs text-slate-500">Maintains a "{tone}" consistency.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h5 className="font-bold text-sm mb-2 flex items-center gap-2"><Check size={16} /> SEO Friendly</h5>
                <p className="text-xs text-slate-500">Naturally integrates your key product features.</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty States */}
        {!loading && (
          ((activeMode === 'strategy' && !blueprint) || 
           (activeMode === 'design' && !storeDesign) || 
           (activeMode === 'copy' && !productCopy)) && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                {activeMode === 'strategy' ? <Layers className="text-slate-300" size={40} /> : 
                 activeMode === 'design' ? <Palette className="text-slate-300" size={40} /> :
                 <PenTool className="text-slate-300" size={40} />}
              </div>
              <h4 className="text-xl font-bold text-slate-400">Ready to build?</h4>
              <p className="text-slate-400 mt-2">Fill in the details above to generate your {activeMode} assets.</p>
            </div>
          )
        )}
      </main>

      <footer className="mt-20 border-t border-slate-200 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 E-Commerce Blueprint Architect. Powered by Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
