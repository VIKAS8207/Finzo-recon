import LargeButton from './components/LargeButton.jsx'
import Logo from './components/Logo.jsx'

const navLinks =['Features', 'How it works', 'Mission']

export default function Login({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-8"
      style={{
        backgroundColor: '#e5e5e5',
        backgroundImage: [
          'linear-gradient(to right, rgba(0,0,0,0.07) 1px, transparent 1px)',
          'linear-gradient(to bottom, rgba(0,0,0,0.07) 1px, transparent 1px)',
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.25), transparent 70%)',
          'linear-gradient(135deg, #f5f5f5 0%, #d4d4d4 100%)',
        ].join(','),
        backgroundSize: '40px 40px, 40px 40px, 100% 100%, 100% 100%',
      }}
    >
      <div className="bg-white rounded-[5px] shadow-xl w-full max-w-6xl p-3 grid lg:grid-cols-2 gap-3">
        {/* Left hero panel */}
        <section className="relative overflow-hidden rounded-[5px] text-white min-h-[28rem] lg:min-h-[34rem] flex flex-col justify-between p-6 bg-[#0b0b0d]">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 55% at 65% 75%, #1f78c1 0%, #14477a 35%, rgba(11,11,13,0) 75%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            }}
          />

          <header className="relative flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <Logo /> Finzo Recon
            </div>
            <nav className="hidden sm:flex gap-5 text-xs text-white/90">
              {navLinks.map((l) => (
                <a key={l} href="#" className="hover:text-white">
                  {l}
                </a>
              ))}
            </nav>
          </header>

          <div className="relative space-y-4">
            <h2 className="text-4xl sm:text-5xl font-medium leading-[1.05] tracking-tight">
              Your reconciliation,
              <br />
              always accurate
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-sm">
              Finzo Recon keeps every ledger, bank feed and transaction matched in one place.
              Never lose track of a payment again.
            </p>
          </div>
        </section>

        {/* Right form panel */}
        <section className="flex items-center justify-center p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
            <Logo className="w-7 h-7 text-neutral-900" />
            <h1 className="text-3xl font-semibold text-neutral-900">Get Beta Access</h1>

            <label className="block space-y-1.5">
              <span className="text-xs text-neutral-800">Your Name</span>
              <input
                type="text"
                placeholder="Ameer Ismail"
                className="w-full rounded-[5px] bg-neutral-100 px-3 py-2.5 text-xs placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-neutral-300"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs text-neutral-800">Your Email</span>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-[5px] bg-neutral-100 px-3 py-2.5 text-xs placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-neutral-300"
              />
            </label>

            <LargeButton type="submit">Get Started</LargeButton>
          </form>
        </section>
      </div>
    </div>
  )
}
