import Link from 'next/link';
import { Flame, Shield, Target, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Lease Terminator</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Recupera tu depósito.
            <br />
            <span className="text-orange-500">Aplica presión legal.</span>
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Sistema de gestión legal para arrendatarios en CDMX. Organiza tus acciones legales,
            rastrea comunicaciones y maximiza la presión sobre arrendadores incumplidos.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Comenzar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Tu arsenal legal completo
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Tácticas de Presión</h3>
              <p className="text-slate-400">
                Arsenal completo de quejas SAT, PROSOC, cartas certificadas y más.
                Cada táctica con instrucciones paso a paso.
              </p>
            </div>
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Seguimiento de Acciones</h3>
              <p className="text-slate-400">
                Rastrea cada queja, comunicación y documento. Nunca pierdas de vista
                el estatus de tus procedimientos legales.
              </p>
            </div>
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Indicador de Presión</h3>
              <p className="text-slate-400">
                Visualiza el nivel de presión que estás aplicando. Identifica
                oportunidades para escalar las acciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            No dejes que se salgan con la suya
          </h2>
          <p className="text-xl text-slate-400 mb-8 max-w-xl mx-auto">
            Cada día que pasa sin actuar es un día más que el arrendador retiene tu dinero.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4">
        <div className="container mx-auto text-center text-slate-400">
          <p>© 2024 Lease Terminator. Todos los derechos reservados.</p>
          <p className="text-sm mt-2">
            Herramienta para uso informativo. Consulte con un abogado para asesoría legal específica.
          </p>
        </div>
      </footer>
    </div>
  );
}
