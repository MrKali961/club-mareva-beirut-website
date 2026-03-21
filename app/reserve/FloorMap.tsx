"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Users } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────

interface TableData {
  id: string;
  name: string;
  capacity: number;
  label: string | null;
  available: boolean;
}

interface FloorMapProps {
  tables: TableData[];
  selectedTableId: string;
  onSelect: (tableId: string, capacity: number) => void;
}

// ─── Table Position Config ───────────────────────────────────────
// Tables are mapped to these fixed positions by their array index.
// The API returns tables ordered by `displayOrder` (ascending),
// so index 0 = lowest displayOrder = position 0 on the map, etc.
// If the admin reorders tables in the dashboard, the visual
// positions on the map shift accordingly.

interface TablePosition {
  x: number;
  y: number;
  type: "round" | "rect";
  width?: number;
  height?: number;
  radius?: number;
}

const TABLE_POSITIONS: TablePosition[] = [
  { x: 130, y: 290, type: "round", radius: 28 },
  { x: 330, y: 230, type: "rect", width: 72, height: 42 },
  { x: 480, y: 155, type: "rect", width: 72, height: 42 },
  { x: 620, y: 350, type: "rect", width: 72, height: 42 },
  { x: 340, y: 390, type: "rect", width: 72, height: 42 },
];

const CHAIR_RADIUS = 8;
const CHAIR_GAP = 6;

// ─── Text Truncation ────────────────────────────────────────────

function truncateLabel(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + "\u2026";
}

// ─── Static Floor Elements ──────────────────────────────────────

function FloorBackground() {
  return (
    <>
      <rect
        x="0"
        y="0"
        width="800"
        height="520"
        rx="6"
        fill="#111111"
        stroke="rgba(201,162,39,0.15)"
        strokeWidth="2"
      />
      <defs>
        <pattern
          id="floorPattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="40"
            stroke="rgba(201,162,39,0.03)"
            strokeWidth="1"
          />
        </pattern>
        {/* Glow filter for selected table - hoisted to SVG root defs */}
        <filter
          id="table-glow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect
        x="1"
        y="1"
        width="798"
        height="518"
        rx="5"
        fill="url(#floorPattern)"
      />
    </>
  );
}

function Furniture() {
  return (
    <>
      {/* Green accent wall (top-left) */}
      <rect
        x="10"
        y="10"
        width="200"
        height="8"
        rx="2"
        fill="#27533e"
        opacity="0.6"
      />

      {/* Bar counter */}
      <g opacity="0.4">
        <rect
          x="50"
          y="50"
          width="120"
          height="70"
          rx="4"
          fill="none"
          stroke="rgba(245,245,240,0.2)"
          strokeWidth="1.5"
          strokeDasharray="6 3"
        />
        <text
          x="110"
          y="90"
          textAnchor="middle"
          fill="rgba(245,245,240,0.25)"
          fontSize="11"
          fontFamily="'Playfair Display', serif"
          letterSpacing="0.1em"
        >
          BAR
        </text>
      </g>

      {/* Staircase */}
      <g opacity="0.35">
        <rect
          x="280"
          y="38"
          width="140"
          height="50"
          rx="3"
          fill="none"
          stroke="rgba(245,245,240,0.18)"
          strokeWidth="1.5"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`stair-${i}`}
            x1={295 + i * 25}
            y1="45"
            x2={295 + i * 25}
            y2="81"
            stroke="rgba(245,245,240,0.1)"
            strokeWidth="1"
          />
        ))}
        <text
          x="350"
          y="68"
          textAnchor="middle"
          fill="rgba(245,245,240,0.2)"
          fontSize="9"
          fontFamily="'Playfair Display', serif"
          letterSpacing="0.15em"
        >
          STAIRS
        </text>
      </g>

      {/* Bookshelf / Library */}
      <g opacity="0.35">
        <rect
          x="570"
          y="38"
          width="180"
          height="50"
          rx="3"
          fill="rgba(139,90,43,0.08)"
          stroke="rgba(139,90,43,0.2)"
          strokeWidth="1.5"
        />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={`book-${i}`}
            x={582 + i * 26}
            y="48"
            width="18"
            height="30"
            rx="1"
            fill={`rgba(139,90,43,${0.08 + i * 0.02})`}
            stroke="rgba(139,90,43,0.15)"
            strokeWidth="0.5"
          />
        ))}
        <text
          x="660"
          y="88"
          textAnchor="middle"
          fill="rgba(245,245,240,0.18)"
          fontSize="9"
          fontFamily="'Playfair Display', serif"
          letterSpacing="0.15em"
        >
          LIBRARY
        </text>
      </g>

      {/* Lounge / DJ Booth */}
      <g opacity="0.35">
        <rect
          x="650"
          y="215"
          width="70"
          height="55"
          rx="4"
          fill="rgba(201,162,39,0.04)"
          stroke="rgba(201,162,39,0.15)"
          strokeWidth="1"
        />
        <text
          x="685"
          y="248"
          textAnchor="middle"
          fill="rgba(201,162,39,0.25)"
          fontSize="9"
          fontFamily="'Playfair Display', serif"
          letterSpacing="0.1em"
        >
          LOUNGE
        </text>
      </g>

      {/* Entrance */}
      <g>
        <line
          x1="300"
          y1="518"
          x2="300"
          y2="490"
          stroke="rgba(201,162,39,0.3)"
          strokeWidth="1.5"
        />
        <line
          x1="500"
          y1="518"
          x2="500"
          y2="490"
          stroke="rgba(201,162,39,0.3)"
          strokeWidth="1.5"
        />
        <text
          x="400"
          y="510"
          textAnchor="middle"
          fill="rgba(201,162,39,0.35)"
          fontSize="10"
          fontFamily="'Playfair Display', serif"
          letterSpacing="0.2em"
        >
          ENTRANCE
        </text>
      </g>

      {/* Plants */}
      <g opacity="0.5">
        <circle
          cx="85"
          cy="385"
          r="10"
          fill="rgba(39,83,62,0.3)"
          stroke="rgba(39,83,62,0.4)"
          strokeWidth="1"
        />
        <circle cx="85" cy="385" r="5" fill="rgba(39,83,62,0.5)" />
      </g>
      <g opacity="0.5">
        <circle
          cx="710"
          cy="425"
          r="10"
          fill="rgba(39,83,62,0.3)"
          stroke="rgba(39,83,62,0.4)"
          strokeWidth="1"
        />
        <circle cx="710" cy="425" r="5" fill="rgba(39,83,62,0.5)" />
      </g>
      <g opacity="0.4">
        <circle
          cx="220"
          cy="445"
          r="8"
          fill="rgba(39,83,62,0.25)"
          stroke="rgba(39,83,62,0.35)"
          strokeWidth="1"
        />
        <circle cx="220" cy="445" r="4" fill="rgba(39,83,62,0.45)" />
      </g>
    </>
  );
}

// ─── Interactive Table Element ──────────────────────────────────

function TableElement({
  table,
  position,
  isSelected,
  onSelect,
}: {
  table: TableData;
  position: TablePosition;
  isSelected: boolean;
  onSelect: (tableId: string, capacity: number) => void;
}) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const { x, y, type } = position;
  const isAvailable = table.available;

  const colors = getTableColors(isAvailable, isSelected, isHighlighted);
  const chairs = getChairPositions(position);
  const displayName = truncateLabel(table.name, 10);

  return (
    <g
      className={isAvailable ? "cursor-pointer" : "cursor-not-allowed"}
      onClick={() => isAvailable && onSelect(table.id, table.capacity)}
      onMouseEnter={() => setIsHighlighted(true)}
      onMouseLeave={() => setIsHighlighted(false)}
      onFocus={() => setIsHighlighted(true)}
      onBlur={() => setIsHighlighted(false)}
      role="button"
      aria-label={`${table.name}${table.label ? ` - ${table.label}` : ""}, ${table.capacity} seats${!isAvailable ? ", reserved" : isSelected ? ", selected" : ""}`}
      tabIndex={isAvailable ? 0 : -1}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && isAvailable) {
          e.preventDefault();
          onSelect(table.id, table.capacity);
        }
      }}
    >
      {/* Invisible hit area for touch accessibility (min ~48x48 real px) */}
      {type === "round" ? (
        <circle cx={x} cy={y} r="50" fill="transparent" stroke="none" />
      ) : (
        <rect
          x={x - 55}
          y={y - 48}
          width="110"
          height="96"
          fill="transparent"
          stroke="none"
        />
      )}

      {/* Chairs */}
      {chairs.map((chair, i) => (
        <circle
          key={i}
          cx={chair.cx}
          cy={chair.cy}
          r={CHAIR_RADIUS}
          fill={colors.chairFill}
          stroke={colors.chairStroke}
          strokeWidth="1"
          style={{ transition: "all 0.3s ease" }}
        />
      ))}

      {/* Table shape */}
      {type === "round" ? (
        <circle
          cx={x}
          cy={y}
          r={position.radius || 28}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="1.5"
          filter={isSelected ? "url(#table-glow)" : undefined}
          style={{ transition: "all 0.3s ease" }}
        />
      ) : (
        <rect
          x={x - (position.width || 72) / 2}
          y={y - (position.height || 42) / 2}
          width={position.width || 72}
          height={position.height || 42}
          rx="4"
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="1.5"
          filter={isSelected ? "url(#table-glow)" : undefined}
          style={{ transition: "all 0.3s ease" }}
        />
      )}

      {/* Table name */}
      <text
        x={x}
        y={y - 4}
        textAnchor="middle"
        dominantBaseline="central"
        fill={colors.text}
        fontSize="12"
        fontWeight="600"
        fontFamily="'Playfair Display', serif"
        style={{ transition: "fill 0.3s ease", pointerEvents: "none" }}
      >
        {displayName}
      </text>

      {/* Capacity */}
      <text
        x={x}
        y={y + 12}
        textAnchor="middle"
        fill={colors.text}
        fontSize="9"
        opacity="0.7"
        fontFamily="'Playfair Display', serif"
        style={{ pointerEvents: "none" }}
      >
        {table.capacity} seats
      </text>

      {/* Reserved label */}
      {!isAvailable && (
        <text
          x={x}
          y={y + 25}
          textAnchor="middle"
          fill="rgba(245,245,240,0.25)"
          fontSize="8"
          fontFamily="'Playfair Display', serif"
          letterSpacing="0.15em"
          style={{ pointerEvents: "none" }}
        >
          RESERVED
        </text>
      )}

      {/* Selected checkmark badge */}
      {isSelected && (
        <g style={{ pointerEvents: "none" }}>
          <circle
            cx={x + (type === "round" ? 22 : 32)}
            cy={y - (type === "round" ? 22 : 18)}
            r="10"
            fill="#C9A227"
          />
          <polyline
            points={`${x + (type === "round" ? 17 : 27)},${y - (type === "round" ? 22 : 18)} ${x + (type === "round" ? 20 : 30)},${y - (type === "round" ? 19 : 15)} ${x + (type === "round" ? 27 : 37)},${y - (type === "round" ? 25 : 21)}`}
            stroke="#000"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* Hover/focus tooltip */}
      {isHighlighted && isAvailable && !isSelected && (
        <g style={{ pointerEvents: "none" }}>
          <rect
            x={x - 55}
            y={y - (type === "round" ? 60 : 54)}
            width="110"
            height={table.label ? 34 : 24}
            rx="4"
            fill="rgba(0,0,0,0.88)"
            stroke="rgba(201,162,39,0.4)"
            strokeWidth="1"
          />
          <text
            x={x}
            y={y - (type === "round" ? 46 : 40)}
            textAnchor="middle"
            fill="#C9A227"
            fontSize="10"
            fontFamily="'Playfair Display', serif"
          >
            Click to select
          </text>
          {table.label && (
            <text
              x={x}
              y={y - (type === "round" ? 34 : 28)}
              textAnchor="middle"
              fill="rgba(245,245,240,0.6)"
              fontSize="9"
              fontFamily="'Playfair Display', serif"
            >
              {truncateLabel(table.label, 16)}
            </text>
          )}
        </g>
      )}
    </g>
  );
}

// ─── Color Helpers ──────────────────────────────────────────────

function getTableColors(
  isAvailable: boolean,
  isSelected: boolean,
  isHighlighted: boolean,
) {
  if (!isAvailable)
    return {
      fill: "rgba(245,245,240,0.03)",
      stroke: "rgba(245,245,240,0.12)",
      text: "rgba(245,245,240,0.2)",
      chairFill: "rgba(245,245,240,0.06)",
      chairStroke: "rgba(245,245,240,0.1)",
    };
  if (isSelected)
    return {
      fill: "rgba(201,162,39,0.2)",
      stroke: "#C9A227",
      text: "#C9A227",
      chairFill: "rgba(201,162,39,0.15)",
      chairStroke: "rgba(201,162,39,0.6)",
    };
  if (isHighlighted)
    return {
      fill: "rgba(201,162,39,0.12)",
      stroke: "rgba(201,162,39,0.7)",
      text: "rgba(201,162,39,0.9)",
      chairFill: "rgba(201,162,39,0.1)",
      chairStroke: "rgba(201,162,39,0.5)",
    };
  return {
    fill: "rgba(201,162,39,0.06)",
    stroke: "rgba(201,162,39,0.35)",
    text: "rgba(245,245,240,0.6)",
    chairFill: "rgba(201,162,39,0.05)",
    chairStroke: "rgba(201,162,39,0.25)",
  };
}

function getChairPositions(
  position: TablePosition,
): { cx: number; cy: number }[] {
  const { x, y, type } = position;
  if (type === "round") {
    const r = (position.radius || 28) + CHAIR_GAP + CHAIR_RADIUS;
    return [
      { cx: x, cy: y - r },
      { cx: x + r, cy: y },
      { cx: x, cy: y + r },
      { cx: x - r, cy: y },
    ];
  }
  const hw = (position.width || 72) / 2 + CHAIR_GAP + CHAIR_RADIUS;
  const qh = (position.height || 42) / 4;
  return [
    { cx: x - hw, cy: y - qh },
    { cx: x - hw, cy: y + qh },
    { cx: x + hw, cy: y - qh },
    { cx: x + hw, cy: y + qh },
  ];
}

// ─── Card Fallback (mobile) ─────────────────────────────────────

function TableCard({
  table,
  isSelected,
  onSelect,
}: {
  table: TableData;
  isSelected: boolean;
  onSelect: (tableId: string, capacity: number) => void;
}) {
  const isAvailable = table.available;

  return (
    <motion.button
      type="button"
      disabled={!isAvailable}
      onClick={() => onSelect(table.id, table.capacity)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={isAvailable ? { scale: 1.02 } : undefined}
      whileTap={isAvailable ? { scale: 0.98 } : undefined}
      className={`
        relative p-4 text-left transition-all duration-200 border
        ${
          !isAvailable
            ? "border-cream/10 bg-black/20 cursor-not-allowed"
            : isSelected
              ? "border-gold bg-gold/10 shadow-[0_0_20px_rgba(201,162,39,0.15)]"
              : "border-gold/25 hover:border-gold/60 hover:bg-gold/5"
        }
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p
            className={`font-playfair text-sm tracking-wider ${
              !isAvailable
                ? "text-cream/20"
                : isSelected
                  ? "text-gold font-semibold"
                  : "text-cream/90"
            }`}
          >
            {table.name}
          </p>
          {table.label && (
            <p
              className={`font-playfair text-xs mt-0.5 ${
                !isAvailable ? "text-cream/10" : "text-gold/60"
              }`}
            >
              {table.label}
            </p>
          )}
        </div>
        <div
          className={`flex items-center gap-1 ${
            !isAvailable
              ? "text-cream/15"
              : isSelected
                ? "text-gold"
                : "text-cream/50"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span className="font-playfair text-xs">{table.capacity}</span>
        </div>
      </div>

      {!isAvailable && (
        <p className="font-playfair text-[10px] text-cream/20 mt-2 uppercase tracking-wider">
          Reserved
        </p>
      )}

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2"
        >
          <Check className="w-4 h-4 text-gold" />
        </motion.div>
      )}
    </motion.button>
  );
}

// ─── Main Floor Map Component ───────────────────────────────────

export default function FloorMap({
  tables,
  selectedTableId,
  onSelect,
}: FloorMapProps) {
  const mappedTables = tables.slice(0, TABLE_POSITIONS.length);
  const overflowTables = tables.slice(TABLE_POSITIONS.length);

  const selectedTable = useMemo(
    () => tables.find((t) => t.id === selectedTableId) ?? null,
    [tables, selectedTableId],
  );

  return (
    <div className="space-y-4">
      {/* Desktop: SVG Floor Map (hidden on small screens) */}
      <div className="hidden sm:block">
        <div className="relative border border-gold/20 bg-black/60 overflow-hidden">
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 py-2.5 px-4 border-b border-gold/10 bg-black/40">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border border-gold/50 bg-gold/10" />
              <span className="font-playfair text-[10px] text-cream/50 tracking-wider uppercase">
                Available
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border-2 border-gold bg-gold/25 shadow-[0_0_6px_rgba(201,162,39,0.4)]" />
              <span className="font-playfair text-[10px] text-cream/50 tracking-wider uppercase">
                Selected
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border border-cream/15 bg-cream/5" />
              <span className="font-playfair text-[10px] text-cream/50 tracking-wider uppercase">
                Reserved
              </span>
            </div>
          </div>

          {/* SVG Map */}
          <svg
            viewBox="0 0 800 520"
            className="w-full h-auto"
            style={{ minHeight: "280px", maxHeight: "450px" }}
            role="group"
            aria-label="Restaurant floor plan - select your table"
          >
            <FloorBackground />
            <Furniture />
            {mappedTables.map((table, index) => (
              <TableElement
                key={table.id}
                table={table}
                position={TABLE_POSITIONS[index]}
                isSelected={selectedTableId === table.id}
                onSelect={onSelect}
              />
            ))}
          </svg>
        </div>

        {/* Overflow tables for desktop */}
        {overflowTables.length > 0 && (
          <div className="mt-3 space-y-2">
            <p className="font-playfair text-xs text-cream/40 tracking-wider uppercase">
              Additional Tables
            </p>
            <div className="grid grid-cols-2 gap-2">
              {overflowTables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  isSelected={selectedTableId === table.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Card grid fallback (shown on small screens) */}
      <div className="sm:hidden grid grid-cols-1 gap-3">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            isSelected={selectedTableId === table.id}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Selected table info bar */}
      {selectedTable && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-4 py-3 border border-gold/30 bg-gold/5"
        >
          <div className="flex items-center gap-3">
            <Check className="w-4 h-4 text-gold" />
            <span className="font-playfair text-sm text-cream/90 tracking-wider">
              {selectedTable.name}
              {selectedTable.label && (
                <span className="text-gold/60 ml-2">{selectedTable.label}</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-cream/50">
            <Users className="w-3.5 h-3.5" />
            <span className="font-playfair text-xs">
              {selectedTable.capacity} seats
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
