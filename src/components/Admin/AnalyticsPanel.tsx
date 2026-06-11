import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import type { WebAnalyticsSnapshot } from '../../types';
import { formatCompactNumber, formatDateLabel } from '../../lib/formatters';

const GREEN = '#8dc63f';
const DARK_GREEN = '#173b2d';
const GRID = '#e7e5dc';
const AXIS_TEXT = '#6b7a6b';

const PIE_COLORS = ['#173b2d', '#2f6b4f', '#6f8f2f', '#8dc63f', '#b5d98a', '#dce2cd'];

const RANGE_OPTIONS = [
  { days: 7, label: '7 dias' },
  { days: 30, label: '30 dias' },
  { days: 90, label: '90 dias' }
];

const tooltipStyle: React.CSSProperties = {
  borderRadius: 16,
  border: '1px solid #dce2cd',
  background: '#ffffff',
  boxShadow: '0 16px 40px rgba(15,23,42,0.12)',
  fontSize: 13
};

const axisTick = { fontSize: 12, fill: AXIS_TEXT };

function ChartCard({
  label,
  title,
  children
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-[32px] border border-[#dce2cd] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
      <p className="text-sm uppercase tracking-[0.22em] text-[#6f8f2f]">{label}</p>
      <h2 className="mt-2 text-2xl font-semibold text-[#173b2d]">{title}</h2>
      <div className="mt-6">{children}</div>
    </article>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-3xl bg-[#f0ede6]">
      <p className="text-sm text-[#6b7a6b]">{message}</p>
    </div>
  );
}

function SharePie({ data, emptyMessage }: {
  data: { name: string; visitors: number }[];
  emptyMessage: string;
}) {
  if (data.length === 0) {
    return <EmptyChart message={emptyMessage} />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="visitors"
          nameKey="name"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={3}
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) => [`${formatCompactNumber(Number(value))} visitantes`, '']}
        />
        <Legend wrapperStyle={{ fontSize: 13 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function RankList({ items, emptyMessage }: {
  items: { label: string; value: number; detail?: string }[];
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return <EmptyChart message={emptyMessage} />;
  }

  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl bg-[#f0ede6] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 truncate font-medium text-[#0f172a]">{item.label}</p>
            <span className="flex-shrink-0 text-sm font-semibold text-[#173b2d]">
              {formatCompactNumber(item.value)}
              {item.detail ? ` ${item.detail}` : ''}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#8dc63f]"
              style={{ width: `${Math.max(4, (item.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPanel() {
  const [stats, setStats] = useState<WebAnalyticsSnapshot | null>(null);
  const [rangeDays, setRangeDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);

      try {
        const response = await fetch(`/api/analytics/stats?days=${rangeDays}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || 'No se pudieron cargar las analiticas');
        }

        setStats(data as WebAnalyticsSnapshot);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar las analiticas');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [rangeDays]
  );

  useEffect(() => {
    void load();

    // Refresco silencioso cada 60s para mantener el "online ahora" al dia.
    const interval = window.setInterval(() => void load(true), 60000);
    return () => window.clearInterval(interval);
  }, [load]);

  if (loading && !stats) {
    return (
      <div className="flex h-72 items-center justify-center rounded-[32px] border border-[#dce2cd] bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#8dc63f]" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-[32px] border border-dashed border-[#dce2cd] bg-white px-8 py-16 text-center">
        <p className="text-lg font-semibold text-[#0f172a]">
          {error || 'No se pudieron cargar las analiticas.'}
        </p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#173b2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f2a1d]"
        >
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </button>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Visitantes hoy',
      value: formatCompactNumber(stats.today.visitors),
      detail: `${formatCompactNumber(stats.today.pageviews)} paginas vistas`
    },
    {
      label: 'Visitas hoy',
      value: formatCompactNumber(stats.today.sessions),
      detail: 'sesiones iniciadas hoy'
    },
    {
      label: `Visitantes (${stats.rangeDays} dias)`,
      value: formatCompactNumber(stats.totals.visitors),
      detail: `${formatCompactNumber(stats.totals.sessions)} visitas en total`
    },
    {
      label: `Paginas vistas (${stats.rangeDays} dias)`,
      value: formatCompactNumber(stats.totals.pageviews),
      detail: `${stats.avgPagesPerSession.toFixed(1)} paginas por visita`
    },
    {
      label: 'Duracion promedio',
      value: `${stats.avgSessionMinutes.toFixed(1)} min`,
      detail: 'por visita'
    }
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.days}
              type="button"
              onClick={() => setRangeDays(option.days)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                rangeDays === option.days
                  ? 'bg-[#173b2d] text-white'
                  : 'border border-[#dce2cd] bg-white text-[#475569] hover:border-[#8dc63f]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => void load(true)}
          className="inline-flex items-center gap-2 rounded-full border border-[#dce2cd] bg-white px-4 py-2 text-sm font-medium text-[#475569] transition hover:border-[#8dc63f]"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-6">
        <article className="rounded-[30px] bg-[#173b2d] p-5 text-white shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8dc63f] opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#8dc63f]" />
            </span>
            <p className="text-sm text-[#a8c49a]">En linea ahora</p>
          </div>
          <p className="mt-3 text-3xl font-semibold">{stats.onlineNow}</p>
          <p className="mt-2 text-sm text-[#a8c49a]">
            {stats.onlineNow === 1 ? 'persona navegando' : 'personas navegando'}
          </p>
        </article>

        {kpis.map((card) => (
          <article
            key={card.label}
            className="rounded-[30px] border border-[#dce2cd] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
          >
            <p className="text-sm text-[#6b7a6b]">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-[#173b2d]">{card.value}</p>
            <p className="mt-2 text-sm text-[#6f8f2f]">{card.detail}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard label="Trafico" title={`Visitas por dia (${stats.rangeDays} dias)`}>
          {stats.dailySeries.length === 0 ? (
            <EmptyChart message="Todavia no hay visitas registradas." />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.dailySeries}>
                <defs>
                  <linearGradient id="webViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GREEN} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="webVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={DARK_GREEN} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={DARK_GREEN} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke={GRID} vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatDateLabel(String(value))}
                />
                <YAxis
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelFormatter={(value) => formatDateLabel(String(value))}
                />
                <Legend wrapperStyle={{ fontSize: 13 }} />
                <Area
                  type="monotone"
                  dataKey="pageviews"
                  name="Paginas vistas"
                  stroke={GREEN}
                  strokeWidth={2.5}
                  fill="url(#webViews)"
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Visitantes"
                  stroke={DARK_GREEN}
                  strokeWidth={2.5}
                  fill="url(#webVisitors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard label="Horarios" title="Picos por hora del dia">
          {stats.totals.pageviews === 0 ? (
            <EmptyChart message="Todavia no hay visitas registradas." />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.hourly}>
                <CartesianGrid strokeDasharray="4 4" stroke={GRID} vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  interval={2}
                  tickFormatter={(value) => `${value}h`}
                />
                <YAxis
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelFormatter={(value) => `${value}:00 - ${value}:59`}
                  formatter={(value, name) => [formatCompactNumber(Number(value)), name]}
                  cursor={{ fill: 'rgba(141,198,63,0.08)' }}
                />
                <Bar
                  dataKey="pageviews"
                  name="Paginas vistas"
                  fill={GREEN}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <ChartCard label="Dispositivos" title="Desde donde entran">
          <SharePie data={stats.devices} emptyMessage="Sin datos de dispositivos." />
        </ChartCard>

        <ChartCard label="Navegadores" title="Con que navegan">
          <SharePie data={stats.browsers} emptyMessage="Sin datos de navegadores." />
        </ChartCard>

        <ChartCard label="Sistemas" title="Sistemas operativos">
          <SharePie data={stats.operatingSystems} emptyMessage="Sin datos de sistemas." />
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <ChartCard label="Carrito" title="Mas agregados al carrito">
          <RankList
            items={stats.cartTopProducts.map((product) => ({
              label: product.name,
              value: product.adds,
              detail: product.adds === 1 ? 'vez' : 'veces'
            }))}
            emptyMessage="Todavia nadie agrego productos al carrito."
          />
        </ChartCard>

        <ChartCard label="Contenido" title="Paginas mas visitadas">
          <RankList
            items={stats.topPages.map((page) => ({
              label: page.path,
              value: page.pageviews,
              detail: page.pageviews === 1 ? 'vista' : 'vistas'
            }))}
            emptyMessage="Todavia no hay paginas registradas."
          />
        </ChartCard>

        <ChartCard label="Fuentes" title="De donde llegan las visitas">
          <RankList
            items={stats.referrers.map((referrer) => ({
              label: referrer.source,
              value: referrer.sessions,
              detail: referrer.sessions === 1 ? 'visita' : 'visitas'
            }))}
            emptyMessage="Todavia no hay fuentes registradas."
          />
        </ChartCard>
      </div>
    </div>
  );
}
