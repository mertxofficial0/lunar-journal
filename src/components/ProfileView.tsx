import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Input from "./ui/Input";

export default function ProfileView() {
  const [savedMessage, setSavedMessage] = useState(false);

    const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  // --------------------------
  // LOAD + 1s FAKE DELAY
  // --------------------------
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, username")
        .eq("id", user.id)
        .single();

      if (data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setUsername(data.username || "");
      }

      // Zarif minimal spinner → 1 saniye
      setTimeout(() => setLoading(false), 350);
    }

    load();
  }, []);

  // --------------------------
  // SAVE PROFILE
  // --------------------------
  async function save() {
  if (saving) return;

  setSaving(true);             // butonu disable yap


  // 2 saniyelik fake loading
  setTimeout(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        username,
      })
      .eq("id", user.id);

    setSaving(false);


    // 🎉 Popup aç
    setSavedMessage(true);

    setTimeout(() => setSavedMessage(false), 2200);
  }, 2000);
}



  // --------------------------
  // LOADING SCREEN — MINIMAL SPINNER
  // --------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .loading-spinner {
            width: 26px;
            height: 26px;
            border-radius: 50%;
            border: 2px solid transparent;
            border-top-color: #7c3aed;
            backdrop-filter: blur(10px);
            animation: spin 0.8s linear infinite;
            box-shadow: 0 0 12px rgba(140,120,255,0.18);
          }
        `}</style>

        <div className="loading-spinner"></div>
      </div>
    );
  }

  // --------------------------
  // MAIN UI
  // --------------------------
  return (
    <div className="flex-1 min-w-0 px-4 py-10 sm:px-6 lg:px-12">
{/* SAVE SUCCESS NOTIFICATION */}
{savedMessage && (
  <div 
    className="
      fixed top-6 right-6 z-[9999]
      px-4 py-2 rounded-xl
      text-sm font-medium
      bg-white/90 backdrop-blur-xl
      shadow-[0_8px_28px_rgba(79,70,229,0.28)]
      border border-white/60
      text-slate-700
      animate-[fadeInUp_0.35s_ease,fadeOut_0.35s_ease_1.8s_forwards]
    "
  >
     Değişiklikler kaydedildi.
  </div>
)}

      <style>{`
      @keyframes fadeOut {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-6px); }
}

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .profile-input-wrapper input {
          background: #f8f9fc !important;
          border: 1px solid rgba(226,232,240,0.9) !important;
          box-shadow:
            0 3px 10px rgba(15,23,42,0.06),
            0 0 14px rgba(150,120,255,0.07) !important;
          transition: 0.18s ease;
        }
        .profile-input-wrapper input:focus {
          background: #fff !important;
          box-shadow:
            0 4px 14px rgba(15,23,42,0.12),
            0 0 22px rgba(140,100,255,0.18) !important;
        }
      `}</style>

      <div className="animate-[fadeInUp_0.45s_ease]">

        <div className="space-y-2 mb-10">
          <span className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            PROFILE
          </span>

          <h1 className="text-3xl font-semibold text-slate-900">
            Profile Settings
          </h1>

          <p className="text-sm text-slate-500 max-w-xl">
            Dashboard deneyimini kişiselleştirmek için adını ve kullanıcı adını güncelle.
          </p>
        </div>

        <div
          className="
            glass-card rounded-3xl p-8 sm:p-10 max-w-4xl
            bg-white/92 border border-white/70 backdrop-blur-xl
            shadow-[0_18px_45px_rgba(15,23,42,0.10)]
            bg-[radial-gradient(circle_at_85%_120%,rgba(233,215,255,0.20),transparent_65%),
                radial-gradient(circle_at_15%_-10%,rgba(255,227,241,0.20),transparent_60%)]
          "
        >

          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-800">Genel Bilgiler</h2>
            <p className="text-xs text-slate-500 mt-1">Dashboard selamlamasında gözükecek bilgiler.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 profile-input-wrapper">
            <Input label="First Name" value={firstName} onChange={setFirstName} />
            <Input label="Last Name" value={lastName} onChange={setLastName} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start mb-8 profile-input-wrapper">
            <Input label="Username" value={username} onChange={setUsername} />
            <p className="text-[11px] text-slate-500 pt-2">
              Bu kullanıcı adı ileride public profilinde görüntülenebilir.
            </p>
          </div>

          <div className="flex justify-end">
            <button
  onClick={save}
  disabled={saving}
  className="
    px-7 py-2.5 rounded-full text-sm font-medium
    bg-gradient-to-r from-indigo-500 to-violet-500
    text-white
    shadow-[0_18px_40px_rgba(79,70,229,0.45)]
    hover:shadow-[0_20px_50px_rgba(79,70,229,0.6)]
    active:scale-[0.97] transition
    disabled:opacity-60 disabled:cursor-not-allowed
    flex items-center gap-2
  "
>
  {/* LEFT: Text */}
  {saving ? "Saving" : "Save Changes"}

  {/* RIGHT: Spinner (saving ise göster) */}
  {saving && (
    <div
      className="
        w-4 h-4 
        border-[3px] border-white/40 border-t-white
        rounded-full animate-spin
      "
    />
  )}
</button>


          </div>

        </div>

      </div>
    </div>
  );
}
