import * as React from "react"
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'O Problema', href: '#education' },
    { name: 'O Processo', href: '#process' },
    { name: 'Showcase', href: '#showcase' },
    { name: 'Planos', href: '/planos' },
]

export const HeroJourney = () => {
    const [menuState, setMenuState] = React.useState(false)

    // Scroll to section handler
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id.replace('#', ''));
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMenuState(false);
        }
    };

    return (
        <div className="relative overflow-hidden w-full bg-[#010816]">
            <header className="absolute top-0 w-full z-50">
                <nav
                    data-state={menuState && 'active'}
                    className="group w-full border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="flex flex-wrap items-center justify-between py-4">

                            {/* Logo */}
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/"
                                    aria-label="home"
                                    className="flex items-center space-x-2">
                                    <Logo />
                                </Link>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                                className="relative z-50 ml-auto block cursor-pointer p-2 lg:hidden text-white">
                                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            {/* Desktop & Mobile Menu */}
                            <div className="
                                fixed inset-0 z-40 bg-slate-950 flex flex-col items-center justify-center space-y-8
                                lg:static lg:bg-transparent lg:flex-row lg:space-y-0 lg:justify-end lg:flex
                                transition-all duration-300 ease-in-out
                                w-full lg:w-auto
                                origin-top
                                group-data-[state=active]:scale-y-100 group-data-[state=active]:opacity-100
                                lg:scale-y-100 lg:opacity-100
                                scale-y-0 opacity-0 lg:transform-none
                            ">
                                <ul className="flex flex-col lg:flex-row gap-6 text-center lg:text-left">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            {item.href.startsWith('#') ? (
                                                <button
                                                    onClick={() => scrollToSection(item.href)}
                                                    className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                                                    {item.name}
                                                </button>
                                            ) : (
                                                <Link
                                                    to={item.href}
                                                    className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                                                    {item.name}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-col lg:flex-row gap-4 lg:ml-8 items-center">
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="sm"
                                        className="text-slate-300 hover:text-white hover:bg-white/10">
                                        <Link to="/auth">
                                            Login
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="bg-violet-600 hover:bg-violet-700 text-white border-0">
                                        <Link to="/planos">
                                            Começar Agora
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm"
                                        variant="outline"
                                        className="border-violet-500/50 text-violet-300 hover:bg-violet-500/10 hover:text-violet-200">
                                        <Link to="/contato">
                                            Fale Conosco
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
                {/* Background Effects (Deep Space) */}
                <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none isolate opacity-60 lg:opacity-40">
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[80rem] h-[60rem] bg-violet-900/20 blur-[120px] rounded-full mix-blend-screen" />
                    <div className="absolute right-0 top-0 w-[40rem] h-[40rem] bg-indigo-900/10 blur-[100px] rounded-full mix-blend-screen" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
                </div>

                <div className="relative px-6 mx-auto max-w-7xl">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                            </span>
                            Ecossistema de Inteligência Organizacional
                        </div>

                        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl lg:text-7xl mb-8">
                            Sua Visão merece <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                                Clareza e Direção
                            </span>
                        </h1>
                        <p className="mx-auto my-8 max-w-2xl text-lg text-slate-400 leading-relaxed">
                            O primeiro <strong>Ecossistema de Inteligência Organizacional</strong> que transforma dados em insights e estratégia em execução.
                            Pare de decidir no escuro.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-200 text-base h-12 px-8 font-semibold">
                                <Link to="/planos">
                                    Quero assumir o controle
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-12 px-8">
                                <button onClick={() => scrollToSection('#education')}>
                                    Entender a Lógica
                                </button>
                            </Button>
                        </div>
                    </div>

                    {/* 3D Dashboard Mockup */}
                    <div className="mt-20 relative mx-auto max-w-6xl">
                        {/* Fade overlay for better integration */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#010816] via-transparent to-transparent z-10 h-full bottom-0" />

                        <div className="relative [perspective:2000px]">
                            <div className="relative transform [transform:rotateX(20deg)_scale(0.9)] transition-transform duration-700 hover:[transform:rotateX(10deg)_scale(0.95)]">
                                <div className="p-2 bg-slate-900/50 rounded-xl border border-white/10 shadow-2xl backdrop-blur-sm ring-1 ring-white/10">
                                    <img
                                        className="rounded-lg shadow-[0_0_50px_-12px_rgba(124,58,237,0.25)] w-full object-cover"
                                        src="/dashboard-lumia.png"
                                        alt="LUMIA Dashboard Interface"
                                    />
                                </div>

                                {/* Glow Effect behind the dashboard */}
                                <div className="absolute -inset-4 bg-violet-600/20 blur-3xl -z-10 rounded-[2rem]" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <img
                src="/src/assets/lumia-logo.png"
                alt="LUMIA Logo"
                className="h-14 w-auto object-contain"
                onError={(e) => {
                    // Fallback to the dist asset path if src fails (though src is preferred in dev)
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('lumia-logo-DzeK1RzK.png')) {
                        target.src = '/assets/lumia-logo-DzeK1RzK.png';
                    }
                }}
            />
        </div>
    )
}
