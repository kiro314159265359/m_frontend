import { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-sm ${className}`}>{children}</table>
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
}

export function TableHead({ children }: TableHeaderProps) {
  return (
    <thead className="bg-gray-50/80 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
      {children}
    </thead>
  );
}

export function TableBody({ children }: TableHeaderProps) {
  return <tbody className="divide-y divide-gray-100">{children}</tbody>;
}

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
}

export function TableRow({ children, onClick, hoverable = true }: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={`${hoverable ? "hover:bg-gray-50/60 transition-colors" : ""} ${onClick ? "cursor-pointer" : ""}`}
    >
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export function TableCell({ children, className = "", align = "left" }: TableCellProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  return (
    <td className={`px-6 py-3.5 text-gray-700 ${alignClass} ${className}`}>
      {children}
    </td>
  );
}

export function TableHeaderCell({ children, className = "", align = "left" }: TableCellProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  return (
    <th className={`px-6 py-3 font-semibold text-gray-700 ${alignClass} ${className}`}>
      {children}
    </th>
  );
}
