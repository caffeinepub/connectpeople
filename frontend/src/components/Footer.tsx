export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'tribes-of-rudra');

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Top section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/tribes-rudra-emblem.dim_256x256.png"
              alt="Tribes Of Rudra"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30"
            />
            <div>
              <p className="font-display font-bold text-primary text-sm tracking-wide">Tribes Of Rudra</p>
              <p className="text-xs text-muted-foreground tracking-widest uppercase">ॐ नमः शिवाय</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center sm:text-right max-w-xs">
            A global spiritual family devoted to Lord Shiva — connecting seekers across the world.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-4" />

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {year} Tribes Of Rudra. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with{' '}
            <span className="text-primary" aria-label="love">
              🔱
            </span>{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
