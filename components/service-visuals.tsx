import { Check } from "lucide-react";

/*
 * The three animated service illustrations from erungroup.ca
 * (src/components/service-visuals.tsx), reused so the Lab's product grid
 * matches the website's "What We Do" section.
 */

export function AnalyticsVisual({ label = "ANALYSIS / LIVE" }: { label?: string }) {
  return (
    <div className="service-visual analytics-visual" aria-hidden="true">
      <div className="visual-topline">
        <span>{label}</span>
        <span className="live-dot" />
      </div>
      <svg viewBox="0 0 340 190">
        <defs>
          <pattern id="chart-grid" width="56" height="40" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 40" className="chart-grid" />
          </pattern>
        </defs>
        <rect width="340" height="190" fill="url(#chart-grid)" />
        <path className="chart-secondary" d="M0 160 L40 145 L80 153 L120 120 L160 133 L200 85 L240 97 L280 55 L340 65" />
        <path className="chart-primary" d="M0 173 C35 174 40 130 70 138 S110 115 135 118 S175 73 202 82 S245 40 269 50 S300 20 340 15" />
        <circle className="chart-point" cx="269" cy="50" r="5" />
      </svg>
      <div className="visual-bottomline">
        <span>COLLECT</span>
        <span>CONNECT</span>
        <span className="text-primary">CLARIFY ↗</span>
      </div>
    </div>
  );
}

export function WorkflowVisual({ label = "WORKFLOW / CONNECTED" }: { label?: string }) {
  return (
    <div className="service-visual workflow-visual" aria-hidden="true">
      <div className="visual-topline">
        <span>{label}</span>
        <span className="live-dot" />
      </div>
      <div className="workflow-system">
        <div className="workflow-node">
          <span className="node-lines" />
        </div>
        <div className="flow-track">
          <i />
        </div>
        <div className="workflow-node main-node">
          <span className="process-symbol">↻</span>
        </div>
        <div className="flow-track">
          <i />
        </div>
        <div className="workflow-node complete-node">
          <Check size={24} />
        </div>
      </div>
      <div className="visual-bottomline">
        <span>INPUT</span>
        <span>PROCESS</span>
        <span className="text-primary">COMPLETE ↗</span>
      </div>
    </div>
  );
}

export function AIVisual({ label = "INTELLIGENCE / APPLIED" }: { label?: string }) {
  return (
    <div className="service-visual ai-visual" aria-hidden="true">
      <div className="visual-topline">
        <span>{label}</span>
        <span className="live-dot" />
      </div>
      <div className="intelligence-system">
        <div className="input-stack">
          <span />
          <span />
          <span />
        </div>
        <div className="intelligence-lines" />
        <div className="intelligence-core">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="intelligence-lines" />
        <div className="output-sheet">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="visual-bottomline">
        <span>KNOWLEDGE</span>
        <span>REASONING</span>
        <span className="text-primary">ANSWER ↗</span>
      </div>
    </div>
  );
}
