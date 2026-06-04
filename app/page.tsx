import { CalculatorApp } from "@/components/CalculatorApp";

export default function Home() {
return ( <div className="min-h-screen"> <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md"> <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 sm:px-6 lg:px-8 lg:py-10"> <div className="flex items-center gap-4"> <img
           src="/logo.svg"
           alt="Little Harvard"
           className="h-40 w-auto"
         />

```
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
            Little Harvard Childcare
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Childcare Fee Estimator
          </h1>
        </div>
      </div>

      <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
        Estimate your childcare fees after ECCE and NCS funding.
        Add each child attending Little Harvard to see a full
        monthly breakdown of fees, funding and parent contributions.
      </p>
    </div>
  </header>

  <main>
    <CalculatorApp />
  </main>

  <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
    ECCE and NCS funding amounts shown are estimates only and may vary
    depending on eligibility, approved funding rates and attendance
    patterns.
  </footer>
</div>
);
}