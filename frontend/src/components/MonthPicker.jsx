import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';

const pickerStyles = `
  .rdp-root {
    --rdp-accent-color: var(--accent);
    color: var(--text);
    font-family: inherit;
    margin: 0;
  }

  /* ── Caption row: just the month label, no dropdowns ── */
  .rdp-month_caption {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 8px;
  }
  .rdp-caption_label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: 0.04em;
    pointer-events: none;
  }

  /* Hide the built-in nav — we render our own */
  .rdp-nav { display: none; }

  /* ── Weekday headers ── */
  .rdp-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 32px);
    gap: 2px;
    margin-bottom: 4px;
  }
  .rdp-weekday {
    font-size: 10px;
    font-weight: 600;
    color: var(--text-3);
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 4px 0;
    width: 32px;
  }
  abbr[title] {
    text-decoration: none;
    cursor: default;
  }

  /* ── Day grid ── */
  .rdp-weeks { display: flex; flex-direction: column; gap: 2px; }
  .rdp-week {
    display: grid;
    grid-template-columns: repeat(7, 32px);
    gap: 2px;
  }
  .rdp-day {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rdp-day_button {
    width: 100%;
    height: 100%;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 6px;
    color: var(--text-2);
    font-size: 12px;
    cursor: pointer;
    transition: background 0.1s, color 0.1s, border-color 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
  .rdp-day_button:hover {
    background: var(--surface-3);
    border-color: var(--border);
    color: var(--text);
  }
  .rdp-today .rdp-day_button {
    border-color: var(--border-act);
    color: var(--text);
  }
  .rdp-selected .rdp-day_button {
    background: var(--accent);
    border-color: var(--accent);
    color: #0a0a0b;
    font-weight: 700;
  }
  .rdp-selected .rdp-day_button:hover {
    background: var(--accent);
    color: #0a0a0b;
  }
  .rdp-outside .rdp-day_button { color: var(--text-3); }
  .rdp-disabled .rdp-day_button { opacity: 0.25; cursor: not-allowed; }
`;

if (
  typeof document !== 'undefined' &&
  !document.getElementById('rdp-dark-theme')
) {
  const tag = document.createElement('style');
  tag.id = 'rdp-dark-theme';
  tag.textContent = pickerStyles;
  document.head.appendChild(tag);
}

const NAV_BTN = {
  background: 'var(--surface-3)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  color: 'var(--text-2)',
  width: 26,
  height: 26,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: 14,
  lineHeight: 1,
  padding: 0,
  flexShrink: 0,
};

// Parse "YYYY-MM" safely — avoids Invalid Date from "YYYY-MM-01" timezone issues
function parseYearMonth(value) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return null;
  const [y, m] = value.split('-').map(Number);
  return new Date(y, m - 1, 1); // local time, no UTC shift
}

function toYearMonth(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${yyyy}-${mm}`;
}

export default function MonthPicker({
  value,
  onChange,
  placeholder = 'Pick date',
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = parseYearMonth(value);
  const [month, setMonth] = useState(() => selected ?? new Date());

  // Sync calendar view when value changes externally
  useEffect(() => {
    const d = parseYearMonth(value);
    if (d) setMonth(d);
  }, [value]);

  

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  function handleSelect(date) {
    if (!date) return;
    onChange(toYearMonth(date));
    setOpen(false);
  }

  function prevMonth() {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }
  function nextMonth() {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }
  function prevYear() {
    setMonth((m) => new Date(m.getFullYear() - 1, m.getMonth(), 1));
  }
  function nextYear() {
    setMonth((m) => new Date(m.getFullYear() + 1, m.getMonth(), 1));
  }

  function clear(e) {
    e.stopPropagation();
    onChange('');
  }

  const displayLabel = selected
    ? selected.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : placeholder;

  const monthLabel = month.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* ── Trigger ── */}
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '0 10px',
          height: 36,
          background: 'var(--surface-2)',
          border: `1px solid ${open ? 'var(--border-act)' : 'var(--border)'}`,
          borderRadius: 8,
          color: selected ? 'var(--text)' : 'var(--text-3)',
          fontSize: 13,
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'border-color 0.15s',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <svg
            width='13'
            height='13'
            viewBox='0 0 16 16'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
            style={{ opacity: 0.5, flexShrink: 0 }}
          >
            <rect x='1' y='3' width='14' height='12' rx='2' />
            <path d='M5 1v4M11 1v4M1 7h14' />
          </svg>
          {displayLabel}
        </span>
        {selected && (
          <span
            onClick={clear}
            title='Clear'
            style={{
              color: 'var(--text-3)',
              fontSize: 18,
              lineHeight: 1,
              padding: '0 1px',
              transition: 'color 0.1s',
            }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--red)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-3)')}
          >
            ×
          </span>
        )}
      </div>

      {/* ── Dropdown ── */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: 'var(--surface-2)',
            border: '1px solid var(--border-act)',
            borderRadius: 12,
            padding: '12px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
            width: 260,
          }}
        >
          {/* Custom nav: prev-year | prev-month | label | next-month | next-year */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
              gap: 4,
            }}
          >
            <div style={{ display: 'flex', gap: 3 }}>
              <button onClick={prevYear} style={NAV_BTN} title='Previous year'>
                «
              </button>
              <button
                onClick={prevMonth}
                style={NAV_BTN}
                title='Previous month'
              >
                ‹
              </button>
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text)',
                letterSpacing: '0.04em',
                textAlign: 'center',
                flex: 1,
              }}
            >
              {monthLabel}
            </span>
            <div style={{ display: 'flex', gap: 3 }}>
              <button onClick={nextMonth} style={NAV_BTN} title='Next month'>
                ›
              </button>
              <button onClick={nextYear} style={NAV_BTN} title='Next year'>
                »
              </button>
            </div>
          </div>

          {/* DayPicker — no caption, no built-in nav */}
          <DayPicker
            mode='single'
            selected={selected ?? undefined}
            onSelect={handleSelect}
            month={month}
            onMonthChange={setMonth}
            hideNavigation
            captionLayout='label'
            showOutsideDays
            styles={{
              month_caption: { display: 'none' }, // hide default caption — we drew our own above
            }}
          />
        </div>
      )}
    </div>
  );
}
