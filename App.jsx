import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Search, Plus, FileText, Folder, Users, Settings, LogOut } from 'lucide-react';

function App() {
  const [docs, setDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setDocs(data);
      setLoading(false);
    };
    fetchDocuments();
  }, []);

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    // OUTER WRAPPER: PURE WHITE BACKGROUND
    <div className="h-screen w-screen bg-white flex items-center justify-center overflow-hidden m-0 p-0">
      
      {/* MAIN CONTAINER: Subtle shadow defines the 'Mirror' edge against the white background */}
      <div className="w-full h-full md:w-[98vw] md:h-[94vh] flex flex-col md:flex-row bg-[#fdfdfd] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 md:rounded-[2.5rem] overflow-hidden">
        
        {/* SIDEBAR: 20% BLACK (Charcoal) - Deep contrast against the white main area */}
        <aside className="w-full md:w-80 flex-shrink-0 bg-[#121212] p-8 flex flex-col z-20">
          <div className="flex items-center gap-4 mb-12 px-2">
            {/* 10% BLUE ACCENT */}
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Folder className="text-white" size={28} />
            </div>
            <div className="min-w-0">
              <h1 className="text-white text-2xl font-black tracking-tight leading-none">MuniRecords</h1>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1 font-bold">LGU Dashboard</p>
            </div>
          </div>
          
          <nav className="flex-1 space-y-2">
            <NavItem icon={<FileText size={20}/>} label="Documents" active />
            <NavItem icon={<Users size={20}/>} label="Offices" />
            <NavItem icon={<Settings size={20}/>} label="Settings" />
          </nav>

          <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0"></div>
              <div className="flex-1 overflow-hidden">
                <p className="text-white text-sm font-bold truncate">Admin Staff</p>
                <p className="text-gray-500 text-[10px] truncate">Records Division</p>
              </div>
              <LogOut className="text-gray-500 hover:text-white cursor-pointer transition flex-shrink-0" size={18} />
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA: 70% WHITE (Clean & Bright) */}
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden bg-white relative">
          
          <header className="p-10 pb-6">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
              <div className="min-w-0">
                <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Municipal Records</h2>
                <p className="text-gray-400 text-lg mt-1 font-medium italic">Secure Document Management</p>
              </div>
              
              <div className="flex items-center gap-4 w-full xl:w-auto">
                <div className="relative flex-1 md:w-80 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition" size={20} />
                  <input 
                    type="text"
                    placeholder="Search records..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-6 text-gray-900 placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* 10% BLUE ACCENT */}
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold transition flex items-center gap-2 shadow-xl shadow-blue-600/20 active:scale-95 whitespace-nowrap">
                  <Plus size={22} />
                  <span>New Record</span>
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-10 overflow-x-auto no-scrollbar pb-2">
              {["All", "Permit", "Report", "Legal", "Financial"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                    selectedCategory === cat 
                    ? "bg-[#121212] text-white border-[#121212] shadow-lg" 
                    : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </header>

          <div className="flex-1 px-10 pb-10 overflow-y-auto">
            {/* TABLE CONTAINER: Uses a faint border to stay visible on white background */}
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-widest font-black">
                  <tr>
                    <th className="p-6">Document Name</th>
                    <th className="p-6">Category</th>
                    <th className="p-6">Status</th>
                    <th className="p-6 text-right">Upload Date</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan="4" className="p-20 text-center animate-pulse font-bold text-gray-300">Synchronizing Database...</td></tr>
                  ) : filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50/50 transition-all cursor-pointer group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          {/* 10% BLUE ACCENT */}
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <FileText size={20} />
                          </div>
                          <span className="font-semibold text-gray-800">{doc.title}</span>
                        </div>
                      </td>
                      <td className="p-6 text-sm text-gray-400 italic">{doc.category}</td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${doc.is_archived ? 'bg-gray-300' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]'}`}></div>
                          <span className="text-sm font-medium">{doc.is_archived ? 'Archived' : 'Active'}</span>
                        </div>
                      </td>
                      <td className="p-6 text-right text-gray-300 text-sm font-mono">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all ${
      active 
      ? "bg-white text-[#121212] shadow-xl" 
      : "text-gray-500 hover:bg-white/5 hover:text-white"
    }`}>
      {icon}
      <span className="text-base font-bold">{label}</span>
    </div>
  );
}

export default App;