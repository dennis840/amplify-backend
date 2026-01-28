import { Music, User, Mail, Lock } from "lucide-react";

export default function Login() {
  return (
    <div className="w-full max-w-[420px] px-6 py-8 bg-[#0E1323] rounded-2xl shadow-lg">

      {/* LOGO */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] flex items-center justify-center shadow-md">
          <Music className="text-white w-8 h-8" />
        </div>
      </div>

      {/* TITULOS */}
      <h1 className="text-center text-[28px] font-semibold text-white mb-2">
        Crear cuenta
      </h1>
      <p className="text-center text-gray-400 mb-8 text-sm">
        Únete a la comunidad de músicos
      </p>

      {/* FORM */}
      <form className="space-y-4">

        {[
          { label: "Nombre", icon: User, type: "text", placeholder: "Tu nombre artístico" },
          { label: "Email", icon: Mail, type: "email", placeholder: "tu@email.com" },
          { label: "Contraseña", icon: Lock, type: "password", placeholder: "Mínimo 8 caracteres" },
          { label: "Confirmar contraseña", icon: Lock, type: "password", placeholder: "Confirma tu contraseña" },
        ].map(({ label, icon: Icon, ...input }, i) => (
          <div key={i}>
            <label className="block text-sm text-gray-300 mb-2">{label}</label>
            <div className="relative">
              <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                {...input}
                className="h-12 w-full pl-12 pr-4 rounded-xl bg-[#1A1F35] text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>
          </div>
        ))}

        {/* TERMINOS */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
          <input type="checkbox" className="accent-purple-500 w-4 h-4" />
          <span>Acepto los términos y condiciones</span>
        </div>

        {/* BOTON */}
        <button
          type="submit"
          className="mt-6 h-12 w-full rounded-xl text-white font-medium bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] hover:opacity-90 transition"
        >
          Registrarme
        </button>
      </form>

      {/* FOOTER */}
      <p className="text-center text-gray-400 text-sm mt-6">
        ¿Ya tienes cuenta?{" "}
        <span className="text-purple-400 hover:underline cursor-pointer">
          Inicia sesión
        </span>
      </p>
    </div>
  );
}