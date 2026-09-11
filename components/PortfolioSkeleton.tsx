export function PortfolioSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-24 rounded-lg border border-slate-800 bg-slate-900"
                    />
                ))}
            </div>
            <div className="h-64 rounded-lg border border-slate-800 bg-slate-900" />
            <div className="h-96 rounded-lg border border-slate-800 bg-slate-900" />
        </div>
    );
}
