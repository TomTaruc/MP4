import { useEffect, useState } from 'react';
import { Plus, Edit2, X, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ZodiacSign } from '../../types';

export default function ManageSignsPage() {
  const [signs, setSigns] = useState<ZodiacSign[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ZodiacSign | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  async function load() {
    const { data } = await supabase.from('zodiac_signs').select('*').order('id');
    setSigns(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setSaveMsg('');
    const { error } = await supabase.from('zodiac_signs').update({
      sign_name: editing.sign_name,
      symbol: editing.symbol,
      date_range: editing.date_range,
      element: editing.element,
      ruling_planet: editing.ruling_planet,
      traits: editing.traits,
      compatibility: editing.compatibility,
      color_hex: editing.color_hex,
      description: editing.description,
      daily_horoscope: editing.daily_horoscope,
      monthly_horoscope: editing.monthly_horoscope,
    }).eq('id', editing.id);
    setSaving(false);
    if (!error) {
      setSaveMsg('Saved successfully!');
      await load();
      setTimeout(() => { setSaveMsg(''); setEditing(null); }, 1500);
    }
  }

  const inputClass = "w-full px-3 py-2 rounded-lg text-white placeholder-slate-500 outline-none text-sm";
  const inputStyle = { background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(0,191,255,0.2)' };

  if (loading) return <div className="p-8 text-slate-300">Loading zodiac signs...</div>;

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>Manage Zodiac Signs</h1>
          <p className="text-slate-400 text-sm">Edit horoscope content for all 12 signs</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
          {signs.length} signs
        </div>
      </div>

      {/* Signs list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {signs.map(sign => (
          <div key={sign.id} className="rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${sign.color_hex}15, rgba(10,22,40,0.8))`,
              border: `1px solid ${sign.color_hex}33`,
            }}
            onClick={() => setEditing({ ...sign })}>
            <span className="text-2xl">{sign.symbol}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">{sign.sign_name}</p>
              <p className="text-slate-400 text-xs truncate">{sign.date_range}</p>
            </div>
            <Edit2 size={14} style={{ color: sign.color_hex }} />
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #0A1628, #1A2744)', border: '1px solid rgba(0,191,255,0.2)' }}>
            <div className="sticky top-0 px-6 py-4 border-b border-blue-900/30 flex items-center justify-between"
              style={{ background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(8px)' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{editing.symbol}</span>
                <h2 className="text-white font-bold" style={{ fontFamily: 'Cinzel, serif' }}>Edit {editing.sign_name}</h2>
              </div>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveEdit} className="p-6 space-y-4">
              {saveMsg && (
                <div className="p-3 rounded-lg text-green-300 text-sm" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
                  {saveMsg}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 text-xs mb-1.5">Date Range</label>
                  <input value={editing.date_range} onChange={e => setEditing({ ...editing, date_range: e.target.value })}
                    className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs mb-1.5">Element</label>
                  <select value={editing.element} onChange={e => setEditing({ ...editing, element: e.target.value })}
                    className={inputClass} style={{ ...inputStyle, WebkitAppearance: 'none' }}>
                    <option>Fire</option><option>Earth</option><option>Air</option><option>Water</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-xs mb-1.5">Ruling Planet</label>
                  <input value={editing.ruling_planet} onChange={e => setEditing({ ...editing, ruling_planet: e.target.value })}
                    className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs mb-1.5">Accent Color (hex)</label>
                  <div className="flex gap-2">
                    <input type="color" value={editing.color_hex} onChange={e => setEditing({ ...editing, color_hex: e.target.value })}
                      className="w-10 h-9 rounded cursor-pointer bg-transparent border-0 p-0" />
                    <input value={editing.color_hex} onChange={e => setEditing({ ...editing, color_hex: e.target.value })}
                      className={`${inputClass} flex-1`} style={inputStyle} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-slate-300 text-xs mb-1.5">Traits (comma-separated)</label>
                <input value={editing.traits} onChange={e => setEditing({ ...editing, traits: e.target.value })}
                  className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-slate-300 text-xs mb-1.5">Compatibility (comma-separated)</label>
                <input value={editing.compatibility} onChange={e => setEditing({ ...editing, compatibility: e.target.value })}
                  className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-slate-300 text-xs mb-1.5">Description</label>
                <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })}
                  rows={4} className={`${inputClass} resize-none`} style={inputStyle} />
              </div>
              <div>
                <label className="block text-slate-300 text-xs mb-1.5">Daily Horoscope</label>
                <textarea value={editing.daily_horoscope} onChange={e => setEditing({ ...editing, daily_horoscope: e.target.value })}
                  rows={4} className={`${inputClass} resize-none`} style={inputStyle} />
              </div>
              <div>
                <label className="block text-slate-300 text-xs mb-1.5">Monthly Horoscope</label>
                <textarea value={editing.monthly_horoscope} onChange={e => setEditing({ ...editing, monthly_horoscope: e.target.value })}
                  rows={4} className={`${inputClass} resize-none`} style={inputStyle} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:scale-105 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #0A4D8C, #00BFFF33)', border: '1px solid rgba(0,191,255,0.4)' }}>
                  <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditing(null)}
                  className="px-6 py-2.5 rounded-xl text-slate-400 text-sm hover:text-white transition-colors"
                  style={{ border: '1px solid rgba(100,100,100,0.3)' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
