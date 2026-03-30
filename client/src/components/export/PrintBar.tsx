import { Printer } from "lucide-react";

export function PrintBar() {
  return (
    <div className="no-print print-bar mt-11">
      <div className="print-bar-inner">
        <div>
          <p className="print-bar-title">PAYM · Transaction Status Workflow — Full Report</p>
          <p className="print-bar-sub">Research findings · Customer feedback · Design requirements · Annotated specs</p>
        </div>
        <button onClick={() => window.print()} className="print-btn">
          <Printer className="w-4 h-4" /> Export PDF
        </button>
      </div>
    </div>
  );
}
