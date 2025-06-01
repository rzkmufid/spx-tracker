import { ModeToggle } from './mode-toggle';
import { PackageIcon, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold tracking-tight">geroo</span>
            <span className="text-xl font-extralight tracking-wider">Tracker</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              asChild
            >
              <a href="https://github.com/rzkmufid" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6 md:py-10 mx-auto max-w-5xl">
        {children}
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:h-16 items-center justify-between gap-4 md:flex-row max-w-5xl mx-auto">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} gerooTracker. All rights reserved.
          </p>
          <div className="text-sm text-muted-foreground">
            Powered by React & shadcn/ui
          </div>
        </div>
      </footer>
    </div>
  );
}