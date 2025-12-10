import { useEffect, useState } from "react";

export default function SplashScreen({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExit(true);

      // çıkış animasyonu bittikten sonra login ekranını göster
      setTimeout(() => {
        onFinish();
      }, 550);
    }, 6000); // 6 saniye splash

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50
      "
    >
      {/* SPLASH CARD */}
      <div
        className={`
          glass-card w-[360px] py-10 px-6 text-center
          ${exit ? "splash-card-exit" : "splash-card-enter"}
        `}
      >
        {/* LUNAR başlık */}
        <h1 className="text-[40px] font-semibold tracking-[0.20em] text-slate-900">
          LUNAR
        </h1>

        {/* Alt açıklama */}
        <p className="mt-2 text-[13px] text-slate-500 tracking-wide">
          Trading alanın hazırlanıyor...
        </p>

        {/* Spinner */}
        <div className="mt-6 flex justify-center">
          <div className="splash-spinner" />
        </div>
      </div>
    </div>
  );
}
